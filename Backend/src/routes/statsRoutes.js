import express from 'express';
const router = express.Router();
import { getStats } from '../controller/statsController.js';

router.get('/', getStats);

export default router;
