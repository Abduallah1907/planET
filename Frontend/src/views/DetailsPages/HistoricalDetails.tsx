import React from "react";

import HistoricalCard from "./HistoricalCard";
import LatestReviews from "./LatestReview";
import { useParams } from "react-router-dom";

const HistoricalDetails: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  return (
    <div>
        <HistoricalCard id={id}/> 
      <LatestReviews comments = {[]}/>
    </div>
  );
};

export default HistoricalDetails;
