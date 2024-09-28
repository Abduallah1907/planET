import express from 'express';

import { createSeller, getSeller, updateSeller } from "../../controllers/sellerController";
const router = express.Router();

router.post('/createSeller', createSeller);
router.get('/getSeller', getSeller);
router.put('/updateSeller', updateSeller);


export default router;