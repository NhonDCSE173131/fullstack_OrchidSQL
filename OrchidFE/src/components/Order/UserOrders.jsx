import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getRoleFromToken, getUsernameFromToken } from '../../utils/tokenUtils.js';
import { getAuthHeaders } from '../../utils/authUtils.js';
import { Container, Table, Button, Modal, Card } from 'react-bootstrap';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('authToken');
  const username = getUsernameFromToken(token);
  const baseUrl = 'http://localhost:8080/api/orders';

  useEffect(() => {
    axios.get(baseUrl + '/my', { headers: getAuthHeaders() })
      .then(res => setOrders(res.data));
  }, [username]);

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <Card className="shadow rounded custom-card mb-4">
        <Card.Body>
          <h2 className="text-primary mb-4">Your Orders</h2>
          <Table striped bordered hover responsive className="custom-table align-middle">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orchidId || order.id}>
                  <td>{order.orchidId || order.id}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.price}</td>
                  <td>
                    <Button size="sm" onClick={() => handleView(order)} className="shadow-sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p><strong>Order ID:</strong> {selectedOrder.orchidId || selectedOrder.id}</p>
              <p><strong>Date:</strong> {selectedOrder.orderDate}</p>
              <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
              <p><strong>Total:</strong> {selectedOrder.price}</p>
              {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-3">Order Items</h5>
                  <Table size="sm" bordered hover responsive className="custom-table align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderDetails.map(detail => (
                        <tr key={detail.id}>
                          <td>
                            <img src={detail.orchidUrl} alt={detail.orchidName} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8}} />
                          </td>
                          <td>{detail.orchidName}</td>
                          <td>{detail.quantity}</td>
                          <td>{detail.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              {/* Add more details as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} className="shadow-sm">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
} 