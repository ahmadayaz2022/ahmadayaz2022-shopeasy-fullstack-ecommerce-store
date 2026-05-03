import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaUserShield, 
  FaUser, 
  FaUserPlus,
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaEnvelope,
  FaCalendarAlt,
  FaTimes
} from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'customer' });
  const [stats, setStats] = useState({ totalUsers: 0, adminUsers: 0, customerUsers: 0, newUsersThisMonth: 0 });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.get(`${API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmEdit = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await axios.put(`${API_URL}/users/${selectedUser._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User updated successfully');
      fetchUsers();
      fetchStats();
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const confirmDelete = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await axios.delete(`${API_URL}/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      fetchUsers();
      fetchStats();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container fluid className="py-4 text-center">
        <Spinner animation="border" variant="dark" />
        <p className="mt-3 text-muted">Loading users...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Users Management</h2>
          <p className="text-muted mb-0">Manage all registered users</p>
        </div>
        <Button variant="outline-dark" onClick={() => { fetchUsers(); fetchStats(); }}>
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3} sm={6}>
          <Card className="stats-card bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 opacity-75">Total Users</h6>
                  <h2 className="mb-0">{stats.totalUsers}</h2>
                </div>
                <FaUsers size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stats-card bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 opacity-75">Admin Users</h6>
                  <h2 className="mb-0">{stats.adminUsers}</h2>
                </div>
                <FaUserShield size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stats-card bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 opacity-75">Customers</h6>
                  <h2 className="mb-0">{stats.customerUsers}</h2>
                </div>
                <FaUser size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stats-card bg-warning text-dark">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 opacity-75">New This Month</h6>
                  <h2 className="mb-0">{stats.newUsersThisMonth}</h2>
                </div>
                <FaUserPlus size={40} className="opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <div className="filter-bar-v2 mb-4">
        <Row className="align-items-center">
          <Col md={4}>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon-inside" />
              <Form.Control
                type="text"
                placeholder="Search users by name, email or role..."
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
          <Col md={8} className="text-end">
            <span className="results-count">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </span>
          </Col>
        </Row>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <FaSearch size={48} className="text-muted mb-3" />
            <h5>No users found</h5>
            <p className="text-muted">Try adjusting your search</p>
          </Card.Body>
        </Card>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <Table striped hover className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="user-avatar-sm me-2">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>
                    <FaEnvelope className="text-muted me-2" size={12} />
                    {user.email}
                  </td>
                  <td>
                    {user.role === 'admin' ? (
                      <Badge bg="warning" text="dark">
                        <FaUserShield className="me-1" /> Admin
                      </Badge>
                    ) : (
                      <Badge bg="info">
                        <FaUser className="me-1" /> Customer
                      </Badge>
                    )}
                  </td>
                  <td>
                    <FaCalendarAlt className="text-muted me-2" size={12} />
                    <small>{new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</small>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        title="Edit User"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        title="Delete User"
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

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
          <Card className="p-3 bg-light">
            <p className="mb-1"><strong>Name:</strong> {selectedUser?.name}</p>
            <p className="mb-1"><strong>Email:</strong> {selectedUser?.email}</p>
            <p className="mb-0"><strong>Role:</strong> {selectedUser?.role}</p>
          </Card>
          <p className="text-danger mt-3 mb-0">
            <small>This action cannot be undone.</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <FaTrash className="me-1" /> Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUsers;