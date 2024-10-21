import React, { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard";
import LatestReviews from "./LatestReview";
import { useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";

const ActivityDetails: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const tourist = useAppSelector((state) => state.user.stakeholder_id);

  const [canComment, setCanComment] = useState(false); // To track if commenting is allowed

  const handleCommentSubmit = async (sentData: { comment: string; rating: number }) => {
    const data = { activity_id: id, comment: sentData.comment, rating: sentData.rating };
    await TouristService.rateAndCommentActivity(tourist._id, data);
  };

  const checkActivity = async () => {
    const result = await TouristService.checkActivity(tourist._id, id);
    setCanComment(result); // Update state based on checkActivity result
  };

  useEffect(() => {
    checkActivity(); // Call checkActivity when component mounts
  }, [id, tourist]);

  return (
    <div>
      <ActivityCard id={id} />
      {canComment && <Comment onSubmit={handleCommentSubmit} />} 
      <LatestReviews />
    </div>
  );
};

export default ActivityDetails;
