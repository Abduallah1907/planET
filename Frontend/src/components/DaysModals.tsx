import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface DaysModalProps {
  show: boolean;
  handleClose: () => void;
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;
}

const DaysModal: React.FC<DaysModalProps> = ({ show, handleClose, selectedDays, setSelectedDays }) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleCheckboxChange = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Opening Days</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {daysOfWeek.map((day) => (
            <Form.Check
              key={day}
              type="checkbox"
              label={day}
              checked={selectedDays.includes(day)}
              onChange={() => handleCheckboxChange(day)}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="main-inverse" onClick={handleClose}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DaysModal;