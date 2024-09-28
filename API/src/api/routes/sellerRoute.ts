import { Router } from 'express';

import { createSeller, getSeller, updateSeller } from "../controllers/sellerController";
const route = Router();


export default (app: Router) => {
    app.use('/users', route);
    
    route.post('/createSeller', createSeller);
    route.get('/getSeller', getSeller);
    route.put('/updateSeller', updateSeller);
};