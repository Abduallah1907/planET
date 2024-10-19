import React from "react";
import LatestReviews from "./LatestReview";
import { useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import ItineraryCard from "../ItineraryCard";
import { useAppSelector } from "@/store/hooks";
import { TouristService } from "@/services/TouristService";


const ItineraryDetails: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const tourist=useAppSelector((state)=>state.user.stakeholder_id)
  const handleCommentSubmit=async(sentData:{comment:string,rating:number})=>{
    const data= {itinerary_id:id,comment:sentData.comment,rating:sentData.rating}
    const comment=await TouristService.rateAndCommentItinerary(tourist._id,data)
  }
  return (
    <div>
      <ItineraryCard id={id} />
      <Comment onSubmit={handleCommentSubmit}/>
      <LatestReviews />
    </div>
  );
};

export default ItineraryDetails;