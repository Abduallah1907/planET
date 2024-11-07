import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Container } from 'react-bootstrap';
import TagService from '../../services/TagService';
import { FaTrashAlt } from 'react-icons/fa';

const TagsTable: React.FC = () => {
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

    const confirmDelete = async() => {
        // Perform the delete action here
        await TagService.delete(deletedType);
        fetchTags();
        setShowDeleteModal(false); // Close modal after confirming
    };

    const cancelDelete = () => {
        setShowDeleteModal(false); // Close modal without action
    };

    return (
        <Container className='mt-3'>
            <h1>Tags Table</h1>
            <Button variant="main-inverse" onClick={handleShowCreateModal}>Create Tag</Button>
            <Table striped bordered hover className='mt-3'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map((tag: any) => (
                        <tr key={tag._id}>
                            <td>{tag._id}</td>
                            <td>{tag.type}</td>
                            <td>
                                <Button variant="main-inverse" onClick={() => handleShowUpdateModal(tag)}>Update</Button>{' '}
                                <Button variant="main-inverse" >
                                <FaTrashAlt
                                     onClick={() => handleDelete(tag.type)}
                                >
                                Delete
                                </FaTrashAlt>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Update Tag Modal */}
            <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTagType">
                            <Form.Label>Tag Type</Form.Label>
                            <Form.Control
                                className='custom-form-control'
                                type="text"
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="main" className="border-warning-subtle" onClick={handleCloseUpdateModal}>
                        Close
                    </Button>
                    <Button variant="main-inverse" onClick={handleSaveUpdateChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Create Tag Modal */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewTagType">
                            <Form.Label>Tag Type</Form.Label>
                            <Form.Control
                                className='custom-form-control'
                                type="text"
                                value={newTagType}
                                onChange={(e) => setNewTagType(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="main" className="border-warning-subtle" onClick={handleCloseCreateModal}>
                        Close
                    </Button>
                    <Button variant="main-inverse" onClick={handleSaveCreateChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={cancelDelete} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this Tag?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="main" className="border-warning-subtle" onClick={cancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="main-inverse" onClick={confirmDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TagsTable;