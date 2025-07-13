import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/esm/Container';
import { Button, Form, FormGroup, Image, Modal, Badge, Card } from 'react-bootstrap'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { Link } from 'react-router-dom'

export default function ListOfOrchids() {
    const [orchids, setOrchids] = useState([])
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true)
    const [selectedFile, setSelectedFile] = useState(null);

    const handleClose = () => {
        setShow(false);
        setSelectedFile(null);
    };
    const handleShow = () => setShow(true);
    const { register, handleSubmit, formState: { errors }, control, reset, watch } = useForm();
    const [value, setValue] = useState('');
    
    useEffect(() => {
        fetchOrchids();
    }, [])

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return {
            'Authorization': `Bearer ${token}`
        };
    };

    const fetchOrchids = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/orchids', {
                headers: getAuthHeaders()
            }); 
            const sortedData = response.data.sort((a, b) => parseInt(b.orchidId) - parseInt(a.orchidId));
            setOrchids(sortedData);
        } catch (error) {
            console.error('Error fetching orchids:', error);
            if (error.response?.status === 401) {
                toast.error("Authentication failed. Please login again.");
            } else {
                toast.error("Failed to load orchids!");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (orchidId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/orchids/${orchidId}`, {
                headers: getAuthHeaders()
            });
            fetchOrchids();
            toast.success("Orchid deleted successfully!");
        } catch (error) {
            console.log(error.message);
            if (error.response?.status === 401) {
                toast.error("Authentication failed. Please login again.");
            } else {
                toast.error("Failed to delete orchid!");
            }
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const onSubmit = async (data) => {
        try {
            if (!selectedFile) {
                toast.error("Please select an image file");
                return;
            }

            const formData = new FormData();
            formData.append('orchidName', data.orchidName);
            formData.append('orchidDescription', data.orchidDescription || "Beautiful orchid");
            formData.append('orchidUrl', selectedFile);
            formData.append('price', data.price || 100);
            formData.append('isNatural', data.isNatural || false);
            formData.append('categoryId', 1); // Default category ID

            const response = await axios.post('http://localhost:8080/api/orchids', formData, { 
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setShow(false);
            fetchOrchids();
            reset();
            setSelectedFile(null);
            setValue('');
            toast.success("Orchid added successfully!");
        } catch (error) {
            console.log(error.message);
            if (error.response?.status === 401) {
                toast.error("Authentication failed. Please login again.");
            } else if (error.response?.status === 400) {
                toast.error("Invalid input data. Please check your form.");
            } else {
                toast.error("Failed to add orchid!");
            }
        }
    };

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <h4>Loading orchids...</h4>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Toaster/>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Manage Orchids</h2>
                <Button onClick={handleShow} variant="primary" className="shadow-sm">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Orchid
                </Button>
            </div>

            <Card className="shadow rounded custom-card mb-4">
              <Card.Body>
                <Table striped bordered hover responsive className="custom-table align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>Orchid Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Type</th>
                        <th>Actions</th>
                        <th>Image</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orchids.map((orchid) => (
                        <tr key={orchid.orchidId}>
                            <td className="fw-bold">{orchid.orchidName}</td>
                            <td className="text-muted">
                                {orchid.orchidDescription?.substring(0, 50)}
                                {orchid.orchidDescription?.length > 50 && '...'}
                            </td>
                            <td className="fw-bold text-primary">${orchid.price}</td>
                            <td>
                                <Badge
                                    bg={orchid.isNatural ? "success" : "warning"}
                                    className="custom-badge"
                                >
                                    {orchid.isNatural ? "Natural" : "Industry"}
                                </Badge>
                            </td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Link to={`/edit/${orchid.orchidId}`}>
                                        <Button variant="outline-primary" size="sm" className="shadow-sm">
                                            <i className="bi bi-pencil-square me-1"></i>
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="shadow-sm"
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete this orchid?")) {
                                                handleDelete(orchid.orchidId);
                                            }
                                        }}
                                    >
                                        <i className="bi bi-trash3 me-1"></i>
                                        Delete
                                    </Button>
                                </div>
                            </td>
                            <td>
                                <Image
                                    src={orchid.orchidUrl}
                                    width={60}
                                    height={60}
                                    rounded
                                    className="shadow-sm custom-image"
                                    style={{ objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/60x60?text=Orchid';
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
              </Card.Body>
            </Card>

            {orchids.length === 0 && (
                <div className="text-center mt-5">
                    <h4 className="text-muted">No orchids available</h4>
                    <p>Add your first orchid to get started.</p>
                </div>
            )}

            <Modal show={show} onHide={handleClose} backdrop="static" size="lg" className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Orchid</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Orchid Name *</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                {...register("orchidName", { required: true })}
                                placeholder="Enter orchid name"
                                className="shadow-sm"
                            />
                            {errors.orchidName && errors.orchidName.type === "required" && 
                                <p className="text-danger mt-1">Orchid name is required</p>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={3}
                                {...register("orchidDescription")}
                                placeholder="Enter orchid description"
                                className="shadow-sm"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Orchid Image *</Form.Label>
                            <Form.Control 
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-control shadow-sm"
                            />
                            {!selectedFile && 
                                <p className="text-danger mt-1">Please select an image file</p>
                            }
                            {selectedFile && 
                                <p className="text-success mt-1">File selected: {selectedFile.name}</p>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price *</Form.Label>
                            <Form.Control 
                                type="number"
                                min="0"
                                step="0.01"
                                {...register("price", { required: true, min: 0 })}
                                placeholder="Enter price"
                                className="shadow-sm"
                            />
                            {errors.price && 
                                <p className="text-danger mt-1">Valid price is required</p>
                            }
                        </Form.Group>

                        <FormGroup className="mb-3">
                            <Form.Check
                                type="switch"
                                id="natural-switch"
                                label="Natural Orchid"
                                {...register("isNatural")}
                            />
                        </FormGroup>

                        <Modal.Footer className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="shadow-sm">
                                Add Orchid
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}
