import { Router } from 'express';
import Container from 'typedi';
import { SellerController } from '@/api/controllers/sellerController';
const route = Router();
const sellerController = Container.get('sellerController') as SellerController;

export default (app: Router) => {
    app.use('/seller', route);
    
    route.post('/createSeller', sellerController.createSeller);
    route.get('/getSeller', sellerController.getSeller);
    route.put('/updateSeller', sellerController.updateSeller);
};