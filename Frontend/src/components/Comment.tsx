import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Rating from "./Rating/Rating";
import './Rating/Rating.css';

interface CommentProps {
  defaultName?: string; 
  defaultRating?: number; 
  defaultComment?: string; 
  formTitle?: string; 
  onSubmit?: (data: { rating: number; comment: string }) => void;
}

const Comment: React.FC<CommentProps> = ({
  defaultName = "",
  defaultRating = 0,
  defaultComment = "",
  formTitle = "Rate and Comment",
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(defaultRating);
  const [comment, setComment] = useState<string>(defaultComment);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating && comment) {
      setSubmitted(true);
      console.log("Submitted rating:", rating);
      console.log("Submitted comment:", comment);

      if (onSubmit) {
        onSubmit({
            rating, comment,
            
        });
      }
    }
  };

  return (
    <Container className="comment-container mt-4">
      <Card className="p-4 shadow-sm">
        {submitted ? (
          <div className="thank-you-message">
            <h3>Thank you for your feedback</h3>
            <p>Your Rating: {rating} stars</p>
            <p>Your Comment: {comment}</p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit} className="comment-form">
            <h2 className="text-center mb-4">{formTitle}</h2>

            <Row className="align-items-center mb-3">
              <Col xs={12} className="d-flex justify-content-end">
                <div className="rating-wrapper">
                  <Rating rating={rating} totalStars={5} onChange={handleRatingChange} />
                </div>
              </Col>
            </Row>

           <h2>{defaultName}</h2>

            <Form.Group controlId="comment" className="mb-3">
              <Form.Label htmlFor="inputComment">Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={5} // Increased row count for a larger text area
                id="inputComment"
                placeholder="Type your comment here..."
                value={comment}
                onChange={handleCommentChange}
                required
                style={{
                  borderColor: '#d76f30', // Match button background color
                  borderWidth: '2px',
                  borderStyle: 'solid',
                }}
              />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button
                style={{ backgroundColor: '#d76f30', borderColor: '#d76f30' }}
                type="submit" className="button" 
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default Comment;
