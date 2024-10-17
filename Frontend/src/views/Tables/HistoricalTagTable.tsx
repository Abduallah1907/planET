import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Container } from 'react-bootstrap';
import HistoricalTagService from '../../services/HistoricalTagService';

const HistoricalTagsTable: React.FC = () => {
    const [tags, setTags] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState<{ _id: string; type: string } | null>(null);
    const [newType, setNewType] = useState("");
    const [newTagType, setNewTagType] = useState("");
    const [values, setValues] = useState<string[]>([]);
    const [newTagValues, setNewTagValues] = useState<string[]>([]);
    const [deletedId, setDeletedId] = useState("");

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        const tags = await HistoricalTagService.getAll();
        setTags(tags.data);
    };

    const handleUpdate = async (id: string, tag: any) => {
        await HistoricalTagService.update(id, tag);
        fetchTags();
    };

    const handleCreate = async (name: string, values: string[]) => {
        await HistoricalTagService.create({ name, values });
        fetchTags();
    };

    const handleShowUpdateModal = (tag: any) => {
        setSelectedTag(tag);
        setNewType(tag.name);
        setValues(tag.values);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedTag(null);
        setNewType("");
        setValues([]);
    };

    const handleShowCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewTagType("");
        setNewTagValues([]);
    };

    const handleSaveUpdateChanges = () => {
        if (selectedTag) {
            handleUpdate(selectedTag._id, { type: newType, values });
            handleCloseUpdateModal();
        }
    };

    const handleSaveCreateChanges = () => {
        handleCreate(newTagType, newTagValues);
        handleCloseCreateModal();
    };

    const handleAddValue = () => {
        setValues([...values, ""]);
    };

    const handleRemoveValue = (index: number) => {
        setValues(values.filter((_, i) => i !== index));
    };

    const handleValueChange = (index: number, newValue: string) => {
        const newValues = [...values];
        newValues[index] = newValue;
        setValues(newValues);
    };

    const handleAddNewTagValue = () => {
        setNewTagValues([...newTagValues, ""]);
    };

    const handleRemoveNewTagValue = (index: number) => {
        setNewTagValues(newTagValues.filter((_, i) => i !== index));
    };

    const handleNewTagValueChange = (index: number, newValue: string) => {
        const newValues = [...newTagValues];
        newValues[index] = newValue;
        setNewTagValues(newValues);
    };

    const handleDelete = (id: string) => {
        setDeletedId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async() => {
        // Perform the delete action here
        await HistoricalTagService.delete(deletedId);
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
                        <th>Name</th>
                        <th>Values</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map((tag: any) => (
                        <tr key={tag._id}>
                            <td>{tag._id}</td>
                            <td>{tag.name}</td>
                            <td>{tag.values.join(",")}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShowUpdateModal(tag)}>Update</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(tag._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Update Tag Modal */}
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
                        <Form.Group controlId="formTagValues" className='mt-2'>
                            <Form.Label>Tag Values</Form.Label>
                            {values.map((value, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <Form.Control
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleValueChange(index, e.target.value)}
                                        className='me-2 custom-form-control'
                                    />
                                    <Button variant="danger" onClick={() => handleRemoveValue(index)} className="ml-2">Remove</Button>
                                </div>
                            ))}
                            <Button variant="success" onClick={handleAddValue}>Add Value</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpdateModal}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleSaveUpdateChanges}>
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
                        <Form.Group controlId="formNewTagValues" className='mt-2'>
                            <Form.Label>Tag Values</Form.Label>
                            {newTagValues.map((value, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <Form.Control
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleNewTagValueChange(index, e.target.value)}
                                        className='me-2 custom-form-control'
                                    />
                                    <Button variant="danger" onClick={() => handleRemoveNewTagValue(index)} className="ml-2">Remove</Button>
                                </div>
                            ))}
                            <Button variant="success" onClick={handleAddNewTagValue}>Add Value</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateModal}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleSaveCreateChanges}>
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
                    <Button variant="secondary" onClick={cancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default HistoricalTagsTable;