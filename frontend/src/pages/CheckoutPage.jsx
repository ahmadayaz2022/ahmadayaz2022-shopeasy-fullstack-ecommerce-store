import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../api/axios';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currencyHelper';
import { toast } from 'react-toastify';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaMoneyBillWave, 
  FaLock, 
  FaCheck,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaBox
} from 'react-icons/fa';

const CheckoutPage = () => {
  const [step, setStep] = useState(1); // 1=Shipping, 2=Payment, 3=Review
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    }
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
    }
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    setCardDetails({ ...cardDetails, [name]: formattedValue });
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setError(null);
  };

  const validateAddress = () => {
    const errors = [];
    if (!address.street?.trim()) errors.push('Street address');
    if (!address.city?.trim()) errors.push('City');
    if (!address.state?.trim()) errors.push('State');
    if (!address.zipCode?.trim()) errors.push('ZIP code');
    if (!address.country?.trim()) errors.push('Country');
    if (!address.phone?.trim()) errors.push('Phone number');
    
    if (errors.length > 0) {
      setError(`Please fill in: ${errors.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateAddress()) return;
    if (step === 1) { setStep(2); return; }
    if (step === 2) { setStep(3); return; }
  };

  const handlePlaceOrder = async () => {
    setError(null);
    if (!cart?.items?.length) {
      setError('Your cart is empty');
      return;
    }
    if (paymentMethod !== 'Cash on Delivery') {
      setShowPaymentModal(true);
      return;
    }
    await submitOrder(paymentMethod, null);
  };

  const submitOrder = async (method, cardDetailsData = null) => {
    setLoading(true);
    try {
      const orderData = {
        shippingAddress: {
          street: address.street.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          zipCode: address.zipCode.trim(),
          country: address.country.trim(),
          phone: address.phone.trim()
        },
        paymentMethod: method
      };
      if (method !== 'Cash on Delivery' && cardDetailsData) {
        orderData.cardDetails = {
          cardNumber: cardDetailsData.cardNumber.replace(/\s/g, ''),
          cardHolder: cardDetailsData.cardHolder,
          expiryDate: cardDetailsData.expiryDate,
          cvv: cardDetailsData.cvv
        };
      }
      await orderService.create(orderData);
      toast.success('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 1500);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to place order';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  const handlePaymentSubmit = () => {
    if (!cardDetails.cardNumber?.replace(/\s/g, '').length >= 13) { setError('Valid card number required'); return; }
    if (!cardDetails.cardHolder?.trim()) { setError('Card holder name required'); return; }
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) { setError('Valid expiry date required'); return; }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) { setError('Valid CVV required'); return; }
    setError(null);
    submitOrder(paymentMethod, cardDetails);
  };

  const cartTotal = cart?.items?.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0;
  const currency = cart?.items?.[0]?.product?.currency || 'USD';
  const shipping = cartTotal > 50 ? 0 : 9.99;
  const tax = cartTotal * 0.05;
  const total = cartTotal + shipping + tax;

  const paymentMethods = [
    { id: 'Cash on Delivery', icon: FaMoneyBillWave, color: 'success', desc: 'Pay when you receive' },
    { id: 'Credit Card', icon: FaCreditCard, color: 'primary', desc: 'Visa, Mastercard, Amex' },
    { id: 'Debit Card', icon: FaCreditCard, color: 'info', desc: 'Pay from your bank' },
    { id: 'PayPal', icon: FaPaypal, color: 'secondary', desc: 'Fast & secure' },
  ];

  return (
    <div className="checkout-page">
      <Container className="py-4">
        {/* Header */}
        <div className="checkout-header mb-4">
          <h2 className="checkout-title">Checkout</h2>
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-circle">{step > 1 ? <FaCheck /> : '1'}</div>
              <span>Shipping</span>
            </div>
            <div className="step-line ${step >= 2 ? 'active' : ''}"></div>
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-circle">{step > 2 ? <FaCheck /> : '2'}</div>
              <span>Payment</span>
            </div>
            <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span>Review</span>
            </div>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

        <Row className="g-4">
          <Col lg={8}>
            {/* Step 1: Shipping */}
            {step === 1 && (
              <Card className="checkout-card">
                <Card.Body>
                  <h4 className="card-step-title"><FaMapMarkerAlt className="me-2 text-danger" />Shipping Address</h4>
                  <Form onSubmit={(e) => e.preventDefault()}>
                    <Row>
                      <Col md={12}><Form.Group className="mb-3"><Form.Label>Street Address *</Form.Label><Form.Control type="text" name="street" value={address.street} onChange={handleAddressChange} placeholder="123 Main St, Apt 4B" /></Form.Group></Col>
                      <Col md={6}><Form.Group className="mb-3"><Form.Label>City *</Form.Label><Form.Control type="text" name="city" value={address.city} onChange={handleAddressChange} placeholder="New York" /></Form.Group></Col>
                      <Col md={3}><Form.Group className="mb-3"><Form.Label>State *</Form.Label><Form.Control type="text" name="state" value={address.state} onChange={handleAddressChange} placeholder="NY" /></Form.Group></Col>
                      <Col md={3}><Form.Group className="mb-3"><Form.Label>ZIP Code *</Form.Label><Form.Control type="text" name="zipCode" value={address.zipCode} onChange={handleAddressChange} placeholder="10001" /></Form.Group></Col>
                      <Col md={6}><Form.Group className="mb-3"><Form.Label>Country *</Form.Label><Form.Control type="text" name="country" value={address.country} onChange={handleAddressChange} placeholder="United States" /></Form.Group></Col>
                      <Col md={6}><Form.Group className="mb-3"><Form.Label>Phone *</Form.Label><Form.Control type="text" name="phone" value={address.phone} onChange={handleAddressChange} placeholder="+1 (234) 567-890" /></Form.Group></Col>
                    </Row>
                    <Button variant="dark" size="lg" className="w-100 mt-3" onClick={handleNextStep}>
                      Continue to Payment <FaArrowRight className="ms-2" />
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <Card className="checkout-card">
                <Card.Body>
                  <h4 className="card-step-title"><FaLock className="me-2 text-success" />Payment Method</h4>
                  <Row>
                    {paymentMethods.map((m) => (
                      <Col md={6} key={m.id} className="mb-3">
                        <Card className={`payment-card ${paymentMethod === m.id ? 'selected' : ''}`} onClick={() => handlePaymentMethodSelect(m.id)}>
                          <Card.Body className="d-flex align-items-center">
                            <m.icon className={`text-${m.color} me-3`} size={28} />
                            <div className="flex-grow-1"><h6 className="mb-0">{m.id}</h6><small className="text-muted">{m.desc}</small></div>
                            {paymentMethod === m.id && <FaCheck className="text-success" />}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <div className="d-flex gap-2 mt-3">
                    <Button variant="outline-dark" onClick={() => setStep(1)}><FaArrowLeft className="me-1" /> Back</Button>
                    <Button variant="dark" size="lg" className="flex-grow-1" onClick={handleNextStep}>
                      Review Order <FaArrowRight className="ms-2" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <Card className="checkout-card">
                <Card.Body>
                  <h4 className="card-step-title"><FaBox className="me-2 text-warning" />Review Your Order</h4>
                  
                  <h6 className="fw-bold mb-2">Shipping To:</h6>
                  <div className="review-box mb-3">
                    <p className="mb-1">{address.street}</p>
                    <p className="mb-1">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="mb-1">{address.country}</p>
                    <p className="mb-0">📞 {address.phone}</p>
                  </div>

                  <h6 className="fw-bold mb-2">Payment:</h6>
                  <div className="review-box mb-3">
                    <p className="mb-0"><strong>{paymentMethod}</strong></p>
                  </div>

                  <h6 className="fw-bold mb-2">Items ({cart?.items?.length || 0}):</h6>
                  {cart?.items?.map((item, i) => (
                    <div key={i} className="review-item">
                      <span>{item.product?.name} × {item.quantity}</span>
                      <span>{formatPrice(item.product?.price * item.quantity, item.product?.currency)}</span>
                    </div>
                  ))}

                  <div className="d-flex gap-2 mt-4">
                    <Button variant="outline-dark" onClick={() => setStep(2)}><FaArrowLeft className="me-1" /> Back</Button>
                    <Button variant="success" size="lg" className="flex-grow-1" onClick={handlePlaceOrder} disabled={loading}>
                      {loading ? <><Spinner size="sm" className="me-2" />Processing...</> : <>Place Order - {formatPrice(total, currency)}</>}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Order Summary Sidebar */}
          <Col lg={4}>
            <div className="order-summary-sticky">
              <Card className="order-summary-card">
                <Card.Body>
                  <h5 className="summary-title">Order Summary</h5>
                  <hr />
                  {cart?.items?.length > 0 ? (
                    <>
                      {cart.items.map((item, i) => (
                        <div key={i} className="summary-item">
                          <div>
                            <p className="mb-0 fw-semibold small">{item.product?.name}</p>
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                          <span className="fw-bold">{formatPrice(item.product?.price * item.quantity, item.product?.currency)}</span>
                        </div>
                      ))}
                      <hr />
                      <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal, currency)}</span></div>
                      <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="text-success fw-bold">FREE</span> : formatPrice(shipping, currency)}</span></div>
                      <div className="summary-row"><span>Tax (5%)</span><span>{formatPrice(tax, currency)}</span></div>
                      <hr />
                      <div className="summary-total"><span>Total</span><span>{formatPrice(total, currency)}</span></div>
                    </>
                  ) : (
                    <p className="text-muted text-center">Cart is empty</p>
                  )}
                </Card.Body>
              </Card>
              <div className="secure-badge-checkout text-center mt-3">
                <FaShieldAlt className="text-success me-1" />
                <small>SSL Encrypted · Secure Checkout</small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => { setShowPaymentModal(false); setError(null); }} centered>
        <Modal.Header closeButton><Modal.Title><FaLock className="me-2 text-success" />Secure Payment - {paymentMethod}</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Alert variant="info"><small>💡 Simulated payment. Use any card (e.g., 4242 4242 4242 4242). 90% success.</small></Alert>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3"><Form.Label>Card Holder *</Form.Label><Form.Control type="text" name="cardHolder" value={cardDetails.cardHolder} onChange={handleCardChange} placeholder="JOHN DOE" /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Card Number *</Form.Label><Form.Control type="text" name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardChange} placeholder="4242 4242 4242 4242" maxLength={19} /></Form.Group>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Expiry *</Form.Label><Form.Control type="text" name="expiryDate" value={cardDetails.expiryDate} onChange={handleCardChange} placeholder="MM/YY" maxLength={5} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>CVV *</Form.Label><Form.Control type="text" name="cvv" value={cardDetails.cvv} onChange={handleCardChange} placeholder="123" maxLength={4} /></Form.Group></Col>
            </Row>
            <div className="payment-amount-box"><small>Amount:</small><h5>{formatPrice(total, currency)}</h5></div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handlePaymentSubmit} disabled={loading}>
            {loading ? <><Spinner size="sm" className="me-2" />Processing...</> : `Pay ${formatPrice(total, currency)}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPage;