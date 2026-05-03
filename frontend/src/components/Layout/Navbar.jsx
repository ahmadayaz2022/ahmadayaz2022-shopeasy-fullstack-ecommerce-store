import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  Navbar as BootstrapNavbar, 
  Nav, 
  Container, 
  Badge, 
  NavDropdown,
  Offcanvas
} from 'react-bootstrap';
import { 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt, 
  FaCog, 
  FaHeart,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
  FaHome,
  FaBox,
  FaStar,
  FaBars,
  FaTimes,
  FaUsers,
  FaBullseye
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleNavClick = () => {
    handleClose();
  };

  return (
    <BootstrapNavbar 
      bg="dark" 
      variant="dark" 
      fixed="top" 
      className="main-navbar"
    >
      <Container>
        {/* Brand Logo */}
        <BootstrapNavbar.Brand as={Link} to="/" className="brand-logo" onClick={handleClose}>
          <FaStar className="me-2 text-warning" />
          <span className="brand-text">Shop</span>
          <span className="brand-highlight">Easy</span>
        </BootstrapNavbar.Brand>

        {/* Desktop Navigation - Hidden on mobile */}
        <Nav className="desktop-nav me-auto">
          <Nav.Link as={Link} to="/" className="nav-link-custom">
            <FaHome className="nav-icon" /> Home
          </Nav.Link>
          
          <Nav.Link as={Link} to="/products" className="nav-link-custom">
            <FaBox className="nav-icon" /> Products
          </Nav.Link>

          <NavDropdown 
            title={<span><FaInfoCircle className="nav-icon" /> About</span>} 
            id="about-dropdown"
            className="nav-link-custom"
          >
            <NavDropdown.Item as={Link} to="/about" onClick={handleClose}>Our Story</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/about" onClick={handleClose}>Our Team</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/about" onClick={handleClose}>Mission & Vision</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown 
            title={<span><FaEnvelope className="nav-icon" /> Contact</span>} 
            id="contact-dropdown"
            className="nav-link-custom"
          >
            <NavDropdown.Item as={Link} to="/contact" onClick={handleClose}>Send Message</NavDropdown.Item>
            <NavDropdown.Item as="a" href="tel:+1234567890">Call Us</NavDropdown.Item>
            <NavDropdown.Item as="a" href="mailto:support@shopeasy.com">Email</NavDropdown.Item>
          </NavDropdown>
        </Nav>

        {/* Desktop Right Side */}
        <div className="desktop-right-nav">
          {user ? (
            <>
              <Link to="/cart" className="nav-icon-link position-relative me-3">
                <FaShoppingCart />
                {getCartCount() > 0 && (
                  <Badge bg="danger" pill className="cart-badge-icon">
                    {getCartCount()}
                  </Badge>
                )}
              </Link>
              
              {isAdmin() ? (
                <Link to="/admin" className="nav-icon-link me-3" title="Admin Panel">
                  <FaCog />
                </Link>
              ) : (
                <Link to="/orders" className="nav-icon-link me-3" title="My Orders">
                  <FaUser />
                </Link>
              )}
              
              <button onClick={handleLogout} className="nav-icon-link btn-logout" title="Logout">
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="nav-link-custom">Login</Link>
              <Link to="/register" className="register-link">Register</Link>
            </div>
          )}
        </div>

        {/* Hamburger Button - Always visible */}
        <button 
          className="hamburger-btn"
          onClick={handleShow}
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>
      </Container>

      {/* Offcanvas Sidebar for ALL screens */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={handleClose} 
        placement="end"
        className="nav-offcanvas"
      >
        <Offcanvas.Header className="offcanvas-header-custom">
          <Offcanvas.Title>
            <FaStar className="text-warning me-2" />
            <span className="text-white">Shop</span>
            <span className="text-warning">Easy</span>
          </Offcanvas.Title>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </Offcanvas.Header>
        
        <Offcanvas.Body>
          {/* User Info */}
          {user && (
            <div className="offcanvas-user-info">
              <div className="user-avatar-large">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h6 className="text-white mb-0">{user.name}</h6>
                <small className="text-warning">
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </small>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <Nav className="offcanvas-nav flex-column">
            <div className="nav-section-title">MAIN</div>
            <Nav.Link as={Link} to="/" onClick={handleNavClick} className="offcanvas-nav-link">
              <FaHome className="me-3" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" onClick={handleNavClick} className="offcanvas-nav-link">
              <FaBox className="me-3" /> Products
            </Nav.Link>

            <hr className="nav-divider" />

            <div className="nav-section-title">ABOUT</div>
            <Nav.Link as={Link} to="/about" onClick={handleNavClick} className="offcanvas-nav-link">
              <FaInfoCircle className="me-3" /> About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={handleNavClick} className="offcanvas-nav-link">
              <FaUsers className="me-3" /> Our Team
            </Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={handleNavClick} className="offcanvas-nav-link">
              <FaBullseye className="me-3" /> Mission & Vision
            </Nav.Link>

            <hr className="nav-divider" />

            <div className="nav-section-title">SUPPORT</div>
            <Nav.Link as={Link} to="/contact" onClick={handleNavClick} className="offcanvas-nav-link">
              <FaEnvelope className="me-3" /> Contact Us
            </Nav.Link>
            <Nav.Link as="a" href="tel:+923437037408" className="offcanvas-nav-link">
              <FaPhone className="me-3" /> Call Us
            </Nav.Link>
            <Nav.Link as="a" href="mailto:support@shopeasy.com" className="offcanvas-nav-link">
              <FaEnvelope className="me-3" /> Email Support
            </Nav.Link>

            <hr className="nav-divider" />

            {user ? (
              <>
                <div className="nav-section-title">ACCOUNT</div>
                <Nav.Link as={Link} to="/cart" onClick={handleNavClick} className="offcanvas-nav-link">
                  <FaShoppingCart className="me-3" /> My Cart
                  {getCartCount() > 0 && (
                    <Badge bg="danger" pill className="ms-2">{getCartCount()}</Badge>
                  )}
                </Nav.Link>
                
                {isAdmin() ? (
                  <Nav.Link as={Link} to="/admin" onClick={handleNavClick} className="offcanvas-nav-link">
                    <FaCog className="me-3" /> Admin Panel
                  </Nav.Link>
                ) : (
                  <Nav.Link as={Link} to="/orders" onClick={handleNavClick} className="offcanvas-nav-link">
                    <FaBox className="me-3" /> My Orders
                  </Nav.Link>
                )}
                
                <Nav.Link as={Link} to="/wishlist" onClick={handleNavClick} className="offcanvas-nav-link">
                  <FaHeart className="me-3" /> Wishlist
                </Nav.Link>

                <hr className="nav-divider" />
                
                <Nav.Link onClick={handleLogout} className="offcanvas-nav-link text-danger">
                  <FaSignOutAlt className="me-3" /> Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <div className="nav-section-title">ACCOUNT</div>
                <Nav.Link as={Link} to="/login" onClick={handleNavClick} className="offcanvas-nav-link">
                  <FaUser className="me-3" /> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={handleNavClick} className="offcanvas-nav-link register-offcanvas">
                  <FaUser className="me-3" /> Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </BootstrapNavbar>
  );
};

export default Navbar;