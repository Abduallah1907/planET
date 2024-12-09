import React, { useState, useEffect } from "react";
import LatestReviews from "./LatestReview";
import { useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import ItineraryCard from "./ItineraryCard";
import { useAppSelector } from "../../store/hooks";
import { TouristService } from "../../services/TouristService";
import { ItineraryService } from "../../services/ItineraryService";

const ItineraryDetails: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const tourist = useAppSelector((state) => state.user);
  const [comments, setComments] = useState<any[]>([]);

  const [canComment, setCanComment] = useState(false); // To track if commenting is allowed

  const handleCommentSubmit = async (sentData: { comment: string; rating: number }) => {
    const data = { itinerary_id: id, comment: sentData.comment, rating: sentData.rating };
    const comment = await TouristService.rateAndCommentItinerary(tourist.stakeholder_id._id, data);
  };

  const checkItinerary = async () => {
    const result = await TouristService.checkItinerary(tourist.stakeholder_id._id, id);
    setCanComment(result); // Update state based on checkItinerary result
  };

  useEffect(() => {
    if (tourist.role === "TOURIST") {
      checkItinerary(); // Call checkItinerary when component mounts
    }
    getComments();
  }, [id, tourist]);

  const getComments = async () => {
    const comments = await ItineraryService.getComments(id);
    setComments(comments.data);
  }
    

  return (
    <div>
      <ItineraryCard id={id} />
      {canComment && <Comment onSubmit={handleCommentSubmit} />}
      <LatestReviews comments = {comments} />
    </div>
  );
};

export default ItineraryDetails;
