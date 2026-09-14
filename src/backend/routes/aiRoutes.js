/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * aiRoutes.js
 *
 * Express Router definition for AI analysis endpoints.
 */

import { Router } from 'express';
import { analyzeShipmentHandler } from '../controllers/aiController.js';

const router = Router();

router.post('/analyze', analyzeShipmentHandler);

export default router;
