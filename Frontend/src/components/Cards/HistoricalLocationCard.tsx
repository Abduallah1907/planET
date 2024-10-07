import { Card, Badge, Row, Col, Image } from "react-bootstrap";
import Rating from '../Rating/Rating';
import "./Cards.css";
import { HistoricalService } from "../../services/HistoricalService";
import { useEffect, useState } from "react";
import { get } from "http";
import { use } from "i18next";

interface InputData {
  
  Name: string;
  location: string;
  RatingVal: number; // Initial Rating
  Reviews: number;
  Price: number;
  imageUrl: string;
  OpeningHourFrom: string; // Using string for time representation
  OpeningHourTo: string; // Using string for time representation
  OpeningDays: string; // New property for opening days
  Description: string; // Fixed typo from Descripition to Description
  isActive: boolean;

  tags?: string[];
  onChange?: () => void; // Change onChange to a function that does not take parameters
  onClick?: () => void;

}

export const HistoricalLocationCard = ({
  
  Name,
  location,
  RatingVal,
  Reviews,
  Price,
  OpeningHourFrom,
  OpeningHourTo,
  OpeningDays, // New property
  Description,
  isActive,
  imageUrl,
  tags,
  onChange,
  onClick,
}: InputData) => {
  // Manage the state for the rating
 




  return (
    <Card onClick={onClick}
      className="p-3 shadow-sm"
      style={{ borderRadius: "10px", height: "100%" }}
    >
      <Row className="h-100 d-flex align-items-stretch justify-content-between ps-2">
        {/* Image Section */}
        <Col md={2} className="p-0 d-flex align-items-stretch">
          <Image
            src="https://via.placeholder.com/250x250"
            rounded
            alt="Activity Image"
          />
        </Col>

        {/* Main Info Section */}
        <Col md={7} className="d-flex align-items-stretch">
          <Card.Body className="p-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                {/* Activity Name */}
                <Card.Title
                  className="mb-0"
                  style={{ fontWeight: "bold", marginRight: "10px" }}
                >
                  {Name}
                </Card.Title>
                {/* Badges next to Activity Name */}
                {tags?.map((tag, index) => (
                  <Badge pill bg="tag" className="me-2 custom-badge" key={index}>
                    {tag}
                  </Badge>
                ))}
              </div>
              <Card.Text>
                <a
                  href="#"
                  className="text-danger"
                  style={{ fontSize: "0.9rem" }}
                >
                  {location} • Show on map
                </a>
              </Card.Text>

              {/* Category, Opening Hours, and Opening Days */}
              <Card.Text className="text-muted">
                Opening Hours: {OpeningHourFrom} - {OpeningHourTo}
              </Card.Text>
              <Card.Text className="text-muted">
                Opening Days: {OpeningDays}
              </Card.Text>
            </div>
            {/* Description */}
            <Card.Text className="text-muted">{Description}</Card.Text>
          </Card.Body>
        </Col>

        {/* Rating, Reviews, Price Section */}
        <Col
          md={3}
          className="d-flex flex-column justify-content-between align-items-end"
        >
          {/* Rating and Reviews on the Far Right */}
          <div className="d-flex align-items-center justify-content-end mb-3">
            {/* Rating Stars */}
            <Rating
              rating={RatingVal}
              readOnly={true}
            />
            <Badge
              className="ms-2 review-badge text-center"
              style={{
                fontSize: "1rem",
              }}
            >
              {RatingVal.toFixed(1)}
            </Badge>
          </div>
          <p className="text-muted text-right" style={{ fontSize: "0.9rem" }}>
            {Reviews.toLocaleString()} Reviews
          </p>




          {/* Booking Badge */}
          <div className="text-right">
            <h4 style={{ fontWeight: "bold" }}>${Price.toFixed(2)}</h4>
            <Badge
              bg={isActive ? "active" : "inactive"} // Change color based on booking status
              className="mt-2 custom-status-badge rounded-4 text-center"
              onClick={onChange} // Call onChange when clicked
            >
              {isActive ? "Active" : "InActive"}
            </Badge>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

