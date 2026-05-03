import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { orderService } from '../../api/axios';
import { toast } from 'react-toastify';
import { FaEye, FaTruck, FaCheck, FaTimes, FaSync } from 'react-icons/fa';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderService.getAll();
      console.log('Orders fetched:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      await orderService.updateStatus(selectedOrder._id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      setShowModal(false);
      setSelectedOrder(null);
      setNewStatus('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    return variants[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': FaEye,
      'Processing': FaEye,
      'Shipped': FaTruck,
      'Delivered': FaCheck,
      'Cancelled': FaTimes
    };
    const IconComponent = icons[status] || FaEye;
    return <IconComponent />;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/50x50?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  if (loading) {
    return (
      <Container fluid className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading orders...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Orders Management</h2>
        <Button variant="outline-primary" onClick={fetchOrders}>
          <FaSync className="me-2" /> Refresh Orders
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h4 className="text-muted">No orders yet</h4>
            <p>When customers place orders, they will appear here.</p>
          </Card.Body>
        </Card>
      ) : (
        <div className="table-responsive shadow-sm">
          <Table striped bordered hover>
            <thead className="bg-dark text-white">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <small className="fw-bold">
                      {order._id ? order._id.substring(order._id.length - 8) : 'N/A'}
                    </small>
                  </td>
                  <td>
                    <strong>{order.user?.name || 'Unknown'}</strong>
                    <br />
                    <small className="text-muted">{order.user?.email}</small>
                  </td>
                  <td>
                    {order.items?.map((item, index) => (
                      <div key={index} className="mb-1">
                        <small>
                          {item.product?.name || 'Product'} × {item.quantity}
                        </small>
                      </div>
                    ))}
                  </td>
                  <td>
                    <strong>${order.totalPrice?.toFixed(2)}</strong>
                  </td>
                  <td>
                    <small>{order.paymentMethod || 'N/A'}</small>
                    <br />
                    <Badge bg={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                      {order.paymentStatus || 'Pending'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusBadge(order.status)} className="d-flex align-items-center gap-1">
                      {getStatusIcon(order.status)}
                      <span className="ms-1">{order.status}</span>
                    </Badge>
                  </td>
                  <td>
                    <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                    <br />
                    <small className="text-muted">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </small>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                        title="View Details"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setShowModal(true);
                        }}
                        title="Update Status"
                      >
                        <FaTruck />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Update Status Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedOrder.user?.name}
              </p>
              <p>
                <strong>Current Status:</strong>{' '}
                <Badge bg={getStatusBadge(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
              </p>
              <Form.Group className="mt-3">
                <Form.Label>New Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Order Detail Modal */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={getStatusBadge(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                </Col>
              </Row>

              <h6>Shipping Address</h6>
              <Card className="p-3 mb-3 bg-light">
                <p className="mb-1">{selectedOrder.shippingAddress?.street}</p>
                <p className="mb-1">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                </p>
                <p className="mb-0">{selectedOrder.shippingAddress?.country}</p>
              </Card>

              <h6>Order Items</h6>
              {selectedOrder.items?.map((item, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={2}>
                        <img
                          src={getImageUrl(item.product?.images?.[0])}
                          alt={item.product?.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          className="rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                          }}
                        />
                      </Col>
                      <Col xs={5}>
                        <strong>{item.product?.name}</strong>
                      </Col>
                      <Col xs={2}>
                        <small>Qty: {item.quantity}</small>
                      </Col>
                      <Col xs={3} className="text-end">
                        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              <hr />
              <Row>
                <Col md={6}>
                  <h6>Payment Information</h6>
                  <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={selectedOrder.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </p>
                  {selectedOrder.paymentDetails?.transactionId && (
                    <p><strong>Transaction ID:</strong> {selectedOrder.paymentDetails.transactionId}</p>
                  )}
                </Col>
                <Col md={6} className="text-end">
                  <h6>Total Amount</h6>
                  <h4 className="text-primary">${selectedOrder.totalPrice?.toFixed(2)}</h4>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button 
            variant="warning" 
            onClick={() => {
              setShowDetailModal(false);
              setNewStatus(selectedOrder?.status);
              setShowModal(true);
            }}
          >
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminOrders;