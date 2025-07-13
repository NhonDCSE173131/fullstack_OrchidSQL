import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container';
import { Button, Col, Image, Modal, Row, Card, Badge } from 'react-bootstrap'
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
    const [orchids, setOrchids] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchOrchids();
    }, [])

    const fetchOrchids = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get the authentication token
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                setError('Authentication required. Please login again.');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/orchids', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }); 
            
            const sortedData = response.data.sort((a, b) => parseInt(b.orchidId) - parseInt(a.orchidId));
            setOrchids(sortedData);
        } catch (error) {
            console.error('Error fetching orchids:', error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Authentication failed. Please login again.');
                } else if (error.response.status === 403) {
                    setError('Access denied. You do not have permission to view orchids.');
                } else {
                    setError(`Failed to load orchids: ${error.response.data?.message || 'Server error'}`);
                }
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('Failed to load orchids. Please try again.');
            }
        } finally {
            setLoading(false);
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

    if (error) {
        return (
            <Container className="mt-4">
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
        <Container className="mt-4">
            <div className="mb-4">
                <h2 className="text-primary">Welcome to Orchid Garden</h2>
                <p className="text-muted">Discover our beautiful collection of orchids</p>
            </div>
            
            <Row className='g-4'>
                {orchids.map((orchid) => (
                    <Col md={4} lg={3} key={orchid.orchidId}>
                        <Card className="h-100 shadow-sm custom-card">
                            <Card.Img 
                                variant="top" 
                                src={orchid.orchidUrl} 
                                alt={orchid.orchidName}
                                style={{ height: '250px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x250?text=Orchid+Image';
                                }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fw-bold">{orchid.orchidName}</Card.Title>
                                <Card.Text className="text-muted flex-grow-1">
                                    {orchid.orchidDescription}
                                </Card.Text>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Badge 
                                        bg={orchid.isNatural ? "success" : "warning"}
                                        className="mb-2 custom-badge"
                                    >
                                        {orchid.isNatural ? "Natural" : "Industry"}
                                    </Badge>
                                    <span className="fw-bold text-primary">
                                        ${orchid.price}
                                    </span>
                                </div>
                                
                                <Link to={`/detail/${orchid.orchidId}`}>
                                    <Button variant="primary" className="w-100 shadow-sm">
                                        View Details
                                    </Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            {orchids.length === 0 && (
                <div className="text-center mt-5">
                    <h4 className="text-muted">No orchids available</h4>
                    <p>Check back later for new additions to our collection.</p>
                </div>
            )}
        </Container>
    )
}
