import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Slot {
  title: string;
  description: string;
  from: string;
  to: string;
  index?: number;
}

interface SlotModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (slot: Slot) => void;
  slot: Slot;
  setSlot: (slot: Slot) => void;
}

const SlotModal: React.FC<SlotModalProps> = ({ show, handleClose, handleSave, slot, setSlot }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSlot({ ...slot, [name]: value });
  }

  const saveSlot = () => {
    handleSave(slot);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{slot ? 'Edit Slot' : 'Add Slot'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="slotTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              className='custom-form-control'
              type="text"
              name="title"
              value={slot.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="slotDesc">
            <Form.Label>Description</Form.Label>
            <Form.Control
              className='custom-form-control'
              type="text"
              name="description"
              value={slot.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="slotFrom">
            <Form.Label>From</Form.Label>
            <Form.Control
              className='custom-form-control'
              type="time"
              name="from"
              value={slot.from}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="slotTo">
            <Form.Label>To</Form.Label>
            <Form.Control
              className='custom-form-control'
              type="time"
              name="to"
              value={slot.to}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="main" className="border-warning-subtle" onClick={handleClose}>
          Close
        </Button>
        <Button variant="main-inverse" onClick={saveSlot}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SlotModal;