import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, InputGroup, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../api/axios';
import { toast } from 'react-toastify';
import { FaDollarSign, FaPlus, FaTimes, FaImage, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
];

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    category: '',
    subCategory: '',
    newCategory: '',
    newSubCategory: '',
    sizes: [],
    bestseller: false,
    countInStock: 0
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showNewSubCategoryModal, setShowNewSubCategoryModal] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      if (!token) return;
      const { data } = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await productService.getSingle(id);
      console.log('Fetched product:', data);
      
      setFormData(prev => ({
        ...prev,
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        currency: data.currency || 'USD',
        category: data.category || '',
        subCategory: data.subCategory || '',
        sizes: data.sizes || [],
        bestseller: data.bestseller || false,
        countInStock: data.countInStock || 0
      }));
      setExistingImages(data.images || []);
      
      // Set subcategories based on product's category
      const cat = categories.find(c => c.name === data.category);
      if (cat) setSubCategories(cat.subCategories || []);
      
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
      navigate('/admin/products');
    } finally {
      setFetching(false);
    }
  };

  const handleCategorySelect = (categoryName) => {
    if (!categoryName) {
      setSubCategories([]);
      setFormData(prev => ({ ...prev, category: '', subCategory: '' }));
      return;
    }
    const selectedCat = categories.find(c => c.name === categoryName);
    setFormData(prev => ({ ...prev, category: categoryName, subCategory: '' }));
    if (selectedCat) setSubCategories(selectedCat.subCategories || []);
    else setSubCategories([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'category') {
      handleCategorySelect(value);
    } else if (name === 'countInStock') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length - removedImages.length + images.length;
    
    if (totalImages + files.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const handleRemoveNewImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]?.preview);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleRemoveExistingImage = (index) => {
    setRemovedImages(prev => [...prev, index]);
  };

  const handleRestoreExistingImage = (index) => {
    setRemovedImages(prev => prev.filter(i => i !== index));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/80?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
  };

  // Add new category
  const handleAddCategory = async () => {
    const newCatName = formData.newCategory.trim();
    if (!newCatName) { toast.error('Please enter a category name'); return; }
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.post(`${API_URL}/categories`, 
        { name: newCatName.toLowerCase(), subCategories: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Category "${newCatName}" added!`);
      await fetchCategories();
      handleCategorySelect(data.name);
      setFormData(prev => ({ ...prev, newCategory: '' }));
      setShowNewCategoryModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    }
  };

  // Add new subcategory
  const handleAddSubCategory = async () => {
    const newSubName = formData.newSubCategory.trim();
    if (!newSubName) { toast.error('Please enter a subcategory name'); return; }
    if (!formData.category) { toast.error('Please select a category first'); return; }
    const selectedCat = categories.find(c => c.name === formData.category);
    if (!selectedCat) { toast.error('Selected category not found'); return; }
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.post(
        `${API_URL}/categories/${selectedCat._id}/subcategory`,
        { subCategory: newSubName.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Subcategory "${newSubName}" added!`);
      await fetchCategories();
      setSubCategories(data.subCategories || []);
      setFormData(prev => ({ ...prev, subCategory: newSubName.toLowerCase(), newSubCategory: '' }));
      setShowNewSubCategoryModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add subcategory');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.subCategory) newErrors.subCategory = 'Please select a sub category';
    if (formData.sizes.length === 0) newErrors.sizes = 'Select at least one size';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('category', formData.category.toLowerCase());
      formDataToSend.append('subCategory', formData.subCategory.toLowerCase());
      formDataToSend.append('sizes', JSON.stringify(formData.sizes));
      formDataToSend.append('bestseller', formData.bestseller);
      formDataToSend.append('countInStock', formData.countInStock || 0);
      formDataToSend.append('removedImages', JSON.stringify(removedImages));

      // Append new images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      console.log('Updating product - FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await productService.update(id, formDataToSend);
      console.log('Update response:', response.data);
      
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading product...</p>
      </div>
    );
  }

  const visibleExistingImages = existingImages.filter((_, i) => !removedImages.includes(i));
  const totalImages = visibleExistingImages.length + images.length;

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Edit Product</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="Product name"
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                    placeholder="Product description"
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price *</Form.Label>
                      <InputGroup>
                        <InputGroup.Text><FaDollarSign /></InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          isInvalid={!!errors.price}
                          placeholder="0.00"
                        />
                        <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Currency</Form.Label>
                      <Form.Select name="currency" value={formData.currency} onChange={handleChange}>
                        {currencies.map(curr => (
                          <option key={curr.code} value={curr.code}>
                            {curr.flag} {curr.code} - {curr.symbol} ({curr.name})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        name="countInStock"
                        value={formData.countInStock}
                        onChange={handleChange}
                      />
                      <Form.Text className="text-muted">Available units: {formData.countInStock}</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <InputGroup>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          isInvalid={!!errors.category}
                        >
                          <option value="">-- Select Category --</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>
                              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                            </option>
                          ))}
                        </Form.Select>
                        <Button variant="outline-primary" onClick={() => setShowNewCategoryModal(true)} title="Add new category">
                          <FaPlus />
                        </Button>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sub Category *</Form.Label>
                      <InputGroup>
                        <Form.Select
                          name="subCategory"
                          value={formData.subCategory}
                          onChange={handleChange}
                          isInvalid={!!errors.subCategory}
                          disabled={!formData.category || subCategories.length === 0}
                        >
                          <option value="">-- Select Sub Category --</option>
                          {subCategories.map((sub, i) => (
                            <option key={i} value={sub}>
                              {sub.charAt(0).toUpperCase() + sub.slice(1)}
                            </option>
                          ))}
                        </Form.Select>
                        <Button variant="outline-primary" onClick={() => setShowNewSubCategoryModal(true)} disabled={!formData.category} title="Add new subcategory">
                          <FaPlus />
                        </Button>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{errors.subCategory}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Sizes *</Form.Label>
                  <div className="d-flex gap-3 flex-wrap">
                    {sizeOptions.map(size => (
                      <Form.Check
                        key={size}
                        type="checkbox"
                        id={`edit-size-${size}`}
                        label={size}
                        checked={formData.sizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        isInvalid={!!errors.sizes}
                      />
                    ))}
                  </div>
                  {errors.sizes && <small className="text-danger">{errors.sizes}</small>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Mark as Bestseller"
                    name="bestseller"
                    checked={formData.bestseller}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Image Section */}
              <Col md={5}>
                <Card className="image-upload-card">
                  <Card.Body>
                    <h5 className="mb-3"><FaImage className="me-2" />Product Images</h5>
                    
                    {/* Upload Button */}
                    {totalImages < 4 && (
                      <div className="image-upload-area mb-3">
                        <Form.Label htmlFor="edit-image-upload" className="upload-label">
                          <div className="upload-content">
                            <FaImage size={30} className="text-muted mb-2" />
                            <p className="mb-0 fw-bold">Add Images</p>
                            <p className="text-muted small mb-0">{totalImages}/4 used</p>
                          </div>
                        </Form.Label>
                        <Form.Control
                          id="edit-image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="d-none"
                        />
                      </div>
                    )}

                    {/* Existing Images */}
                    {visibleExistingImages.length > 0 && (
                      <div className="mb-3">
                        <small className="fw-bold">Current Images:</small>
                        <div className="image-previews-grid">
                          {existingImages.map((img, index) => (
                            !removedImages.includes(index) && (
                              <div key={index} className="image-preview-item">
                                <img src={getImageUrl(img)} alt={`Existing ${index + 1}`} className="preview-image" />
                                <button type="button" className="remove-image-btn" onClick={() => handleRemoveExistingImage(index)} title="Mark for removal">
                                  <FaTimes />
                                </button>
                                {index === 0 && <span className="main-image-badge">Main</span>}
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Removed Images (can restore) */}
                    {removedImages.length > 0 && (
                      <div className="mb-3">
                        <small className="fw-bold text-danger">Will be removed:</small>
                        <div className="image-previews-grid">
                          {existingImages.map((img, index) => (
                            removedImages.includes(index) && (
                              <div key={index} className="image-preview-item removed">
                                <img src={getImageUrl(img)} alt={`Removed ${index + 1}`} className="preview-image" />
                                <button type="button" className="restore-image-btn" onClick={() => handleRestoreExistingImage(index)} title="Restore">
                                  <FaTimes />
                                </button>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mb-3">
                        <small className="fw-bold text-success">New Images:</small>
                        <div className="image-previews-grid">
                          {imagePreviews.map((img, index) => (
                            <div key={index} className="image-preview-item new">
                              <img src={img.preview} alt={`New ${index + 1}`} className="preview-image" />
                              <button type="button" className="remove-image-btn" onClick={() => handleRemoveNewImage(index)} title="Remove">
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {totalImages === 0 && (
                      <div className="no-images-placeholder text-center p-4">
                        <FaImage size={40} className="text-muted mb-2" />
                        <p className="text-muted mb-0">No images</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <hr />
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading} size="lg">
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</>
                ) : 'Update Product'}
              </Button>
              <Button variant="outline-secondary" size="lg" onClick={() => navigate('/admin/products')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Add New Category Modal */}
      <Modal show={showNewCategoryModal} onHide={() => setShowNewCategoryModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add New Category</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., accessories, shoes"
              value={formData.newCategory}
              onChange={(e) => setFormData(prev => ({ ...prev, newCategory: e.target.value }))}
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }}}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewCategoryModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddCategory}>Add Category</Button>
        </Modal.Footer>
      </Modal>

      {/* Add New SubCategory Modal */}
      <Modal show={showNewSubCategoryModal} onHide={() => setShowNewSubCategoryModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add New Sub Category</Modal.Title></Modal.Header>
        <Modal.Body>
          <p>Adding to: <strong>{formData.category}</strong></p>
          <Form.Group>
            <Form.Label>Sub Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., jackets, jeans"
              value={formData.newSubCategory}
              onChange={(e) => setFormData(prev => ({ ...prev, newSubCategory: e.target.value }))}
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubCategory(); }}}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewSubCategoryModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddSubCategory}>Add Sub Category</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminEditProduct;