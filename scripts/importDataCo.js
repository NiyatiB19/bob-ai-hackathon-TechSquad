/**
 * SupplyGuard AI — DataCo Supply Chain Dataset Importer
 * Stream-loads and normalizes CSV records into MongoDB with batch upserts.
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const { connectDatabase } = require('../src/backend/config/db');
const ShipmentModel = require('../src/backend/models/ShipmentModel');
const RouteModel = require('../src/backend/models/RouteModel');

const CSV_PATH = path.resolve(__dirname, '../data/kaggle/DataCoSupplyChainDataset.csv');
const BATCH_SIZE = 5000;

// Geocoding helper dictionary for origin/destination locations
const CITY_COORDINATES = {
  // Common DataCo Customer / Order Cities
  'Caguas': [18.2341, -66.0485],
  'San Jose': [37.3382, -121.8863],
  'Los Angeles': [34.0522, -118.2437],
  'Chicago': [41.8781, -87.6298],
  'Brooklyn': [40.6782, -73.9442],
  'New York': [40.7128, -74.0060],
  'Miami': [25.7617, -80.1918],
  'Bekasi': [-6.2383, 106.9756],
  'Bikaner': [28.0229, 73.3119],
  'Jakarta': [-6.2088, 106.8456],
  'Manila': [14.5995, 120.9842],
  'Bangkok': [13.7563, 100.5018],
  'Shanghai': [31.2304, 121.4737],
  'Singapore': [1.3521, 103.8198],
  'Mumbai': [19.0760, 72.8777],
  'Tokyo': [35.6762, 139.6503],
  'Sydney': [-33.8688, 151.2093],
  'London': [51.5074, -0.1278],
  'Paris': [48.8566, 2.3522],
  'Frankfurt': [50.1109, 8.6821],
  'Rotterdam': [51.9244, 4.4777],
  'Sao Paulo': [-23.5505, -46.6333],
  'Mexico City': [19.4326, -99.1332],
  'Bogota': [4.7110, -74.0721],
  'Cairo': [30.0444, 31.2357],
  'Johannesburg': [-26.2041, 28.0473],
  'Dubai': [25.2048, 55.2708]
};

function getCityCoords(cityName, defaultLat = 0, defaultLng = 0) {
  if (!cityName) return { lat: defaultLat, lng: defaultLng };
  const trimmed = cityName.trim();
  if (CITY_COORDINATES[trimmed]) {
    return { lat: CITY_COORDINATES[trimmed][0], lng: CITY_COORDINATES[trimmed][1] };
  }
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase())) {
      return { lat: coords[0], lng: coords[1] };
    }
  }
  // Generate deterministic synthetic lat/lng from string hash if city not explicitly in dictionary
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i);
    hash |= 0;
  }
  const pseudoLat = defaultLat !== 0 ? defaultLat : ((Math.abs(hash) % 120) - 60);
  const pseudoLng = defaultLng !== 0 ? defaultLng : ((Math.abs(hash * 3) % 360) - 180);
  return { lat: Number(pseudoLat.toFixed(4)), lng: Number(pseudoLng.toFixed(4)) };
}

function parseDate(dateStr) {
  if (!dateStr) return new Date();
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function mapStatus(rawDeliveryStatus, rawOrderStatus) {
  const deliveryStatus = (rawDeliveryStatus || '').trim().toLowerCase();
  const orderStatus = (rawOrderStatus || '').trim().toUpperCase();

  if (deliveryStatus === 'late delivery') {
    return 'delayed';
  }
  if (deliveryStatus === 'shipping canceled' || orderStatus === 'CANCELED') {
    return 'cancelled';
  }
  if (deliveryStatus === 'advance shipping' || deliveryStatus === 'shipping on time') {
    if (orderStatus === 'COMPLETE' || orderStatus === 'CLOSED') {
      return 'delivered';
    }
    return 'in-transit';
  }
  return 'in-transit';
}

async function runImport() {
  console.log('==================================================');
  console.log('SupplyGuard AI — DataCo Supply Chain Import Started');
  console.log('==================================================');
  
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`[Importer Error] DataCo CSV file not found at: ${CSV_PATH}`);
    process.exit(1);
  }

  await connectDatabase();

  let totalRecords = 0;
  let validRecords = 0;
  let skippedRecords = 0;
  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  let shipmentBatch = [];
  const routeMap = new Map(); // Store unique routes

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(CSV_PATH, { encoding: 'latin1' })
      .pipe(csv());

    stream.on('data', (row) => {
      totalRecords++;

      try {
        const orderId = (row['Order Id'] || '').trim();
        const orderItemId = (row['Order Item Id'] || '').trim();

        if (!orderId && !orderItemId) {
          skippedRecords++;
          return;
        }

        // Deterministic stable shipmentId
        const shipmentId = 'DC-' + (orderItemId || orderId);
        const trackingNumber = 'TRK-' + (orderId || orderItemId);

        // Origin coordinates from CSV
        const rawLat = parseFloat(row['Latitude']) || 0;
        const rawLng = parseFloat(row['Longitude']) || 0;
        const custCity = (row['Customer City'] || 'Unknown').trim();
        const custCountry = (row['Customer Country'] || 'Unknown').trim();
        const custState = (row['Customer State'] || '').trim();
        const originCoords = getCityCoords(custCity, rawLat, rawLng);

        // Destination location
        const destCity = (row['Order City'] || 'Unknown').trim();
        const destCountry = (row['Order Country'] || 'Unknown').trim();
        const destState = (row['Order State'] || '').trim();
        const destCoords = getCityCoords(destCity, 0, 0);

        // Dates
        const estimatedDeparture = parseDate(row['order date (DateOrders)']);
        const estimatedArrival = parseDate(row['shipping date (DateOrders)']);
        const shippingDate = parseDate(row['shipping date (DateOrders)']);

        // Financial & Cargo attributes
        const cargoType = (row['Product Name'] || row['Category Name'] || 'General Cargo').trim();
        const categoryName = (row['Category Name'] || 'General').trim();
        const customerSegment = (row['Customer Segment'] || 'Consumer').trim();
        const quantity = parseInt(row['Order Item Quantity'], 10) || 1;
        const salesUSD = parseFloat(row['Sales']) || parseFloat(row['Order Item Total']) || 0;
        const profitUSD = parseFloat(row['Order Profit Per Order']) || parseFloat(row['Order Item Profit Ratio']) || 0;
        const benefitPerOrderUSD = parseFloat(row['Benefit per order']) || 0;

        // Status & Risk
        const rawDeliveryStatus = row['Delivery Status'] || '';
        const rawOrderStatus = row['Order Status'] || '';
        const status = mapStatus(rawDeliveryStatus, rawOrderStatus);
        const lateDeliveryRisk = parseInt(row['Late_delivery_risk'], 10) || (status === 'delayed' ? 1 : 0);

        const daysForShippingReal = parseInt(row['Days for shipping (real)'], 10) || 0;
        const daysForShippingScheduled = parseInt(row['Days for shipment (scheduled)'], 10) || 0;
        const shippingMode = (row['Shipping Mode'] || 'Standard Class').trim();

        // Priority calculation based on shipping mode and late risk
        let priority = 'medium';
        if (shippingMode === 'Same Day' || shippingMode === 'First Class') priority = 'high';
        if (lateDeliveryRisk === 1 && status === 'delayed') priority = 'critical';

        const shipmentDoc = {
          shipmentId,
          trackingNumber,
          orderId,
          orderItemId,
          origin: {
            city: custCity,
            state: custState,
            country: custCountry,
            lat: originCoords.lat,
            lng: originCoords.lng
          },
          destination: {
            city: destCity,
            state: destState,
            country: destCountry,
            lat: destCoords.lat,
            lng: destCoords.lng
          },
          currentLocation: status === 'delivered' ? {
            city: destCity,
            country: destCountry,
            lat: destCoords.lat,
            lng: destCoords.lng
          } : {
            city: custCity,
            country: custCountry,
            lat: originCoords.lat,
            lng: originCoords.lng
          },
          cargoType,
          categoryName,
          customerSegment,
          quantity,
          salesUSD,
          profitUSD,
          benefitPerOrderUSD,
          priority,
          status,
          deliveryStatusDataCo: rawDeliveryStatus,
          orderStatus: rawOrderStatus,
          lateDeliveryRisk,
          daysForShippingReal,
          daysForShippingScheduled,
          shippingMode,
          estimatedDeparture,
          estimatedArrival,
          shippingDate,
          carrier: `DataCo ${shippingMode} Express`,
          temperatureSensitive: categoryName.toLowerCase().includes('food') || categoryName.toLowerCase().includes('health'),
          dataSource: 'DataCo Supply Chain Dataset'
        };

        // Track Route
        const routeKey = `${custCity}-${destCity}`;
        if (!routeMap.has(routeKey)) {
          const routeSlug = routeKey.toLowerCase().replace(/[^a-z0-9]/g, '-');
          routeMap.set(routeKey, {
            routeId: `R-${routeSlug}`,
            name: `${custCity}, ${custCountry} -> ${destCity}, ${destCountry}`,
            origin: { city: custCity, country: custCountry, lat: originCoords.lat, lng: originCoords.lng },
            destination: { city: destCity, country: destCountry, lat: destCoords.lat, lng: destCoords.lng },
            shipmentCount: 0,
            lateCount: 0,
            transportMode: shippingMode.toLowerCase().includes('same day') ? 'air' : 'sea',
            dataSource: 'DataCo Supply Chain Dataset'
          });
        }
        const routeObj = routeMap.get(routeKey);
        routeObj.shipmentCount++;
        if (lateDeliveryRisk === 1) routeObj.lateCount++;

        shipmentBatch.push({
          updateOne: {
            filter: { shipmentId },
            update: { $set: shipmentDoc },
            upsert: true
          }
        });

        validRecords++;

        // Process batch when reaching BATCH_SIZE
        if (shipmentBatch.length >= BATCH_SIZE) {
          stream.pause();
          const currentBatch = shipmentBatch;
          shipmentBatch = [];

          ShipmentModel.bulkWrite(currentBatch, { ordered: false })
            .then((res) => {
              insertedCount += res.upsertedCount || 0;
              updatedCount += res.modifiedCount || (currentBatch.length - (res.upsertedCount || 0));
              console.log(`[Import Progress] Processed ${validRecords} / ${totalRecords} records...`);
              stream.resume();
            })
            .catch((err) => {
              errorCount += currentBatch.length;
              console.error(`[Batch Error] ${err.message}`);
              stream.resume();
            });
        }
      } catch (err) {
        errorCount++;
        if (errorCount <= 10) {
          console.error(`[Row ${totalRecords} Error] ${err.message}`);
        }
      }
    });

    stream.on('end', async () => {
      try {
        // Flush remaining shipment batch
        if (shipmentBatch.length > 0) {
          const res = await ShipmentModel.bulkWrite(shipmentBatch, { ordered: false });
          insertedCount += res.upsertedCount || 0;
          updatedCount += res.modifiedCount || (shipmentBatch.length - (res.upsertedCount || 0));
        }

        // Upsert deterministic Routes into RouteModel
        console.log(`[Routes] Writing ${routeMap.size} unique DataCo routes into MongoDB...`);
        const routeBatch = Array.from(routeMap.values()).map(route => {
          const lateRate = route.shipmentCount > 0 ? (route.lateCount / route.shipmentCount) : 0;
          let risk = 'LOW';
          let status = 'available';
          if (lateRate > 0.4) { risk = 'CRITICAL'; status = 'disrupted'; }
          else if (lateRate > 0.25) { risk = 'HIGH'; status = 'congested'; }
          else if (lateRate > 0.1) { risk = 'MEDIUM'; }

          return {
            updateOne: {
              filter: { routeId: route.routeId },
              update: {
                $set: {
                  ...route,
                  risk,
                  status,
                  distanceKm: Math.round(1000 + Math.abs(route.origin.lat - route.destination.lat) * 100),
                  estimatedDurationHours: Math.round(24 + Math.abs(route.origin.lng - route.destination.lng) * 2)
                }
              },
              upsert: true
            }
          };
        });

        if (routeBatch.length > 0) {
          await RouteModel.bulkWrite(routeBatch, { ordered: false });
        }

        console.log('\n==================================================');
        console.log('DataCo import finished successfully!');
        console.log(`Total CSV records:   ${totalRecords}`);
        console.log(`Valid records:       ${validRecords}`);
        console.log(`Skipped records:     ${skippedRecords}`);
        console.log(`Processed (Upsert):  ${insertedCount + updatedCount}`);
        console.log(`Routes generated:    ${routeMap.size}`);
        console.log(`Errors encountered:  ${errorCount}`);
        console.log('==================================================\n');

        mongoose.connection.close();
        resolve();
      } catch (err) {
        console.error(`[Finalize Error] ${err.message}`);
        mongoose.connection.close();
        reject(err);
      }
    });

    stream.on('error', (err) => {
      console.error(`[Stream Error] ${err.message}`);
      mongoose.connection.close();
      reject(err);
    });
  });
}

runImport()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(`[Import Failed] ${err.message}`);
    process.exit(1);
  });
