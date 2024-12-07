import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Container, Form } from 'react-bootstrap';
import TagService from '../services/TagService';
import { FaTrashAlt } from 'react-icons/fa';
import "./Preferences.css";
interface TagsTableProps {
    show: boolean;
    onHide: () => void;
}

const TagsTable: React.FC<TagsTableProps> = ({ show, onHide }) => {
    const [tags, setTags] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState<{ _id: string; type: string } | null>(null);
    const [newType, setNewType] = useState("");
    const [newTagType, setNewTagType] = useState("");
    const [deletedType, setDeletedType] = useState("");

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        const tags = await TagService.getAll();
        setTags(tags.data);
    };

    const handleUpdate = async (oldType: string, newType: string) => {
        await TagService.update({ oldType: oldType, newType: newType });
        fetchTags();
    };

    const handleCreate = async (type: string) => {
        await TagService.create({ type: type });
        fetchTags();
    };

    const handleShowUpdateModal = (tag: any) => {
        setSelectedTag(tag);
        setNewType(tag.type);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedTag(null);
        setNewType("");
    };

    const handleShowCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewTagType("");
    };

    const handleSaveUpdateChanges = () => {
        if (selectedTag) {
            handleUpdate(selectedTag.type, newType);
            handleCloseUpdateModal();
        }
    };

    const handleSaveCreateChanges = () => {
        handleCreate(newTagType);
        handleCloseCreateModal();
    };

    const handleDelete = (type: string) => {
        setDeletedType(type);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        await TagService.delete(deletedType);
        fetchTags();
        setShowDeleteModal(false);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
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
