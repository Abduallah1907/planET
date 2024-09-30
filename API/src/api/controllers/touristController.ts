
import { getTouristService,updateTouristService,createTouristService } from "../../services/touristService";


export const getTourist = async (req: any, res: any) => {
    const tourist=await getTouristService(req.body.email);
    res.json({tourist});
};

export const createTourist = async (req: any, res: any) => {
    const updatedTourist=await createTouristService(req.body.name,req.body.username,req.body.email,req.body.password,req.body.phone_number,req.body.job,req.body.nation,req.body.date_of_birth);
    res.json({updatedTourist});
};



export const updateTourist = async (req: any, res: any) => {
    const updatedTourist= await updateTouristService(req.body.searchEmail,req.body.name,req.body.newEmail,req.body.password,req.body.phone_number,req.body.job,req.body.nation,req.body.addresses);
    res.json({updatedTourist});
};
