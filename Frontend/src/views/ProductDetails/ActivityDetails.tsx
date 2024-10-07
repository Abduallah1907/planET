import React from "react";

import ActivityCard from "./ActivityCard";
import LatestReviews from "./LatestReview";
import { useParams } from "react-router-dom";

const ActivityDetails: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  return (
    <div>
      <ActivityCard id={id}/> 
      <LatestReviews />
    </div>
  );
};

export default ActivityDetails;
