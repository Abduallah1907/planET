import React, { useState, useEffect } from "react";
import LatestReviews from "./LatestReview";
import { useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import ItineraryCard from "../ItineraryCard";
import { useAppSelector } from "../../store/hooks";
import { TouristService } from "../../services/TouristService";

const ItineraryDetails: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const tourist = useAppSelector((state) => state.user);

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
  }, [id, tourist]);

  return (
    <div>
      <ItineraryCard id={id} />
      {canComment && <Comment onSubmit={handleCommentSubmit} />}
      <LatestReviews />
    </div>
  );
};

export default ItineraryDetails;
