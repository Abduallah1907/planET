import express from 'express';

import { createSeller, getSeller, updateSeller } from "../../controllers/sellerController";
const sellerRouter = express.Router();

sellerRouter.post('/createSeller', createSeller);
sellerRouter.get('/getSeller', getSeller);
sellerRouter.put('/updateSeller', updateSeller);


export default sellerRouter;