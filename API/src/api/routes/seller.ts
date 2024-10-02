import { Router } from "express";
import Container from "typedi";
import { SellerController } from "@/api/controllers/sellerController";
const route = Router();

export default (app: Router) => {
  const sellerController: SellerController = Container.get(SellerController);

    app.use('/seller', route);
    /**
     * @swagger
     * components:
     *   schemas:
     *     ISellerInputDTO:
     *       type: object
     *       properties:
     *         documents_required:
     *           type: array
     *           items:
     *             type: string
     *         logo:
     *           type: string
     *         name:
     *           type: string
     *         username:
     *           type: string
     *         email:
     *           type: string
     *         password:
     *           type: string
     *         phone_number:
     *           type: string
     *         date_of_birth:
     *           type: string
     *           format: date
     *     ISellerOutputDTO:
     *       type: object
     *       properties:
     *         email:
     *           type: string
     *         name:
     *           type: string
     *         username:
     *           type: string
     *         phone_number:
     *           type: string
     *         logo:
     *           type: string
     *         description:
     *           type: string
     *     ISellerUpdateDTO:
     *       type: object
     *       properties:
     *         searchEmail:
     *           type: string
     *         name:
     *           type: string
     *         description:
     *           type: string
     * tags:
     *   - name: Seller
     *     description: Seller management and retrieval
     * /api/seller/createSeller:
     *   post:
     *     tags:
     *       - Seller
     *     summary: Posts seller in system
     *     description: Create a new seller in the system
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ISellerInputDTO'
     *     responses:
     *       200:
     *         description: Seller created data.
     *       400:
     *         description: Bad request.
     *       500:
     *         description: Internal server error.
     * /api/seller/getSeller/{email}:
     *   get:
     *     tags:
     *       - Seller
     *     summary: Get seller from system
     *     description: Retrieve seller data by his email
     *     parameters:
     *       - in: path
     *         name: email
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Seller data.
     *       400:
     *         description: Bad request.
     *       500:
     *         description: Internal server error.
     * /api/seller/updateSeller:
     *   put:
     *     tags:
     *       - Seller
     *     summary: Update seller in system
     *     description: Update seller data by his email
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               searchEmail:
     *                 type: string
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: Updated Seller data.
     *       400:
     *         description: Bad request.
     *       500:
     *         description: Internal server error.
     */


    route.post('/createSeller', sellerController.createSeller);
    route.get('/getSeller/:email', sellerController.getSeller);
    route.put('/updateSeller', sellerController.updateSeller);
};
