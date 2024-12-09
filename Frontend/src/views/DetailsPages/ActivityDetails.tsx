import React, { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard";
import LatestReviews from "./LatestReview";
import { useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";
import { ActivityService } from "../../services/ActivityService";

const ActivityDetails: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const tourist = useAppSelector((state) => state.user);

  const [canComment, setCanComment] = useState(false); // To track if commenting is allowed
  const [comments, setComments] = useState<any[]>([]);


  const handleCommentSubmit = async (sentData: { comment: string; rating: number }) => {
    const data = { activity_id: id, comment: sentData.comment, rating: sentData.rating };
    await TouristService.rateAndCommentActivity(tourist.stakeholder_id._id, data);
  };

  const checkActivity = async () => {
    const result = await TouristService.checkActivity(tourist.stakeholder_id._id, id);
    setCanComment(result); // Update state based on checkActivity result
  };

  useEffect(() => {
    if (tourist.role === "TOURIST") {
      checkActivity(); // Call checkActivity when component mounts
    }
    getComments();
  }, [id, tourist]);

  const getComments = async () => {
    const comments = await ActivityService.getComments(id);
    setComments(comments.data);
  }

  return (
    <div>
      <ActivityCard id={id} />
      {canComment && <Comment onSubmit={handleCommentSubmit} />}
      <LatestReviews comments={comments} />
    </div>
  );
};

export default ActivityDetails;
