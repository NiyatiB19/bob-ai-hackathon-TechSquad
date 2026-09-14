/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * bobRoutes.js
 *
 * Express Router definition for IBM Bob decision support endpoints.
 */

import { Router } from 'express';
import { handleBobQuery } from '../controllers/bobController.js';

const router = Router();

router.post('/query', handleBobQuery);

export default router;
