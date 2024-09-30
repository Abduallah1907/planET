import { Router } from 'express';

import { getTourist, updateTourist,createTourist} from "../controllers/touristController";
import { getActivities, getItinerary, getHistorical_locations } from "../controllers/touristController";
const route = Router();


export default (app: Router) => {
    app.use('/tourist', route);
    
    route.get('/getTourist', getTourist);
    route.put('/updateTourist', updateTourist);
    route.post('/createTourist', createTourist);


    route.get("/getActivities", getActivities);
    route.get("/getItineraries", getItinerary);
    route.get("/getHistorical_locations", getHistorical_locations);


};