/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * bobClient.js
 *
 * Direct Node.js Execution Client for Official IBM Bob Shell 2.0.3 CLI (Headless Mode).
 * Spawns Node.js directly targeting the Bob Shell script with shell: false and windowsHide: true,
 * ensuring prompt arguments are passed safely without shell interpretation vulnerabilities.
 */

import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Resolves the Node executable and target script for Bob Shell 2.0.3.
 */
function resolveBobTarget() {
  if (process.env.BOB_JS_PATH && fs.existsSync(process.env.BOB_JS_PATH)) {
    return { command: process.execPath, argsPrefix: [process.env.BOB_JS_PATH] };
  }

  // Windows npm global package location
  const appData = process.env.APPDATA || 'C:\\Users\\Asus\\AppData\\Roaming';
  const candidateJs = path.join(appData, 'npm', 'node_modules', 'bobshell', 'dist', 'bob.js');
  if (fs.existsSync(candidateJs)) {
    return { command: process.execPath, argsPrefix: [candidateJs] };
  }

  // Try locating via system PATH lookup
  try {
    const cmd = process.platform === 'win32' ? 'where.exe bob' : 'which bob';
    const output = execSync(cmd, { encoding: 'utf8' });
    const lines = output.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const cmdFile = lines.find((l) => l.endsWith('.cmd') || l.endsWith('.exe')) || lines[0];

    if (cmdFile && cmdFile.endsWith('.cmd')) {
      const cmdDir = path.dirname(cmdFile);
      const jsTarget = path.join(cmdDir, 'node_modules', 'bobshell', 'dist', 'bob.js');
      if (fs.existsSync(jsTarget)) {
        return { command: process.execPath, argsPrefix: [jsTarget] };
      }
    }
  } catch (err) {
    // Ignore lookup errors
  }

  return { command: process.execPath, argsPrefix: [candidateJs] };
}

/**
 * Serializes live operational dataset into structured text for prompt context grounding.
 */
function serializeOperationalContext(dataContext = {}) {
  const shipments = dataContext.shipments || [];
  const disruptions = dataContext.disruptions || [];
  const routes = dataContext.routes || [];
  const fleetAssets = dataContext.fleetAssets || dataContext.fleet || [];
  const coldChainReadings = dataContext.temperatureReadings || [];

  let contextStr = "### LIVE SUPPLYGUARD OPERATIONAL DATASET ###\n";

  contextStr += "\n-- ACTIVE SHIPMENTS --\n";
  shipments.forEach((s) => {
    const id = s.shipmentId || s.id;
    const origin = s.origin || s.currentLocation?.city || 'Unknown';
    const dest = s.destination || 'Unknown';
    contextStr += `- Shipment ID: ${id} | Cargo: ${s.cargoType || 'Standard'} | Route: ${origin} -> ${dest} | Status: ${s.status} | Priority: ${s.priority || 'Normal'}\n`;
  });

  contextStr += "\n-- ACTIVE DISRUPTIONS --\n";
  disruptions.forEach((d) => {
    const id = d.disruptionId || d.id;
    contextStr += `- Disruption ID: ${id} | Title: ${d.title || d.name} | Location: ${d.location} | Severity: ${d.severity} | Details: ${d.description || ''}\n`;
  });

  contextStr += "\n-- TRADE ROUTES & CORRIDORS --\n";
  routes.forEach((r) => {
    const id = r.routeId || r.id;
    contextStr += `- Route ID: ${id} | Name: ${r.routeName || r.name} | Distance: ${r.distanceKm}km | RiskScore: ${r.riskScore} | Available: ${r.availability ?? true}\n`;
  });

  contextStr += "\n-- FLEET ASSETS --\n";
  fleetAssets.forEach((f) => {
    const id = f.fleetAssetId || f.id;
    const loc = typeof f.currentLocation === 'object' ? f.currentLocation.city : (f.currentLocation || f.location);
    contextStr += `- Asset ID: ${id} | Name: ${f.assetName || f.name} | Status: ${f.status} | Location: ${loc} | Utilization: ${f.utilization || 0}%\n`;
  });

  contextStr += "\n-- COLD-CHAIN SENSOR READINGS --\n";
  coldChainReadings.forEach((c) => {
    const id = c.shipmentId || c.readingId;
    contextStr += `- Shipment: ${id} | Temp: ${c.temperatureCelsius}°C | Safe Range: ${c.allowedMinTemp ?? 2.0}°C to ${c.allowedMaxTemp ?? 8.0}°C | Thermal Breach: ${c.isExcursion ? 'YES (' + c.severity + ')' : 'NO'}\n`;
  });

  return contextStr;
}

/**
 * Extracts natural language assistant text from Bob Shell terminal output.
 */
function parseBobOutput(stdout) {
  if (!stdout || typeof stdout !== 'string') return '';

  // Remove ANSI escape sequences (colors, formatting)
  const plainText = stdout
    .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '')
    .replace(/[^\x20-\x7E\n\r\t]/g, '');

  // Extract content inside Assistant block
  const assistantMatch = plainText.match(/Assistant\s*\(\d+\)[^\n]*\n+([\s\S]*?)(?=\n─{5,}|\nTask Summary|$)/i);

  if (assistantMatch && assistantMatch[1]) {
    return assistantMatch[1].trim();
  }

  // Fallback: clean headers if assistant marker is absent
  return plainText
    .replace(/────────+[\s\S]*?User \(\d+\)[^\n]*/g, '')
    .replace(/Task Summary[\s\S]*/g, '')
    .trim();
}

/**
 * Invokes official IBM Bob Shell CLI in non-interactive headless mode via child_process spawn.
 * Spawns Node.js directly targeting Bob Shell script with shell: false.
 *
 * @param {Object} params
 * @param {string} params.prompt - Conversational user query
 * @param {Object} params.dataContext - Operational dataset
 * @param {number} [params.timeoutMs=25000] - Process timeout in ms
 * @returns {Promise<Object>} Execution result containing success status, parsed response text, and mode
 */
export async function callRealIbmBobApi({ prompt, dataContext = {}, timeoutMs = 25000 }) {
  const apiKey = process.env.BOB_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      error: 'BOB_API_KEY is missing or empty in environment.'
    };
  }

  const { command, argsPrefix } = resolveBobTarget();
  const operationalContext = serializeOperationalContext(dataContext);

  const fullPrompt =
    `You are IBM Bob, the operational AI decision-support assistant for SupplyGuard AI.\n` +
    `Respond directly and concisely to the dispatcher query below using the live operational dataset.\n` +
    `Structure your operational guidance using these section titles:\n` +
    `- Situation\n- Risk Assessment\n- Rationale\n- Recommended Immediate Action\n- Expected Benefit\n- Residual Risk\n- Contingency Plan\n\n` +
    `${operationalContext}\n\n` +
    `DISPATCHER QUERY: ${prompt}`;

  const args = [...argsPrefix, 'run', '--disable-mcp', '--disable-subagents', fullPrompt];

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let completed = false;

    const child = spawn(command, args, {
      shell: false,
      windowsHide: true,
      env: { ...process.env },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const timer = setTimeout(() => {
      if (!completed) {
        completed = true;
        try { child.kill('SIGTERM'); } catch (e) { /* ignore */ }
        resolve({
          success: false,
          error: `Bob Shell CLI execution timed out after ${timeoutMs}ms.`
        });
      }
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (err) => {
      if (!completed) {
        completed = true;
        clearTimeout(timer);
        resolve({
          success: false,
          error: `Failed to spawn Bob target (${command}): ${err.message}`
        });
      }
    });

    child.on('close', (code) => {
      if (!completed) {
        completed = true;
        clearTimeout(timer);

        if (code === 0) {
          const parsedText = parseBobOutput(stdout);
          if (parsedText && parsedText.length > 0) {
            resolve({
              success: true,
              response: parsedText,
              executableUsed: `${command} ${argsPrefix.join(' ')}`.trim(),
              shellMode: false
            });
          } else {
            resolve({
              success: false,
              error: 'Bob Shell returned exit code 0 but assistant response text could not be parsed.'
            });
          }
        } else {
          resolve({
            success: false,
            error: `Bob Shell CLI exited with code ${code}. Stderr: ${stderr.slice(0, 200)}`
          });
        }
      }
    });
  });
}
