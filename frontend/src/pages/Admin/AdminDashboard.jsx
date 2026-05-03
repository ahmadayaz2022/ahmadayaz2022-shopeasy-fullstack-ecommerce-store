import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      
      // Fetch products
      const productsRes = await axios.get(`${API_URL}/products`);
      
      // Fetch orders
      const ordersRes = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch user stats
      const usersRes = await axios.get(`${API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Calculate revenue
      const revenue = ordersRes.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalUsers: usersRes.data.totalUsers || 0,
        totalRevenue: revenue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const dashboardStats = [
    { 
      title: 'Products', 
      icon: FaBox, 
      link: '/admin/products', 
      color: 'primary',
      value: stats.totalProducts,
      valueColor: '#0d6efd'
    },
    { 
      title: 'Orders', 
      icon: FaShoppingCart, 
      link: '/admin/orders', 
      color: 'success',
      value: stats.totalOrders,
      valueColor: '#198754'
    },
    { 
      title: 'Users', 
      icon: FaUsers, 
      link: '/admin/users', 
      color: 'info',
      value: stats.totalUsers,
      valueColor: '#0dcaf0'
    },
    { 
      title: 'Revenue', 
      icon: FaDollarSign, 
      color: 'warning',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      valueColor: '#ffc107',
      link: null
    },
  ];

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row>
        {dashboardStats.map((stat, index) => (
          <Col md={3} key={index} className="mb-3">
            {stat.link ? (
              <Link to={stat.link} className="text-decoration-none">
                <Card className="dashboard-stat-card h-100">
                  <Card.Body className="text-center">
                    <stat.icon size={48} className={`text-${stat.color} mb-3`} />
                    <h5>{stat.title}</h5>
                    <h3 style={{ color: stat.valueColor }}>{stat.value}</h3>
                  </Card.Body>
                </Card>
              </Link>
            ) : (
              <Card className="dashboard-stat-card h-100">
                <Card.Body className="text-center">
                  <stat.icon size={48} className={`text-${stat.color} mb-3`} />
                  <h5>{stat.title}</h5>
                  <h3 style={{ color: stat.valueColor }}>{stat.value}</h3>
                </Card.Body>
              </Card>
            )}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;