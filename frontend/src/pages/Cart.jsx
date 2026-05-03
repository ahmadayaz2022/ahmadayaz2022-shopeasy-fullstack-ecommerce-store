import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currencyHelper';
import { 
  FaTrash, 
  FaShoppingCart, 
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaTag,
  FaMinus,
  FaPlus,
  FaHeart
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cart, removeFromCart, loading, updateQuantity } = useCart();
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100x100?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  const handleRemoveItem = async (productId, productName) => {
    await removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleQuantityChange = async (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) {
      toast.warning('Minimum quantity is 1');
      return;
    }
    if (updateQuantity) {
      await updateQuantity(productId, newQty);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="fa-spin" size={40} />
        <p className="mt-3 text-muted">Loading your cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="empty-cart-page">
        <Container className="py-5 text-center">
          <div className="empty-cart-icon">
            <FaShoppingCart size={80} className="text-muted mb-4" />
          </div>
          <h3>Your cart is empty</h3>
          <p className="text-muted mb-4">Looks like you haven't added any items yet. Let's change that!</p>
          <Link to="/products">
            <Button variant="dark" size="lg" className="rounded-pill px-5">
              <FaArrowLeft className="me-2" /> Continue Shopping
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page">
      <Container className="py-4">
        {/* Header */}
        <div className="cart-header">
          <Row className="align-items-center">
            <Col>
              <h2 className="cart-title">Shopping Cart</h2>
              <p className="text-muted mb-0">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>
            </Col>
            <Col xs="auto">
              <Link to="/products" className="continue-link">
                <FaArrowLeft className="me-1" /> Continue Shopping
              </Link>
            </Col>
          </Row>
        </div>

        <Row className="g-4">
          {/* Cart Items */}
          <Col lg={8}>
            {cart.items.map((item, index) => (
              <Card key={item.product?._id || index} className="cart-item-card mb-3">
                <Card.Body>
                  <Row className="align-items-center g-3">
                    {/* Image */}
                    <Col xs={3} md={2}>
                      <Link to={`/products/${item.product?._id}`}>
                        <div className="cart-item-image-wrap">
                          <Image
                            src={getImageUrl(item.product?.images?.[0])}
                            alt={item.product?.name || 'Product'}
                            className="cart-item-img"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                          {item.product?.bestseller && (
                            <span className="cart-item-badge">Best</span>
                          )}
                        </div>
                      </Link>
                    </Col>

                    {/* Product Info */}
                    <Col xs={9} md={4}>
                      <Link to={`/products/${item.product?._id}`} className="text-decoration-none">
                        <h6 className="cart-item-name">{item.product?.name || 'Product'}</h6>
                      </Link>
                      <span className="cart-item-category text-muted small">
                        {item.product?.category} / {item.product?.subCategory}
                      </span>
                      <div className="cart-item-price-mobile d-md-none mt-1">
                        {formatPrice(item.product?.price || 0, item.product?.currency)}
                      </div>
                    </Col>

                    {/* Quantity Controls */}
                    <Col xs={6} md={3}>
                      <div className="quantity-control-cart">
                        <button
                          className="qty-cart-btn"
                          onClick={() => handleQuantityChange(item.product?._id, item.quantity, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="qty-cart-value">{item.quantity}</span>
                        <button
                          className="qty-cart-btn"
                          onClick={() => handleQuantityChange(item.product?._id, item.quantity, 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </Col>

                    {/* Subtotal */}
                    <Col xs={3} md={2} className="d-none d-md-block text-center">
                      <span className="cart-item-subtotal">
                        {formatPrice((item.product?.price || 0) * item.quantity, item.product?.currency)}
                      </span>
                    </Col>

                    {/* Remove */}
                    <Col xs={3} md={1} className="text-end">
                      <button
                        className="cart-remove-btn"
                        onClick={() => handleRemoveItem(item.product?._id, item.product?.name)}
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <div className="order-summary-sticky">
              <Card className="order-summary-card">
                <Card.Body>
                  <h5 className="summary-title">Order Summary</h5>
                  <hr />
                  
                  <div className="summary-row">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>{formatPrice(subtotal, cart.items[0]?.product?.currency || 'USD')}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-success fw-bold">FREE</span>
                    ) : (
                      <span>{formatPrice(shipping, cart.items[0]?.product?.currency || 'USD')}</span>
                    )}
                  </div>
                  <div className="summary-row">
                    <span>Tax (5%)</span>
                    <span>{formatPrice(tax, cart.items[0]?.product?.currency || 'USD')}</span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className="free-shipping-hint">
                      <FaTruck className="me-1" />
                      Add {formatPrice(50 - subtotal, cart.items[0]?.product?.currency || 'USD')} more for free shipping!
                    </div>
                  )}
                  
                  <hr />
                  <div className="summary-total-row">
                    <span>Total</span>
                    <span className="summary-total-price">
                      {formatPrice(total, cart.items[0]?.product?.currency || 'USD')}
                    </span>
                  </div>

                  <Button
                    variant="dark"
                    size="lg"
                    className="w-100 checkout-btn"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout <FaArrowRight className="ms-2" />
                  </Button>

                  <div className="secure-checkout">
                    <FaShieldAlt className="me-1 text-success" />
                    <small>Secure checkout · SSL encrypted</small>
                  </div>
                </Card.Body>
              </Card>

              {/* Promo Code */}
              <Card className="promo-card mt-3">
                <Card.Body>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="promo-input"
                      placeholder="Promo code"
                    />
                    <Button variant="outline-dark" size="sm" className="promo-btn">
                      Apply
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Trust Badges */}
              <div className="trust-badges-cart mt-3 text-center">
                <div className="d-flex justify-content-center gap-3">
                  <div className="trust-badge-item">
                    <FaTruck className="text-success" />
                    <small>Free Shipping*</small>
                  </div>
                  <div className="trust-badge-item">
                    <FaShieldAlt className="text-primary" />
                    <small>Secure Payment</small>
                  </div>
                  <div className="trust-badge-item">
                    <FaTag className="text-warning" />
                    <small>Best Price</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartPage;