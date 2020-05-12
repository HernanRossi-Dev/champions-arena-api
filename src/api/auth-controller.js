'use strict'

import express from 'express';
import AuthService from '../services/auth-service.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const response = await AuthService.authenticate();
  res.status(200).json(response).end();
});

export default router;