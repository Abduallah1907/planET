import { Router } from 'express';
import Container from 'typedi';
import { TouristController } from '../controllers/touristController';
const route = Router();

export default (app: Router) => {

  const touristController: TouristController = Container.get(TouristController);

  app.use('/tourist', route);
  /**
 * @swagger
 * tags:
 *   - name: Tourist
 *     description: Tourist management and retrieval
 * /api/tourist/getTourist:
 *   get:
 *     tags:
 *       - Tourist
 *     summary: Retrieve tourist from system
 *     description: Retrieve data of tourist by mail
 *     responses:
 *       200:
 *         description: Tourist data.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 * 
 * /api/tourist/updateTourist:
 *   put:
 *     tags:
 *       - Tourist
 *     summary: Update tourist in system
 *     description: Update tourist data by his email
 *     responses:
 *       200:
 *         description: Updated Tourist data.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 * 
 * /api/tourist/createTourist:
 *   post:
 *     tags:
 *       - Tourist
 *     summary: Create tourist in system
 *     description: Create a new tourist in the system
 *     responses:
 *       200:
 *         description: Tourist created data.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 * 
 * /api/tourist/getActivities:
 *   get:
 *     tags:
 *       - Tourist
 *     summary: Retrieve activities from system
 *     description: Retrieve activities data by name, category and tag
 *     responses:
 *       200:
 *         description: List of Activities.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 * 
 * /api/tourist/getItineraries:
 *   get:
 *     tags:
 *       - Tourist
 *     summary: Retrieve itineraries from system
 *     description: Retrieve itineraries data by name, category and tag
 *     responses:
 *       200:
 *         description: List of Itineraries.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 * 
 * /api/tourist/getHistorical_locations:
 *   get:
 *     tags:
 *       - Tourist
 *     summary: Retrieve historical locations from system
 *     description: Retrieve historical locations data by name, category and tag
 *     responses:
 *       200:
 *         description: List of Historical locations.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
  route.get('/getTourist', touristController.getTourist);
  route.put('/updateTourist', touristController.updateTourist);
  route.post('/createTourist', touristController.createTourist);


  route.get("/getActivities", touristController.getActivities);
  route.get("/getItineraries", touristController.getItinerary);
  route.get("/getHistorical_locations", touristController.getHistorical_locations);

  route.get("/getUpcomingActivities", touristController.getUpcomingActivities);
  route.get("/getUpcomingItineraries", touristController.getUpcomingItineraries);
  route.get("/getUpcomingHistorical_locations", touristController.getUpcomingHistorical_locations);


};