import React, { useEffect } from "react";
import "./LatestReview.css";
import { Container, Row, Card } from "react-bootstrap";
import { ActivityService } from "../../services/ActivityService";
import { IActivity } from "../../types/IActivity";
import Rating from "../../components/Rating/Rating";
interface LatestReviewsProps {
  comments: { createdAt: string; tourist_id: { user_id: { name: string } }; rating: number; comment: string }[];
}

const LatestReviews: React.FC<LatestReviewsProps> = ({ comments }) => {

  const sortedComments = comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Get the latest 3 comments
  const latestComments = sortedComments.slice(0, 3);
  return (
    <Container className="mt-4">
      <div className="reviews-section allcont">
        <h2>Latest Reviews</h2>
        <div className="reviews-list">
          {latestComments.map((comment: any, index: number) => (
            <Card className="comment-card">
              <Card.Body key={index}>
                <div className="review-item">
                  <div className="reviewer-info">
                    <h5>{comment.tourist_id.user_id.name}</h5>
                    <Rating
                      className="rating-style"
                      rating={comment.rating}
                      readOnly={true}
                    />
                  </div>
                  <p>{comment.comment}</p>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default LatestReviews;
