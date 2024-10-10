import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./searchbar.css";
import CustomInput from "./CustomInput";
import {
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState<number>(1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
  };

  const increment = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent dropdown from closing
    setter(value + 1);
  };

  const decrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent dropdown from closing
    if (value > 0) {
      setter(value - 1);
    }
  };

  const handleDone = () => {
    // console.log("Adults:", adults);
    // console.log("Children:", children);
    // console.log("Rooms:", rooms);
  };
  return (
    <Form className="search-wrapper">
      <Row className="border-2 rounded-2">
        <Col className="search-container rounded-1">
          <InputGroup>
            <InputGroup.Text id="basic-addon1">
              <FaSearch color="#aaa" />
            </InputGroup.Text>
            <Form.Control
              style={{ border: "none" }}
              placeholder={t("where_are_you_going")}
              aria-label={t("where_are_you_going")}
              value={searchTerm}
              onChange={handleSearchChange}
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Col>
        <Col className="date-container rounded-1">
          <DatePicker
            selected={startDate || undefined}
            onChange={handleDateChange}
            startDate={startDate || undefined}
            endDate={endDate || undefined}
            selectsRange
            customInput={
              <CustomInput
                value={`${startDate ? startDate.toLocaleDateString() : ""} - ${
                  endDate ? endDate.toLocaleDateString() : ""
                }`}
                onClick={() => {}}
              />
            }
            cursor="pointer"
          />
        </Col>
        <Col className="counter-container justify-content-center">
          <DropdownButton
            as={ButtonGroup}
            title={`${adults} adults · ${children} children · ${rooms} room`}
            variant="outline-secondary"
            id="travel-options-dropdown"
          >
            <Dropdown.Item as="div">
              <Form>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Adults</span>
                  <div>
                    <span
                      className="btn btn-outline-secondary"
                      onClick={(e) => decrement(setAdults, adults, e)}
                      style={{ cursor: "pointer" }}
                    >
                      -
                    </span>
                    <span className="mx-2">{adults}</span>
                    <span
                      className="btn btn-outline-secondary"
                      onClick={(e) => increment(setAdults, adults, e)}
                      style={{ cursor: "pointer" }}
                    >
                      +
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Children</span>
                  <div>
                    <span
                      className="btn btn-outline-secondary"
                      onClick={(e) => decrement(setChildren, children, e)}
                      style={{ cursor: "pointer" }}
                    >
                      -
                    </span>
                    <span className="mx-2">{children}</span>
                    <span
                      className="btn btn-outline-secondary"
                      onClick={(e) => increment(setChildren, children, e)}
                      style={{ cursor: "pointer" }}
                    >
                      +
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Rooms</span>
                  <div>
                    <span
                      className="btn btn-outline-secondary"
                      onClick={(e) => decrement(setRooms, rooms, e)}
                      style={{ cursor: "pointer" }}
                    >
                      -
                    </span>
                    <span className="mx-2">{rooms}</span>
                    <span
                      className="btn btn-outline-secondary"
                      onClick={(e) => increment(setRooms, rooms, e)}
                      style={{ cursor: "pointer" }}
                    >
                      +
                    </span>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <span className="btn btn-primary mt-3" onClick={handleDone}>
                    Done
                  </span>
                </div>
              </Form>
            </Dropdown.Item>
          </DropdownButton>
        </Col>
        <div className="col col-auto search-container submit-btn">
          <button type="submit" className="btn-custom">
            {t("search")}
          </button>
        </div>
      </Row>
    </Form>
  );
};

export default SearchBar;
