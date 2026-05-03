import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Badge, Breadcrumb, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../api/axios';
import { useCart } from '../context/CartContext';
import { formatPrice, getCurrencySymbol } from '../utils/currencyHelper';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaTruck, 
  FaShieldAlt, 
  FaUndo, 
  FaStar, 
  FaStarHalfAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaBox,
  FaRegHeart,
  FaShareAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x600?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await productService.getSingle(id);
      console.log('Fetched product:', data);
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.warning('Please select a size');
      return;
    }
    if (product.countInStock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    addToCart(product._id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    setQuantity(Math.min(Math.max(1, val), product.countInStock || 99));
  };

  const nextImage = () => {
    if (!product?.images) return;
    setActiveImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const getStockStatus = () => {
    if (!product) return null;
    if (product.countInStock === 0) return { text: 'Out of Stock', color: 'danger', icon: FaBox };
    if (product.countInStock <= 5) return { text: `Only ${product.countInStock} left`, color: 'warning', icon: FaBox };
    return { text: 'In Stock', color: 'success', icon: FaCheck };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-dark" role="status" />
        <p className="mt-3 text-muted">Loading product details...</p>
      </div>
    );
  }

  if (!product) return null;

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  return (
    <div className="product-detail-page">
      <Container className="py-4">
        {/* Breadcrumb */}
        <div className="breadcrumb-row mb-4">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to={`/products?category=${product.category}`} className="breadcrumb-link text-capitalize">
            {product.category}
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        <Row className="g-5">
          {/* Image Gallery */}
          <Col lg={6} md={6}>
            <div className="product-gallery">
              {/* Main Image */}
              <div className="gallery-main">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={getImageUrl(product.images[activeImage])}
                      alt={product.name}
                      className="gallery-main-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
                    />
                    {product.images.length > 1 && (
                      <>
                        <button className="gallery-nav prev" onClick={prevImage}>
                          <FaChevronLeft />
                        </button>
                        <button className="gallery-nav next" onClick={nextImage}>
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                    {product.bestseller && (
                      <span className="gallery-badge bestseller">Bestseller</span>
                    )}
                    {product.countInStock === 0 && (
                      <span className="gallery-badge sold-out">Sold Out</span>
                    )}
                  </>
                ) : (
                  <img
                    src="https://via.placeholder.com/600x600?text=No+Image"
                    alt="No product"
                    className="gallery-main-img"
                  />
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="gallery-thumbnails">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className={`gallery-thumb ${activeImage === index ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${product.name} ${index + 1}`}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'; }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Product Info */}
          <Col lg={6} md={6}>
            <div className="product-info-detail">
              {/* Category & Bestseller */}
              <div className="product-meta-top">
                <Badge bg="light" text="dark" className="me-2 text-capitalize">
                  {product.category}
                </Badge>
                <Badge bg="light" text="dark" className="text-capitalize">
                  {product.subCategory}
                </Badge>
                {product.bestseller && (
                  <Badge bg="warning" text="dark" className="ms-2">
                    <FaStar className="me-1" /> Bestseller
                  </Badge>
                )}
              </div>

              {/* Product Name */}
              <h1 className="product-title-detail">{product.name}</h1>

              {/* Rating */}
              <div className="product-rating-detail mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < 4 ? 'star-on' : 'star-off'} />
                ))}
                <FaStarHalfAlt className="star-on ms-1" />
                <span className="rating-text ms-2">4.5 (128 reviews)</span>
              </div>

              {/* Price */}
              <div className="product-price-detail mb-3">
                <span className="current-price">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="currency-badge ms-2">{product.currency}</span>
              </div>

              {/* Stock Status */}
              <div className={`stock-status-detail mb-3 text-${stockStatus.color}`}>
                <StockIcon className="me-2" />
                <span className="fw-semibold">{stockStatus.text}</span>
              </div>

              {/* Description */}
              <p className="product-desc-detail">{product.description}</p>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="size-section mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Size:</h6>
                    <span className="text-primary fw-semibold">{selectedSize || 'Select'}</span>
                  </div>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                        disabled={product.countInStock === 0}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="quantity-section mb-4">
                <h6 className="mb-2">Quantity:</h6>
                <div className="quantity-control">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="qty-input"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.countInStock || 99}
                  />
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(quantity + 1, product.countInStock || 99))}
                    disabled={quantity >= (product.countInStock || 99)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons mb-4">
                <Button
                  variant={addedToCart ? 'success' : 'dark'}
                  size="lg"
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                >
                  {addedToCart ? (
                    <><FaCheck className="me-2" /> Added to Cart!</>
                  ) : (
                    <><FaShoppingCart className="me-2" /> Add to Cart</>
                  )}
                </Button>
                <Button
                  variant={isWishlisted ? 'danger' : 'outline-dark'}
                  className="wishlist-btn-detail"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </Button>
                <Button variant="outline-dark" className="share-btn-detail">
                  <FaShareAlt />
                </Button>
              </div>

              {/* Features */}
              <div className="product-features-detail">
                <div className="feature-item">
                  <FaTruck className="feature-icon" />
                  <div>
                    <strong>Free Shipping</strong>
                    <p>On orders over $50</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaUndo className="feature-icon" />
                  <div>
                    <strong>Easy Returns</strong>
                    <p>30-day return policy</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaShieldAlt className="feature-icon" />
                  <div>
                    <strong>Secure Checkout</strong>
                    <p>100% protected payment</p>
                  </div>
                </div>
              </div>

              {/* Continue Shopping */}
              <Button
                variant="outline-secondary"
                className="w-100 mt-3"
                onClick={() => navigate('/products')}
              >
                ← Continue Shopping
              </Button>
            </div>
          </Col>
        </Row>

        {/* Related Products Section Placeholder */}
        <div className="text-center mt-5 pt-4 border-top">
          <p className="text-muted mb-3">
            <FaBox className="me-2" />
            View more products in <Link to={`/products?category=${product.category}`} className="text-capitalize">{product.category}</Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;