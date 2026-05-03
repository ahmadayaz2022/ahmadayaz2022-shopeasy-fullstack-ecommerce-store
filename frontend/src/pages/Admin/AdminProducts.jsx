import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Image, Modal, Row, Col, Card ,Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productService } from '../../api/axios';
import { formatPrice, getCurrencySymbol } from '../../utils/currencyHelper';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaBox, FaDollarSign, FaTags } from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/50x50?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productService.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productService.delete(productToDelete._id);
      setProducts(products.filter(p => p._id !== productToDelete._id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  // Calculate stats
  const totalProducts = products.length;
  const bestsellers = products.filter(p => p.bestseller).length;
  const outOfStock = products.filter(p => p.countInStock === 0).length;
  
  // Calculate total inventory value in USD for display (or use most common currency)
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.countInStock), 0);
  
  // Get most common currency for stats display
  const getMostCommonCurrency = () => {
    if (products.length === 0) return 'USD';
    const currencyCounts = {};
    products.forEach(p => {
      const curr = p.currency || 'USD';
      currencyCounts[curr] = (currencyCounts[curr] || 0) + 1;
    });
    return Object.keys(currencyCounts).reduce((a, b) => 
      currencyCounts[a] > currencyCounts[b] ? a : b
    );
  };
  
  const displayCurrency = getMostCommonCurrency();

  if (loading) {
    return (
      <Container fluid className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading products...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="stats-card bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Total Products</h6>
                  <h2 className="mb-0">{totalProducts}</h2>
                </div>
                <FaBox size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Bestsellers</h6>
                  <h2 className="mb-0">{bestsellers}</h2>
                </div>
                <FaTags size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card bg-danger text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Out of Stock</h6>
                  <h2 className="mb-0">{outOfStock}</h2>
                </div>
                <FaBox size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card bg-warning text-dark">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Inventory Value</h6>
                  <h2 className="mb-0">{formatPrice(totalValue, displayCurrency)}</h2>
                </div>
                <FaDollarSign size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Header with Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Products Management</h2>
          <p className="text-muted mb-0">Manage your product inventory</p>
        </div>
        <Link to="/admin/products/add">
          <Button variant="warning" size="lg" className="add-product-btn shadow">
            <FaPlus className="me-2" /> Add New Product
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <Card className="text-center py-5 shadow-sm">
          <Card.Body>
            <FaBox size={64} className="text-muted mb-3" />
            <h4>No Products Yet</h4>
            <p className="text-muted">Start adding products to your store</p>
            <Link to="/admin/products/add">
              <Button variant="warning" size="lg">
                <FaPlus className="me-2" /> Add Your First Product
              </Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <Table striped bordered hover className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th className="text-center">Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Currency</th>
                <th>Stock</th>
                <th>Sizes</th>
                <th>Bestseller</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="text-center">
                    <Image
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      rounded
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                      }}
                    />
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    <br />
                    <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                  </td>
                  <td>
                    <span className="badge bg-secondary me-1">{product.category}</span>
                    <span className="badge bg-info">{product.subCategory}</span>
                  </td>
                  <td>
                    <strong>{formatPrice(product.price, product.currency)}</strong>
                  </td>
                  <td>
                    <Badge bg="light" text="dark">
                      {getCurrencySymbol(product.currency)} {product.currency}
                    </Badge>
                  </td>
                  <td>
                    {product.countInStock > 0 ? (
                      <span className="text-success fw-bold">{product.countInStock}</span>
                    ) : (
                      <span className="badge bg-danger">Out of Stock</span>
                    )}
                  </td>
                  <td>
                    {product.sizes?.map(size => (
                      <span key={size} className="badge bg-light text-dark me-1">{size}</span>
                    ))}
                  </td>
                  <td>
                    {product.bestseller ? (
                      <span className="badge bg-warning text-dark">⭐ Yes</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/products/edit/${product._id}`}>
                        <Button variant="outline-warning" size="sm" title="Edit Product">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteModal(true);
                        }}
                        title="Delete Product"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Floating Add Button (Mobile) */}
      <Link to="/admin/products/add" className="floating-add-btn d-md-none">
        <Button variant="warning" className="rounded-circle shadow-lg" size="lg">
          <FaPlus size={24} />
        </Button>
      </Link>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this product?</p>
          <Card className="p-3 bg-light">
            <div className="d-flex align-items-center">
              <Image
                src={getImageUrl(productToDelete?.images?.[0])}
                alt={productToDelete?.name}
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                rounded
                className="me-3"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                }}
              />
              <div>
                <h6 className="mb-0">{productToDelete?.name}</h6>
                <small className="text-muted">
                  {productToDelete && formatPrice(productToDelete.price, productToDelete.currency)}
                </small>
              </div>
            </div>
          </Card>
          <p className="text-danger mt-3 mb-0">
            <small>This action cannot be undone.</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FaTrash className="me-1" /> Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProducts;