import express from 'express';
import { get500ErrorPage } from '../controllers/errorController';

const router = express.Router();

router.get('/500', get500ErrorPage);

export default router;
