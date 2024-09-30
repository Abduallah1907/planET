import { Router } from 'express';
import Container from 'typedi';
import { SellerController } from '@/api/controllers/sellerController';
const route = Router();

export default (app: Router) => {

    const sellerController: SellerController = Container.get(SellerController);

    app.use('/seller', route);
    /**
     * @swagger
     * tags:
     *   - name: Seller
     *     description: Seller management and retrieval
     * /api/seller/createSeller:
     *   post:
     *     tags:
     *       - Seller
     *     summary: Posts seller in system
     *     description: Create a new seller in the system
     *     responses:
     *       200:
     *         description: Seller created data.
     *       400:
     *         description: Bad request.
     *       500:
     *         description: Internal server error.
     * 
     * /api/seller/getSeller:
     *   get:
     *     tags:
     *       - Seller
     *     summary: Get seller from system
     *     description: Retrieve seller data by his email
     *     responses:
     *       200:
     *         description: Seller data.
     *       400:
     *         description: Bad request.
     *       500:
     *         description: Internal server error.
     * 
     * /api/seller/updateSeller:
     *   put:
     *     tags:
     *       - Seller
     *     summary: Update seller in system
     *     description: Update seller data by his email
     *     responses:
     *       200:
     *         description: Updated Seller data.
     *       400:
     *         description: Bad request.
     *       500:
     *         description: Internal server error.
     */


    route.post('/createSeller', sellerController.createSeller);
    route.get('/getSeller', sellerController.getSeller);
    route.put('/updateSeller', sellerController.updateSeller);
};