import UserService from '../services/UserService';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface NotificationsModalProps {
    show: boolean;
    onHide: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ show, onHide }) => {
    const sendUpcomingNotifications = async () => {
        await UserService.sendNotificationAndEmailForUpcomingEvents();
    }

    const sendBirthdayNotifications = async () => {
        await UserService.sendNotificationAndEmailForBirthday();
    }
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body className='d-flex justify-content-center'>
                <Button variant="main-inverse" onClick={sendUpcomingNotifications}>
                    Upcoming Notifications
                </Button>
                <Button variant="main-inverse" onClick={sendBirthdayNotifications} className="ml-2">
                    Birthday Notifications
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="main-border" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NotificationsModal;