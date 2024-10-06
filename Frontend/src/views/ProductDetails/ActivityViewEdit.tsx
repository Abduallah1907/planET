import React from "react";

import ActivityCard from "./ActivityCard";
import LatestReviews from "./LatestReview";

const ActivityViewEdit: React.FC = () => {
  return (
    <div>
      <ActivityCard />
      <LatestReviews />
    </div>
  );
};

export default ActivityViewEdit;
