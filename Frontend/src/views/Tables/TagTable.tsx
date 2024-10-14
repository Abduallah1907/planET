import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Container } from 'react-bootstrap';
import TagService from '../../services/TagService';

const TagsTable: React.FC = () => {
    const [tags, setTags] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState<{ _id: string; type: string } | null>(null);
    const [newType, setNewType] = useState("");
    const [newTagType, setNewTagType] = useState("");

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        const tags = await TagService.getAll();
        setTags(tags.data);
    };

    const handleDelete = async (type: string) => {
        await TagService.delete(type);
        fetchTags();
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
                                <Button variant="warning" onClick={() => handleShowUpdateModal(tag)}>Update</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(tag.type)}>Delete</Button>
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
                                type="text"
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpdateModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveUpdateChanges}>
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
                                type="text"
                                value={newTagType}
                                onChange={(e) => setNewTagType(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveCreateChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TagsTable;