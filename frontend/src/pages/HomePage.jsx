import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productService } from '../api/axios';
import { formatPrice } from '../utils/currencyHelper';
import { 
  FaArrowRight, 
  FaStar, 
  FaTruck, 
  FaShieldAlt, 
  FaUndo, 
  FaTag, 
  FaHeart,
  FaFire,
  FaClock,
  FaGem,
} from 'react-icons/fa';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryImages, setCategoryImages] = useState({ men: null, women: null, child: null });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x600?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productService.getAll();
      
      const bestsellerItems = data.filter(p => p.bestseller === true);
      const regularItems = data.filter(p => p.bestseller !== true);
      
      bestsellerItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      regularItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setBestsellers(bestsellerItems);
      
      const prioritized = [...bestsellerItems, ...regularItems];
      setProducts(prioritized);
      
      getLatestProductsByCategory(prioritized);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLatestProductsByCategory = (allProducts) => {
    const categoryList = ['men', 'women', 'child'];
    const latest = {};
    categoryList.forEach(category => {
      const catProducts = allProducts.filter(p => p.category === category);
      if (catProducts.length > 0) {
        catProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        latest[category] = catProducts[0].images[0] || null;
      } else {
        latest[category] = null;
      }
    });
    setCategoryImages(latest);
  };

  const categories = [
    { 
      name: "Men's Fashion",
      image: categoryImages.men,
      link: '/products?category=men',
      fallback: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&h=500&fit=crop',
      desc: 'Suits, Casual, Sportswear',
    },
    { 
      name: "Women's Fashion",
      image: categoryImages.women,
      link: '/products?category=women',
      fallback: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=500&fit=crop',
      desc: 'Dresses, Tops, Accessories',
    },
    { 
      name: "Kids Collection",
      image: categoryImages.child,
      link: '/products?category=child',
      fallback: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&h=500&fit=crop',
      desc: 'Playful & Comfortable Wear',
    },
  ];

  const features = [
    { icon: FaTruck, title: 'Free Shipping', desc: 'On orders over $50', color: '#4CAF50' },
    { icon: FaShieldAlt, title: 'Secure Payment', desc: '100% protected', color: '#2196F3' },
    { icon: FaUndo, title: 'Easy Returns', desc: '30-day policy', color: '#FF9800' },
    { icon: FaClock, title: '24/7 Support', desc: 'Always here', color: '#9C27B0' },
    { icon: FaGem, title: 'Premium Quality', desc: 'Curated items', color: '#E91E63' },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="dark" />
        <p className="mt-3">Curating the best styles for you...</p>
      </div>
    );
  }

  return (
    <div className="homepage-v2">
      {/* Top Promo Bar */}
      <div className="promo-bar">
        <Container fluid>
          <div className="promo-content">
            <FaFire className="me-2" /> 
            Free Shipping on Orders Over PKR 3000 | Use Code: <strong>STYLE50</strong>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <section className="hero-carousel">
        <Container>
          <Row className="align-items-center hero-slide">
            <Col lg={6} className="hero-text-col">
              <Badge className="hero-badge mb-3">
                <FaStar className="me-1" /> TRENDING NOW
              </Badge>
              <h1 className="hero-main-title">
                Discover Your{' '}
                <span className="hero-highlight">Signature Style</span>
              </h1>
              <p className="hero-desc">
                Explore our curated collection of premium fashion. From timeless classics 
                to trending pieces, find everything that defines you.
              </p>
              <div className="hero-cta">
                <Link to="/products">
                  <Button className="cta-primary">
                    Shop Collection <FaArrowRight className="ms-2" />
                  </Button>
                </Link>
                <Link to="/products?bestseller=true">
                  <Button variant="outline-light" className="cta-secondary">
                    Best Sellers
                  </Button>
                </Link>
              </div>
              <div className="hero-metrics">
                <div className="metric">
                  <h3>{products.length}+</h3>
                  <p>Products</p>
                </div>
                <div className="metric-divider"></div>
                <div className="metric">
                  <h3>{bestsellers.length}</h3>
                  <p>Best Sellers</p>
                </div>
                <div className="metric-divider"></div>
                <div className="metric">
                  <h3>15k+</h3>
                  <p>Customers</p>
                </div>
              </div>
            </Col>
            <Col lg={6} className="hero-image-col">
              <div className="hero-image-grid">
                <div className="hero-main-image">
                  <img 
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=700&fit=crop"
                    alt="Fashion"
                  />
                </div>
                <div className="hero-secondary-image">
                  <img 
                    src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=350&h=400&fit=crop"
                    alt="Fashion"
                  />
                </div>
                <div className="hero-floating-card">
                  <div className="floating-card-content">
                    <FaFire className="text-danger" />
                    <h4>Hot Deal</h4>
                    <p>Up to 20% OFF</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <Container>
          <Row className="justify-content-center">
            {features.map((feature, i) => (
              <Col xs={6} sm={4} md={4} lg={true} key={i} className="mb-2 mb-lg-0">
                <div className="trust-item justify-content-center justify-content-lg-start">
                  <div className="trust-icon" style={{ color: feature.color }}>
                    <feature.icon />
                  </div>
                  <div className="trust-text d-none d-sm-block">
                    <h6>{feature.title}</h6>
                    <small>{feature.desc}</small>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Best Sellers */}
      {bestsellers.length > 0 && (
        <section className="bestsellers-section-v2">
          <Container>
            <div className="section-heading">
              <div>
                <Badge bg="warning" text="dark" className="section-badge">
                  <FaFire className="me-1" /> HOT PICKS
                </Badge>
                <h2>Best Sellers</h2>
                <p className="text-muted">Most loved by our customers</p>
              </div>
              <Link to="/products?bestseller=true" className="view-all-link">
                View All <FaArrowRight className="ms-1" />
              </Link>
            </div>
            <Row>
              {bestsellers.slice(0, 4).map(product => (
                <Col lg={3} md={4} sm={6} xs={6} key={product._id} className="mb-4">
                  <Link to={`/products/${product._id}`} className="text-decoration-none">
                    <Card className="product-card-v2">
                      <div className="product-image-v2">
                        <img src={getImageUrl(product.images[0])} alt={product.name} />
                        <span className="best-tag">BEST</span>
                        <button className="wish-btn" onClick={(e) => e.preventDefault()}><FaHeart /></button>
                      </div>
                      <Card.Body className="product-body-v2">
                        <small className="text-uppercase text-muted">{product.category}</small>
                        <h6 className="product-title-v2">{product.name}</h6>
                        <div className="stars-v2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="star-filled" />
                          ))}
                        </div>
                        <span className="price-v2">{formatPrice(product.price, product.currency)}</span>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Categories */}
      <section className="categories-section-v2">
        <Container>
          <div className="section-heading text-center mb-5">
            <Badge bg="dark" className="section-badge mb-2">BROWSE</Badge>
            <h2>Shop by Category</h2>
            <p className="text-muted">Find what suits you best</p>
          </div>
          <Row>
            {categories.map((cat, i) => (
              <Col lg={4} md={6} xs={12} key={i} className="mb-4">
                <Link to={cat.link} className="text-decoration-none">
                  <div className="category-card-v2">
                    <div className="cat-image-wrap">
                      <img 
                        src={getImageUrl(cat.image) || cat.fallback}
                        alt={cat.name}
                        onError={(e) => { e.target.src = cat.fallback; }}
                      />
                      <div className="cat-overlay"></div>
                    </div>
                    <div className="cat-info">
                      <h3>{cat.name}</h3>
                      <p>{cat.desc}</p>
                      <span className="cat-link">Shop Now →</span>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Trending Now */}
      <section className="products-section-v2">
        <Container>
          <div className="section-heading">
            <div>
              <Badge bg="dark" className="section-badge">
                <FaGem className="me-1" /> NEW DROPS
              </Badge>
              <h2>Trending Now</h2>
              <p className="text-muted">Fresh styles just landed</p>
            </div>
            <Link to="/products" className="view-all-link">
              View All <FaArrowRight className="ms-1" />
            </Link>
          </div>
          <Row>
            {products.slice(0, 8).map(product => (
              <Col lg={3} md={4} sm={6} xs={6} key={product._id} className="mb-4">
                <Link to={`/products/${product._id}`} className="text-decoration-none">
                  <Card className="product-card-v2">
                    <div className="product-image-v2">
                      <img 
                        src={getImageUrl(product.images[0])} 
                        alt={product.name}
                        loading="lazy"
                      />
                      {product.bestseller && <span className="best-tag">BEST</span>}
                      {product.countInStock <= 5 && product.countInStock > 0 && (
                        <span className="low-tag">LOW</span>
                      )}
                      {product.countInStock === 0 && <span className="sold-tag">SOLD OUT</span>}
                      <button className="wish-btn" onClick={(e) => e.preventDefault()}><FaHeart /></button>
                    </div>
                    <Card.Body className="product-body-v2">
                      <small className="text-uppercase text-muted">{product.category}</small>
                      <h6 className="product-title-v2">{product.name}</h6>
                      <div className="stars-v2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="star-filled" />
                        ))}
                      </div>
                      <span className="price-v2">{formatPrice(product.price, product.currency)}</span>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <Container>
          <Row className="align-items-center text-center text-lg-start">
            <Col lg={8}>
              <h2>Ready to Elevate Your Wardrobe?</h2>
              <p>Join thousands of satisfied customers. Shop the latest trends now.</p>
            </Col>
            <Col lg={4} className="mt-3 mt-lg-0 text-lg-end">
              <Link to="/products">
                <Button variant="light" size="lg" className="cta-btn">
                  Start Shopping <FaArrowRight className="ms-2" />
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;