import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Container, Form } from 'react-bootstrap';
import TagService from '../services/TagService';
import { TouristService } from '../services/TouristService';
import { FaTrashAlt } from 'react-icons/fa';
import "./Preferences.css";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setStakeholder } from '../store/userSlice';
interface TagsTableProps {
    show: boolean;
    onHide: () => void;
}

const TagsTable: React.FC<TagsTableProps> = ({ show, onHide }) => {
    const [tags, setTags] = useState([]);
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        const tags = await TagService.getAll();
        setTags(tags.data);
    };

    const handleCheckboxChange = async (tagId: string, checked: boolean) => {
        if (checked) {
            await TouristService.addPreferences(user.email,tagId);
            const stakeholder_id = { ...user.stakeholder_id, preferences: [...user.stakeholder_id.preferences, tagId] };
            dispatch(setStakeholder(stakeholder_id));
        } else {
            await TouristService.removePreferences(user.email,tagId);
            const stakeholder_id = { ...user.stakeholder_id, preferences: user.stakeholder_id.preferences.filter((id: string) => id !== tagId) };
            dispatch(setStakeholder(stakeholder_id));
        }
    };


    return (
        <Modal show={show} onHide={onHide} centered className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold mb-3" style={{ fontFamily: "Poppins" }}>Preferences</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Table striped bordered hover className="mt-3 text-center" style={{ tableLayout: "auto", width: "100%" }}>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tags.map((tag: any) => (
                                <tr key={tag._id}>
                                    <td>{tag.type}</td>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            className="custom-checkbox d-flex justify-content-center"
                                            onChange={(e) => handleCheckboxChange(tag._id, e.target.checked)}
                                            checked={user?.stakeholder_id?.preferences?.some((preference: { _id: any; }) => preference._id === tag._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default TagsTable;
