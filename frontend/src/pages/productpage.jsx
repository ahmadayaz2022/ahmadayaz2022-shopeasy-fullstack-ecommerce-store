import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currencyHelper';
import { FaSearch, FaStar, FaHeart, FaTimes, FaPlus, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [subCategory, setSubCategory] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, isAdmin } = useAuth();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const bestsellerParam = searchParams.get('bestseller');
    
    if (categoryParam) setCategory(categoryParam);
    
    fetchCategories();
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, category, subCategory, sortBy]);

  useEffect(() => {
    if (category !== 'all') {
      const cat = categories.find(c => c.name === category);
      setSubCategories(cat?.subCategories || []);
    } else {
      setSubCategories([]);
    }
    setSubCategory('all');
  }, [category, categories]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await productService.getAll();
      
      const sortedProducts = data.sort((a, b) => {
        if (a.bestseller && !b.bestseller) return -1;
        if (!a.bestseller && b.bestseller) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (subCategory !== 'all') {
      filtered = filtered.filter(p => p.subCategory === subCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'priority':
        filtered.sort((a, b) => {
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setSubCategory('all');
    setSortBy('priority');
  };

  const hasActiveFilters = searchTerm || category !== 'all' || subCategory !== 'all';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-dark" role="status" />
        <p className="mt-3 text-muted">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-page-v2">
      {/* Page Header */}
      <section className="product-page-header">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="page-title">Our Collection</h1>
              <div className="breadcrumb-row">
                <Link to="/" className="breadcrumb-link">Home</Link>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">Products</span>
                {category !== 'all' && (
                  <>
                    <span className="breadcrumb-sep">/</span>
                    <span className="breadcrumb-current text-capitalize">{category}</span>
                  </>
                )}
              </div>
            </Col>
            {user && isAdmin() && (
              <Col xs="auto">
                <Link to="/admin/products/add">
                  <Button variant="warning" className="add-product-btn-header">
                    <FaPlus className="me-2" /> Add Product
                  </Button>
                </Link>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <Container className="py-4">
        {/* Filter Bar */}
        <div className="filter-bar-v2">
          <Row className="align-items-center g-3">
            {/* Search */}
            <Col lg={4} md={12}>
              <div className="search-input-wrapper">
                <FaSearch className="search-icon-inside" />
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-v2"
                />
                {searchTerm && (
                  <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </Col>

            {/* Category */}
            <Col lg={2} md={4} sm={6}>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="filter-select-v2"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Sub Category */}
            <Col lg={2} md={4} sm={6}>
              <Form.Select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="filter-select-v2"
                disabled={category === 'all' || subCategories.length === 0}
              >
                <option value="all">All Sub Categories</option>
                {subCategories.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Sort */}
            <Col lg={2} md={4} sm={6}>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select-v2"
              >
                <option value="priority">🌟 Best Match</option>
                <option value="newest">🆕 Newest</option>
                <option value="price-low">💰 Price: Low-High</option>
                <option value="price-high">💎 Price: High-Low</option>
                <option value="name-asc">🔤 Name A-Z</option>
              </Form.Select>
            </Col>

            {/* Clear / Count */}
            <Col lg={2} className="text-end d-none d-lg-block">
              {hasActiveFilters && (
                <Button variant="outline-dark" size="sm" onClick={clearFilters} className="clear-btn-v2">
                  <FaTimes className="me-1" /> Clear All
                </Button>
              )}
              <span className="results-count">
                {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </Col>
          </Row>
        </div>

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="active-tags">
            {category !== 'all' && (
              <span className="filter-tag">
                🏷️ {category}
                <FaTimes className="tag-close" onClick={() => setCategory('all')} />
              </span>
            )}
            {subCategory !== 'all' && (
              <span className="filter-tag">
                📌 {subCategory}
                <FaTimes className="tag-close" onClick={() => setSubCategory('all')} />
              </span>
            )}
            {searchTerm && (
              <span className="filter-tag">
                🔍 "{searchTerm}"
                <FaTimes className="tag-close" onClick={() => setSearchTerm('')} />
              </span>
            )}
            <span className="filter-tag results-tag">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-results">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p className="text-muted">Try different keywords or remove filters</p>
            <Button variant="outline-dark" onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <Row>
            {filteredProducts.map((product) => (
              <Col lg={3} md={4} sm={6} xs={6} key={product._id} className="mb-4">
                <Link to={`/products/${product._id}`} className="text-decoration-none">
                  <Card className="product-card-v2">
                    <div className="product-image-v2">
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
                      />
                      <button className="wish-btn" onClick={(e) => e.preventDefault()}>
                        <FaHeart />
                      </button>
                      
                      {/* Badges */}
                      <div className="product-badges-v2">
                        {product.bestseller && (
                          <span className="badge-best">
                            <FaStar className="me-1" /> Best
                          </span>
                        )}
                        {product.countInStock === 0 && (
                          <span className="badge-sold">Sold Out</span>
                        )}
                        {product.countInStock > 0 && product.countInStock <= 5 && (
                          <span className="badge-low">Only {product.countInStock}</span>
                        )}
                        {!product.bestseller && product.countInStock > 5 && 
                          product.createdAt && (new Date() - new Date(product.createdAt)) < 7 * 24 * 3600 * 1000 && (
                          <span className="badge-new">New</span>
                        )}
                      </div>
                    </div>
                    
                    <Card.Body className="product-body-v2">
                      <span className="product-cat-label">{product.category}</span>
                      <h6 className="product-name-v2" title={product.name}>{product.name}</h6>
                      
                      <div className="product-rating-v2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < 4 ? 'star-on' : 'star-off'} />
                        ))}
                        <small className="rating-num">4.0</small>
                      </div>
                      
                      <div className="product-bottom-row">
                        <span className="product-price-v2">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="size-badges">
                            {product.sizes.slice(0, 3).map(size => (
                              <span key={size} className="sz">{size}</span>
                            ))}
                            {product.sizes.length > 3 && (
                              <span className="sz">+{product.sizes.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {product.countInStock > 0 ? (
                        <div className="stock-row">
                          <span className="stock-dot green"></span>
                          <small className="text-success">In Stock</small>
                        </div>
                      ) : (
                        <div className="stock-row">
                          <span className="stock-dot red"></span>
                          <small className="text-danger">Out of Stock</small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}

        {/* Bottom */}
        {filteredProducts.length > 0 && (
          <div className="results-bottom">
            <p>Showing {filteredProducts.length} of {products.length} products</p>
            {user && isAdmin() && (
              <Link to="/admin/products/add">
                <Button variant="outline-warning" size="sm">
                  <FaPlus className="me-1" /> Add New Product
                </Button>
              </Link>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductPage;