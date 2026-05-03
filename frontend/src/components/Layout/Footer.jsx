import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaPinterest, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaShieldAlt,
  FaStar,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [openSection, setOpenSection] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      id: 'quick',
      title: 'Quick Links',
      links: [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Shop' },
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/cart', label: 'Cart' },
      ]
    },
    {
      id: 'categories',
      title: 'Categories',
      links: [
        { to: '/products?category=men', label: "Men's Fashion" },
        { to: '/products?category=women', label: "Women's Fashion" },
        { to: '/products?category=child', label: 'Kids Collection' },
        { to: '/products?bestseller=true', label: 'Best Sellers' },
        { to: '/products', label: 'New Arrivals' },
      ]
    },
    {
      id: 'help',
      title: 'Help & Info',
      links: [
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact' },
        { to: '/contact#faq', label: 'FAQ' },
        { to: '#', label: 'Shipping Policy' },
        { to: '#', label: 'Returns & Exchanges' },
        { to: '#', label: 'Privacy Policy' },
        { to: '#', label: 'Terms of Service' },
      ]
    },
  ];

  return (
    <footer className="main-footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-3 mb-lg-0 text-center text-lg-start">
              <h4 className="newsletter-title">
                <FaEnvelope className="me-2" />
                Subscribe to Our Newsletter
              </h4>
              <p className="newsletter-text mb-0">
                Get the latest updates on new products and upcoming sales
              </p>
            </Col>
            <Col lg={6}>
              <Form onSubmit={handleSubscribe}>
                <InputGroup className="newsletter-input-group">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="newsletter-input-footer"
                  />
                  <Button variant="warning" type="submit" className="subscribe-btn-footer">
                    Subscribe <FaArrowRight className="ms-2" />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main-content">
        <Container>
          <Row>
            {/* Company Info - Always visible */}
            <Col lg={4} md={6} className="mb-4">
              <div className="footer-brand">
                <FaStar className="text-warning me-2" />
                <span className="footer-brand-text">Shop</span>
                <span className="footer-brand-highlight">Easy</span>
              </div>
              <p className="footer-description">
                Your ultimate destination for trendy and affordable fashion. 
                We bring you the latest styles with quality you can trust.
              </p>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <FaMapMarkerAlt className="footer-contact-icon" />
                  <span>123 Fashion Street, New York, NY 10001</span>
                </div>
                <div className="footer-contact-item">
                  <FaPhone className="footer-contact-icon" />
                  <span>+1 (234) 567-890</span>
                </div>
                <div className="footer-contact-item">
                  <FaEnvelope className="footer-contact-icon" />
                  <span>support@shopeasy.com</span>
                </div>
              </div>
            </Col>

            {/* Desktop: Show all sections side by side */}
            {footerSections.map(section => (
              <Col lg={2} md={6} key={section.id} className="mb-4 d-none d-lg-block">
                <h5 className="footer-heading">{section.title}</h5>
                <ul className="footer-links">
                  {section.links.map((link, i) => (
                    <li key={i}><Link to={link.to}>{link.label}</Link></li>
                  ))}
                </ul>
              </Col>
            ))}

            {/* Mobile: Accordion sections */}
            <Col xs={12} className="d-lg-none">
              {footerSections.map(section => (
                <div key={section.id} className="footer-mobile-section">
                  <button 
                    className="footer-mobile-heading"
                    onClick={() => toggleSection(section.id)}
                  >
                    {section.title}
                    {openSection === section.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {openSection === section.id && (
                    <ul className="footer-links footer-links-mobile">
                      {section.links.map((link, i) => (
                        <li key={i}><Link to={link.to}>{link.label}</Link></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Col>

            {/* Social - Desktop */}
            <Col lg={2} md={6} className="mb-4 d-none d-lg-block">
              <h5 className="footer-heading">Follow Us</h5>
              <div className="footer-social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-link facebook">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-link twitter">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link instagram">
                  <FaInstagram />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-icon-link pinterest">
                  <FaPinterest />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-link youtube">
                  <FaYoutube />
                </a>
              </div>
            </Col>

            {/* Social - Mobile */}
            <Col xs={12} className="mb-4 d-lg-none">
              <h5 className="footer-heading text-center">Follow Us</h5>
              <div className="footer-social-icons justify-content-center">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-link facebook">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-link twitter">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link instagram">
                  <FaInstagram />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-icon-link pinterest">
                  <FaPinterest />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-link youtube">
                  <FaYoutube />
                </a>
              </div>
            </Col>
          </Row>

          {/* Payment Methods */}
          <div className="footer-payment-section">
            <Row className="align-items-center">
              <Col md={6} className="mb-3 mb-md-0 text-center text-md-start">
                <div className="footer-secure-badge">
                  <FaShieldAlt className="me-2 text-success" />
                  <span>100% Secure Payment</span>
                </div>
              </Col>
              <Col md={6} className="text-center text-md-end">
                <div className="footer-payment-icons">
                  <FaCcVisa className="payment-icon-footer" />
                  <FaCcMastercard className="payment-icon-footer" />
                  <FaCcAmex className="payment-icon-footer" />
                  <FaCcPaypal className="payment-icon-footer" />
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
              <p className="footer-copyright mb-0">
                &copy; {currentYear} <strong>ShopEasy</strong>. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="footer-bottom-links">
                <Link to="#">Privacy Policy</Link>
                <span className="footer-divider">|</span>
                <Link to="#">Terms of Service</Link>
                <span className="footer-divider">|</span>
                <Link to="#">Sitemap</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;