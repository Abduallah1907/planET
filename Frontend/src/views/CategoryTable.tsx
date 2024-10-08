import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import CategoryService from '../services/CategoryService';

const CategoryTable: React.FC = () => {
    const [categories, setCategories] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ _id: string; type: string } | null>(null);
    const [newName, setNewName] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const categories = await CategoryService.getAll();
        setCategories(categories.data);
    };

    const handleDelete = async (id: string) => {
        await CategoryService.delete(id);
        fetchCategories();
    };

    const handleUpdate = async (id: string, name: string) => {
        await CategoryService.update(id, { type: name });
        fetchCategories();
    };

    const handleCreate = async (name: string) => {
        await CategoryService.create({ type: name });
        fetchCategories();
    };

    const handleShowUpdateModal = (category: any) => {
        setSelectedCategory(category);
        setNewName(category.type);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedCategory(null);
        setNewName("");
    };

    const handleShowCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewCategoryName("");
    };

    const handleSaveUpdateChanges = () => {
        if (selectedCategory) {
            handleUpdate(selectedCategory._id, newName);
            handleCloseUpdateModal();
        }
    };

    const handleSaveCreateChanges = () => {
        handleCreate(newCategoryName);
        handleCloseCreateModal();
    };

    return (
        <div>
            <h1>Category Table</h1>
            <Button variant="primary" onClick={handleShowCreateModal}>Create Category</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category: any) => (
                        <tr key={category._id}>
                            <td>{category._id}</td>
                            <td>{category.type}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShowUpdateModal(category)}>Update</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(category._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Update Category Modal */}
            <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCategoryName">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
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

            {/* Create Category Modal */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewCategoryName">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
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
        </div>
    );
};

export default CategoryTable;