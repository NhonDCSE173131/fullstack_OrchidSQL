import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Card, Badge, Image, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { getRoleFromToken } from '../utils/tokenUtils.js';

export default function DetailOrchid() {
    const [orchid, setOrchid] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const id = params.id;
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [buyLoading, setBuyLoading] = useState(false);
    const [buyError, setBuyError] = useState(null);
    const [buySuccess, setBuySuccess] = useState(null);
    const token = localStorage.getItem('authToken');
    const role = getRoleFromToken(token);
    
    useEffect(() => {
        fetchOrchidData();
    }, [id]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const fetchOrchidData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Authentication required. Please login again.');
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/orchids/${id}`, {
                headers: getAuthHeaders()
            });
            setOrchid(response.data);
        } catch (error) {
            console.error('Error fetching orchid data:', error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Authentication failed. Please login again.');
                } else if (error.response.status === 404) {
                    setError('Orchid not found.');
                } else {
                    setError(`Failed to load orchid: ${error.response.data?.message || 'Server error'}`);
                }
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('Failed to load orchid details.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async () => {
        setBuyLoading(true);
        setBuyError(null);
        setBuySuccess(null);
        try {
            const accountId = localStorage.getItem('userId'); // Adjust if you store userId differently
            const orderData = {
                orchidId: orchid.orchidId,
                price: orchid.price,
                quantity: quantity,
                accountId: accountId
            };
            await axios.post('http://localhost:8080/api/orders', orderData, { headers: getAuthHeaders() });
            setBuySuccess('Purchase successful!');
        } catch (error) {
            setBuyError('Failed to purchase orchid.');
        } finally {
            setBuyLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">
                    <h4>Loading orchid details...</h4>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <div className="text-center text-danger">
                    <h4>{error}</h4>
                    <Link to="/login">
                        <Button variant="primary" className="mt-3">
                            Go to Login
                        </Button>
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row>
                <Col lg={8} className="p-3">
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item href="/">Orchids</Breadcrumb.Item>
                        <Breadcrumb.Item active>{orchid.orchidName || 'Loading...'}</Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="mb-4">
                        <h1 className="text-primary mb-2">{orchid.orchidName}</h1>
                        <Badge 
                            bg={orchid.isNatural ? "success" : "warning"}
                            className="fs-6 px-3 py-2 custom-badge"
                        >
                            {orchid.isNatural ? "Natural Orchid" : "Industrial Orchid"}
                        </Badge>
                    </div>

                    <Card className="mb-4 shadow custom-card">
                        <Card.Header className="bg-light">
                            <h5 className="text-primary mb-0">Description</h5>
                        </Card.Header>
                        <Card.Body>
                            <p className="fs-5 text-muted">
                                {orchid.orchidDescription || 'No description available'}
                            </p>
                        </Card.Body>
                    </Card>

                    <Card className="shadow custom-card">
                        <Card.Header className="bg-light">
                            <h5 className="text-primary mb-0">Details</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <strong>Price:</strong>
                                        <span className="fs-4 text-primary ms-2">${orchid.price}</span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <strong>Type:</strong>
                                        <Badge 
                                            bg={orchid.isNatural ? "success" : "warning"}
                                            className="ms-2 custom-badge"
                                        >
                                            {orchid.isNatural ? "Natural" : "Industry"}
                                        </Badge>
                                    </div>
                                </Col>
                            </Row>
                            <div className="mb-3">
                                <strong>Orchid ID:</strong>
                                <span className="text-muted ms-2">#{orchid.orchidId}</span>
                            </div>
                        </Card.Body>
                    </Card>

                    <div className="mt-4">
                        <Link to="/">
                            <Button variant="outline-primary" className="me-2 shadow-sm">
                                ← Back to Orchids
                            </Button>
                        </Link>
                        <Link to="/home">
                            <Button variant="outline-secondary" className="shadow-sm">
                                ← Back to Home
                            </Button>
                        </Link>
                        {role === 'ROLE_USER' && (
                          <Button variant="success" className="ms-2 shadow-sm" onClick={() => setShowBuyModal(true)}>
                            Buy
                          </Button>
                        )}
                    </div>
                </Col>

                <Col lg={4} className="p-3">
                    <Card className="sticky-top shadow custom-card" style={{ top: '2rem' }}>
                        <Card.Header className="bg-light text-center">
                            <h5 className="text-primary mb-0">Orchid Image</h5>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <Image
                                src={orchid.orchidUrl}
                                alt={orchid.orchidName}
                                fluid
                                className="rounded shadow-sm custom-image"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x400?text=Orchid+Image';
                                }}
                            />
                            
                            <div className="mt-3">
                                <Badge className="bg-primary fs-6 px-3 py-2 custom-badge">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 48 48"
                                        className="me-2"
                                    >
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M26.924 4c.967 0 1.866.217 2.667.675c.685.39 1.462.93 2.037 1.734l-.012.01l.01.014l2.332 3.022l.822 1.095a9.414 9.414 0 0 1-.002 11.34l-4.508 5.818l6.95 8.944a2 2 0 0 1-.242 2.713l-4.066 3.662A2 2 0 0 1 30 42.775l-5.79-7.383l-5.845 7.451a2 2 0 0 1-2.781.36l-4.379-3.317a2 2 0 0 1-.368-2.826l7.314-9.358l-4.504-5.714l-.006-.008a9.414 9.414 0 0 1-.002-11.339l.002-.002l.811-1.082l2.337-3.029l.108-.141C18.008 4.85 19.853 4 21.678 4zm1.675 2.411c.551.315 1.02.66 1.348 1.088l-.015.011l.1.13a4.03 4.03 0 0 1-.022 4.792c-.934-.57-2.045-.923-3.177-.923h-5.247c-1.123 0-2.267.3-3.241.924a4.2 4.2 0 0 1-.735-2.366c0-.815.256-1.632.773-2.331l.115-.15l.01-.014C19.21 6.59 20.434 6 21.677 6h5.248c.66 0 1.21.145 1.675.411m-9.025 7.616l4.6 5.942l4.6-5.942c-.598-.325-1.278-.518-1.94-.518h-5.248c-.72 0-1.42.179-2.012.518m9.422 12.06l-3.552-4.49l6.066-7.836a5.95 5.95 0 0 0 1.199-2.638l.475.633a7.415 7.415 0 0 1 .003 8.921zm-9.57 3.232l-7.013 8.973l4.378 3.317l6.146-7.836zM16.91 13.852a6.06 6.06 0 0 1-1.192-2.648l-.479.639l-.003.004a7.414 7.414 0 0 0-.005 8.918l9.766 12.39l6.578 8.386l4.066-3.662l-7.42-9.55l-4.795-6.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Beautiful Orchid
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Buy Modal */}
            <Modal show={showBuyModal} onHide={() => setShowBuyModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Buy Orchid</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="shadow-sm"
                    />
                  </Form.Group>
                </Form>
                {buyError && <div className="text-danger mt-2">{buyError}</div>}
                {buySuccess && <div className="text-success mt-2">{buySuccess}</div>}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowBuyModal(false)}>
                  Cancel
                </Button>
                <Button variant="success" onClick={handleBuy} disabled={buyLoading}>
                  {buyLoading ? 'Processing...' : 'Confirm Purchase'}
                </Button>
              </Modal.Footer>
            </Modal>
        </Container>
    );
}