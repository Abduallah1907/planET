import { Router } from "express";
import { createProfile } from "../controllers/tourGuideController";
const router = Router();
// all routes have /api/tourGuide before each route

export default (app: Router) => {
  app.use("/tourGuide", router);

  /*
The reason we do not have a create profile (only update/view) is due to the fact 
that when the tour guide registers, we create a document for him inside the User table AND
the tour guide table. This is because in sprint 2, tour guide has documents he is
required to add, which is only avaliable in the tour guide table. This makes creating a profile
unneccessary. A better approach would be to simply add documents to the user table to reduce complexity,
but alas this is the one we ended up with
  */
  //router.post("/createProfile");
  router.get("/viewProfile");
  router.put("/updateProfile");
};
