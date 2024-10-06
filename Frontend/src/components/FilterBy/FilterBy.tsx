import React from "react";
import "./FilterBy.css";
import { Col, Form, Row } from "react-bootstrap";
import MultiRangeSlider from "../MultiSelectRange/MultiSliderRange";

interface filterData {
  fromDate: string;
  toDate: string;
}

interface FilterByProps {
  filterOptions: { [key: string]: any };
}

const FilterBy: React.FC<FilterByProps> = ({ filterOptions }) => {
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
  const renderFilterFields = () => {
    return (Object.keys(filterOptions)).map(
      (key) => {
        const field = filterOptions[key];
        console.log(field)
        switch (field.type) {
          case "multi-select":
            if ("values" in field) {
              return (
                <Row className="border-bottom pb-2" key={key}>
                  <span className="py-2">{key}</span>
                  {field.values.map((value: string, index: number) => (
                    <Form.Check
                      inline
                      label={value}
                      name="group1"
                      type="checkbox"
                      id={`inline-checkbox-${key}-${index}`}
                      className="ms-3"
                      key={index}
                    />
                  ))}
                </Row>
              );
            }
            break;

          case "slider":
            if ("min" in field && "max" in field) {
              return (
                <Row className="border-bottom pb-5" key={key}>
                  <span className="py-2">{key}</span>
                  <MultiRangeSlider
                    min={field.min}
                    max={field.max}
                    onChange={({ min, max }: { min: number; max: number }) =>
                      console.log(`min = ${min}, max = ${max}`)
                    }
                  />
                </Row>
              );
            }
            break;

          case "range":
            return (
              <Row className="border-bottom pb-2" key={key}>
                <span className="py-2">{key}</span>
                <Form.Group className="form-group" id="fromDate">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="dd/mm/yyy"
                    value={filter.fromDate}
                    onChange={handleChange}
                    name={"fromDate"}
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
                  />
                </Form.Group>
              </Row>
            );

          default:
            return null;
        }
      }
    );
  };

  return (
    <Row className="m-5">
      <Col md={2} className="filterby">
        <Row className="border-bottom py-2">
          <span>Filter By:</span>
        </Row>
        {renderFilterFields()}
      </Col>
    </Row>
  );
}

export default FilterBy;