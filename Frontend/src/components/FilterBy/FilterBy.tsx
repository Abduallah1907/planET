import React from "react";
import "./FilterBy.css";
import { Col, Form, Row } from "react-bootstrap";
import MultiRangeSlider from "../MultiSelectRange/MultiSliderRange";

interface filterData {
  fromDate: string;
  toDate: string;
}

export default function FilterBy() {
  const [filter, setFilter] = React.useState<filterData>({
    fromDate: "",
    toDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  return (
    <Row className="m-5">
      <Col  className="filterby">
        <Row className="border-bottom py-2">
          <span>Filter By:</span>
        </Row>
        <Row className="border-bottom pb-2">
          <span className="py-2">Status</span>
          <Form.Check
            inline
            label="Inactive"
            name="group1"
            type="checkbox"
            id="inline-checkbox-1"
            className="ps-5"
          />
          <Form.Check
            inline
            label="Booking Off"
            name="group1"
            type="checkbox"
            id="inline-checkbox-2"
            className="ps-5"
          />
          <Form.Check
            inline
            label="Booking On"
            name="group1"
            type="checkbox"
            id="inline-checkbox-3"
            className="ps-5"
          />
        </Row>
        <Row className="border-bottom pb-2">
          <span className="py-2">Category</span>
          <Form.Check
            inline
            label="Sports"
            name="group1"
            type="checkbox"
            id="inline-checkbox-4"
            className="ps-5"
          />
          <Form.Check
            inline
            label="Adventure"
            name="group1"
            type="checkbox"
            id="inline-checkbox-5"
            className="ps-5"
          />
          <Form.Check
            inline
            label="NightLife"
            name="group1"
            type="checkbox"
            id="inline-checkbox-6"
            className="ps-5"
          />
        </Row>
        <Row className="border-bottom pb-5">
          <span className="py-2">Price</span>
          <MultiRangeSlider
            min={0}
            max={1000}
            onChange={({ min, max }: { min: number; max: number }) =>
              console.log(`min = ${min}, max = ${max}`)
            }
          />
        </Row>
        <Row className="border-bottom pb-2">
          <span className="py-2">Date</span>
          <Form.Group className="form-group" id="fromDate">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="dd/mm/yyy"
              value={filter.fromDate}
              onChange={handleChange}
              name={"fromDate"}
              //   className={disabled ? "disabled-input" : ""}
            />
          </Form.Group>
          <Form.Group className="form-group" id="toDate">
            <Form.Label className="">To Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="dd/mm/yyy"
              value={filter.toDate}
              onChange={handleChange}
              name={"toDate"}
              //   className={disabled ? "disabled-input" : ""}
            />
          </Form.Group>
        </Row>
      </Col>
    </Row>
  );
}
