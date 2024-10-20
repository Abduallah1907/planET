import React from "react";
import ActivityCard from "./ActivityCard";
import LatestReviews from "./LatestReview";
import { useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";

const ActivityDetails: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const tourist=useAppSelector((state)=>state.user.stakeholder_id)
  const handleCommentSubmit=async(sentData:{comment:string,rating:number})=>{
    const data= {activity_id:id,comment:sentData.comment,rating:sentData.rating}
    const comment=await TouristService.rateAndCommentActivity(tourist._id,data)

  }
  return (
    <div>
      <ActivityCard id={id} />
      <Comment onSubmit={handleCommentSubmit}/>
      <LatestReviews />
    </div>
  );
};


export default ActivityDetails;
