import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Button, Modal, Spinner, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { orderService } from '../api/axios';
import { formatPrice } from '../utils/currencyHelper';
import { 
  FaBox, 
  FaShoppingBag, 
  FaTruck, 
  FaCheck, 
  FaTimes, 
  FaChevronDown, 
  FaChevronUp,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaReceipt,
  FaSearch,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderService.getMyOrders();
      console.log('Orders fetched:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
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
      'Pending': FaBox,
      'Processing': FaBox,
      'Shipped': FaTruck,
      'Delivered': FaCheck,
      'Cancelled': FaTimes
    };
    const IconComponent = icons[status] || FaBox;
    return <IconComponent />;
  };

  const getStatusProgress = (status) => {
    const progressMap = {
      'Pending': 25,
      'Processing': 50,
      'Shipped': 75,
      'Delivered': 100,
      'Cancelled': 0
    };
    return progressMap[status] || 0;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/80x80?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    try {
      await orderService.updateStatus(selectedOrderId, 'Cancelled');
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setShowCancelModal(false);
      setSelectedOrderId(null);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  // Get currency from first order item
  const getOrderCurrency = (order) => {
    return order.items?.[0]?.product?.currency || order.items?.[0]?.currency || 'USD';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="dark" />
        <p className="mt-3 text-muted">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      {/* Page Header */}
      <section className="order-page-header">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="order-page-title">My Orders</h1>
              <p className="order-page-subtitle">
                {orders.length} order{orders.length !== 1 ? 's' : ''} placed
              </p>
            </Col>
            <Col xs="auto">
              <Link to="/products">
                <Button variant="light" className="continue-shopping-btn rounded-pill">
                  <FaShoppingBag className="me-2" /> Continue Shopping
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-4">
        {orders.length === 0 ? (
          <div className="empty-orders text-center py-5">
            <div className="empty-orders-icon">
              <FaBox size={80} className="text-muted mb-4" />
            </div>
            <h3>No orders yet</h3>
            <p className="text-muted mb-4">
              Looks like you haven't placed any orders yet. Start shopping and track your orders here.
            </p>
            <Link to="/products">
              <Button variant="dark" size="lg" className="rounded-pill px-5">
                <FaShoppingBag className="me-2" /> Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <Row className="mb-4 g-3">
              {[
                { label: 'Total Orders', value: orders.length, icon: FaReceipt, color: '#1a1a2e' },
                { label: 'Processing', value: orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length, icon: FaBox, color: '#ffc107' },
                { label: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length, icon: FaTruck, color: '#0d6efd' },
                { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: FaCheck, color: '#28a745' },
              ].map((stat, i) => (
                <Col xs={6} md={3} key={i}>
                  <Card className="order-stat-card">
                    <Card.Body className="text-center">
                      <stat.icon style={{ color: stat.color, fontSize: '1.5rem' }} className="mb-2" />
                      <h4 className="mb-0 fw-bold">{stat.value}</h4>
                      <small className="text-muted">{stat.label}</small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Filter Tabs */}
            <div className="order-filters mb-4">
              {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'dark' : 'outline-dark'}
                  size="sm"
                  className="filter-btn me-2 mb-2"
                  onClick={() => setFilter(status)}
                >
                  {status === 'all' ? 'All Orders' : status}
                  {status !== 'all' && (
                    <Badge bg={getStatusBadge(status)} className="ms-2">
                      {orders.filter(o => o.status === status).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-4">
                <FaSearch size={40} className="text-muted mb-3" />
                <p className="text-muted">No orders found with status "{filter}"</p>
                <Button variant="outline-dark" onClick={() => setFilter('all')}>Show All Orders</Button>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const currency = getOrderCurrency(order);
                return (
                  <Card key={order._id} className="order-card mb-4">
                    {/* Order Header */}
                    <Card.Header className="order-header">
                      <Row className="align-items-center g-2">
                        <Col md={3}>
                          <div className="order-id">
                            <FaReceipt className="me-2 text-muted" />
                            <span className="fw-bold">#{order._id.slice(-8).toUpperCase()}</span>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="order-date">
                            <FaCalendarAlt className="me-2 text-muted" />
                            <small>{new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}</small>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="order-total">
                            <span className="text-muted">Total: </span>
                            <strong>{formatPrice(order.totalPrice, currency)}</strong>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <Badge bg={getStatusBadge(order.status)} className="status-badge d-flex align-items-center">
                              {getStatusIcon(order.status)}
                              <span className="ms-1">{order.status}</span>
                            </Badge>
                            <Button variant="link" className="expand-btn p-0" onClick={() => toggleOrderDetails(order._id)}>
                              {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card.Header>

                    {/* Progress Bar */}
                    {order.status !== 'Cancelled' && (
                      <div className="order-progress px-3 pt-3">
                        <ProgressBar 
                          now={getStatusProgress(order.status)} 
                          variant={
                            order.status === 'Delivered' ? 'success' :
                            order.status === 'Shipped' ? 'primary' :
                            order.status === 'Processing' ? 'info' : 'warning'
                          }
                          className="order-progress-bar"
                        />
                        <div className="d-flex justify-content-between mt-2">
                          {['Pending', 'Processing', 'Shipped', 'Delivered'].map(s => (
                            <small key={s} className={getStatusProgress(order.status) >= getStatusProgress(s) ? 'text-dark fw-bold' : 'text-muted'}>
                              {s}
                            </small>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preview */}
                    <Card.Body className="order-items-preview">
                      <Row className="align-items-center">
                        <Col xs={2} md={1}>
                          <img src={getImageUrl(order.items[0]?.product?.images?.[0])} alt="" className="order-item-preview-img"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60?text=No+Image'; }} />
                        </Col>
                        <Col xs={6} md={7}>
                          <h6 className="mb-0">{order.items[0]?.product?.name || 'Product'}</h6>
                          {order.items.length > 1 && (
                            <small className="text-muted">+{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}</small>
                          )}
                        </Col>
                        <Col xs={4} md={4} className="text-end">
                          {order.status === 'Pending' && (
                            <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleCancelOrder(order._id)}>
                              Cancel
                            </Button>
                          )}
                          <Button variant="outline-dark" size="sm" onClick={() => toggleOrderDetails(order._id)}>
                            {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>

                    {/* Expanded Details */}
                    {expandedOrder === order._id && (
                      <div className="order-details-expanded">
                        <hr className="my-0" />
                        <Card.Body>
                          <h6 className="mb-3">Order Items</h6>
                          {order.items.map((item, index) => (
                            <Row key={index} className="align-items-center mb-3 order-item-detail">
                              <Col xs={2} md={1}>
                                <img src={getImageUrl(item.product?.images?.[0])} alt="" className="order-item-img rounded"
                                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }} />
                              </Col>
                              <Col xs={5} md={6}>
                                <Link to={`/products/${item.product?._id}`} className="text-decoration-none">
                                  <h6 className="mb-0 text-dark">{item.product?.name || 'Product'}</h6>
                                </Link>
                                <small className="text-muted">{formatPrice(item.price, currency)} × {item.quantity}</small>
                              </Col>
                              <Col xs={5} md={5} className="text-end">
                                <strong>{formatPrice(item.price * item.quantity, currency)}</strong>
                              </Col>
                            </Row>
                          ))}

                          <hr />
                          <Row>
                            <Col md={6}>
                              <h6><FaMapMarkerAlt className="me-2 text-danger" />Shipping Address</h6>
                              <div className="address-box">
                                <p className="mb-1">{order.shippingAddress?.street}</p>
                                <p className="mb-1">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                                <p className="mb-1">{order.shippingAddress?.country}</p>
                                {order.shippingAddress?.phone && <p className="mb-0"><FaPhone className="me-1" />{order.shippingAddress.phone}</p>}
                              </div>
                            </Col>
                            <Col md={6}>
                              <h6><FaCreditCard className="me-2 text-primary" />Payment</h6>
                              <div className="payment-box">
                                <p className="mb-1"><strong>Method:</strong> {order.paymentMethod || 'COD'}</p>
                                <p className="mb-1"><strong>Status:</strong> <Badge bg={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>{order.paymentStatus || 'Pending'}</Badge></p>
                                {order.paymentDetails?.transactionId && (
                                  <p className="mb-0 small"><strong>TXN:</strong> {order.paymentDetails.transactionId}</p>
                                )}
                              </div>
                            </Col>
                          </Row>

                          <div className="order-summary-box mt-3">
                            <Row>
                              <Col md={6}><small className="text-muted">Placed: {new Date(order.createdAt).toLocaleString()}</small></Col>
                              <Col md={6} className="text-end"><h5 className="mb-0">Total: <span className="text-primary">{formatPrice(order.totalPrice, currency)}</span></h5></Col>
                            </Row>
                          </div>
                        </Card.Body>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </>
        )}
      </Container>

      {/* Cancel Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Cancel Order</Modal.Title></Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this order?</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Keep Order</Button>
          <Button variant="danger" onClick={confirmCancelOrder}>Cancel Order</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;