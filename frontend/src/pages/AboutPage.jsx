import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaBullseye, 
  FaHeart, 
  FaStar,
  FaEye,
  FaRocket,
  FaHandshake,
  FaLeaf,
  FaArrowRight,
  FaQuoteLeft,
  FaCheck,
  FaGlobe,
  FaTruck,
  FaShieldAlt
} from 'react-icons/fa';

const AboutPage = () => {
  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: FaUsers },
    { number: '5K+', label: 'Products', icon: FaStar },
    { number: '20+', label: 'Countries', icon: FaGlobe },
    { number: '99%', label: 'Satisfaction', icon: FaHeart },
  ];

  const values = [
    {
      icon: FaHeart,
      title: 'Customer First',
      description: 'Everything we do starts and ends with our customers\' happiness. Your satisfaction is our success.',
      color: '#e74c3c'
    },
    {
      icon: FaStar,
      title: 'Quality Excellence',
      description: 'We never compromise on quality. Every product undergoes rigorous quality checks.',
      color: '#f39c12'
    },
    {
      icon: FaHandshake,
      title: 'Integrity',
      description: 'Honesty and transparency guide every decision we make. We build trust through actions.',
      color: '#2ecc71'
    },
    {
      icon: FaLeaf,
      title: 'Sustainability',
      description: 'Committed to reducing our environmental footprint and promoting ethical fashion.',
      color: '#27ae60'
    },
    {
      icon: FaRocket,
      title: 'Innovation',
      description: 'Constantly evolving our platform to provide the best shopping experience.',
      color: '#3498db'
    },
    {
      icon: FaShieldAlt,
      title: 'Trust & Security',
      description: 'Your data and transactions are protected with industry-leading security measures.',
      color: '#9b59b6'
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <span className="hero-label">WHO WE ARE</span>
              <h1 className="about-title">About ShopEasy</h1>
              <p className="about-subtitle">
                Your trusted destination for fashion and lifestyle — where style meets affordability
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Bar */}
      <section className="about-stats">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col md={3} xs={6} key={index} className="text-center py-4">
                <stat.icon className="stat-icon" />
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <span className="section-label">OUR JOURNEY</span>
              <h2 className="section-title-lg">Our Story</h2>
              <p className="lead-text">
                Founded in 2024, ShopEasy has grown from a small online store to one of the most trusted fashion destinations worldwide.
              </p>
              <p className="body-text">
                What started as a passion project in a small garage has blossomed into a global community of fashion enthusiasts. We believe that everyone deserves access to quality fashion at affordable prices.
              </p>
              <p className="body-text">
                Our team works tirelessly to curate the best collections from around the world, ensuring every piece meets our high standards of quality and style. With thousands of happy customers and counting, we continue to expand while staying true to our core values.
              </p>
              <div className="story-highlights">
                <div className="highlight-item">
                  <FaCheck className="highlight-check" />
                  <span>Curated collections from global brands</span>
                </div>
                <div className="highlight-item">
                  <FaCheck className="highlight-check" />
                  <span>Quality guaranteed on every product</span>
                </div>
                <div className="highlight-item">
                  <FaCheck className="highlight-check" />
                  <span>Fast and reliable worldwide shipping</span>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="story-images">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=350&fit=crop" 
                  alt="Our Story"
                  className="story-img-main rounded-4 shadow"
                />
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=250&fit=crop" 
                  alt="Our Team"
                  className="story-img-secondary rounded-4 shadow"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="bg-light py-5">
        <Container>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="mv-card h-100">
                <Card.Body>
                  <div className="mv-icon-wrapper bg-primary-light">
                    <FaBullseye className="mv-icon text-primary" />
                  </div>
                  <h3 className="mv-title">Our Mission</h3>
                  <p className="mv-text">
                    To provide high-quality, affordable fashion to everyone, everywhere. 
                    We strive to create a seamless shopping experience that empowers 
                    individuals to express their unique style with confidence.
                  </p>
                  <ul className="mv-list">
                    <li><FaCheck className="text-success me-2" /> Curate premium collections</li>
                    <li><FaCheck className="text-success me-2" /> Ensure affordable pricing</li>
                    <li><FaCheck className="text-success me-2" /> Deliver exceptional service</li>
                    <li><FaCheck className="text-success me-2" /> Build a global community</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="mv-card h-100">
                <Card.Body>
                  <div className="mv-icon-wrapper bg-warning-light">
                    <FaEye className="mv-icon text-warning" />
                  </div>
                  <h3 className="mv-title">Our Vision</h3>
                  <p className="mv-text">
                    To become the world's most loved fashion destination, where style 
                    meets accessibility. We envision a future where everyone can discover 
                    and express their personal style without barriers.
                  </p>
                  <ul className="mv-list">
                    <li><FaCheck className="text-success me-2" /> Serve 100+ countries by 2026</li>
                    <li><FaCheck className="text-success me-2" /> AI-powered personalization</li>
                    <li><FaCheck className="text-success me-2" /> 100% sustainable by 2028</li>
                    <li><FaCheck className="text-success me-2" /> Pioneer fashion innovation</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="section-label">WHAT WE STAND FOR</span>
            <h2 className="section-title-lg">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          <Row>
            {values.map((value, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <Card className="value-card-new h-100">
                  <Card.Body>
                    <div className="value-icon-circle" style={{ backgroundColor: `${value.color}15` }}>
                      <value.icon style={{ color: value.color, fontSize: '1.5rem' }} />
                    </div>
                    <h4 className="value-title-new">{value.title}</h4>
                    <p className="value-desc-new">{value.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Our Team Preview */}
      <section className="bg-dark text-white py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="section-label text-warning">OUR PEOPLE</span>
            <h2 className="text-white">Meet Our Team</h2>
            <p className="text-white-50">The passionate people behind ShopEasy</p>
          </div>
          <Row className="justify-content-center">
            {[
              { name: 'Ahmad Ayaz Khattak', role: 'CEO & Founder', img: 'https://pbs.twimg.com/media/HCBaRglbMAAiMbt?format=jpg&name=small' },
              { name: 'Michael Chen', role: 'CTO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
              { name: 'Emily Rodriguez', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
              { name: 'David Thompson', role: 'Marketing Director', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
            ].map((member, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <div className="team-preview-card text-center">
                  <img src={member.img} alt={member.name} className="team-preview-img" />
                  <h5 className="text-white mt-3 mb-1">{member.name}</h5>
                  <p className="text-warning mb-0">{member.role}</p>
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/team">
              <Button variant="outline-warning" size="lg" className="rounded-pill px-4">
                View Full Team <FaArrowRight className="ms-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <FaQuoteLeft className="testimonial-quote-icon" />
              <blockquote className="testimonial-quote">
                ShopEasy has completely transformed the way I shop for fashion. 
                The quality, pricing, and customer service are simply outstanding. 
                I've been a loyal customer for years and i recommend them!
              </blockquote>
              <div className="testimonial-author-info">
                <strong>Aysha Khan</strong>
                <span className="text-muted">Loyal Customer since 2021</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="cta-section py-5 bg-light">
        <Container className="text-center">
          <h2>Ready to Explore?</h2>
          <p className="text-muted mb-4">Discover our latest collections and find your perfect style</p>
          <Link to="/products">
            <Button variant="dark" size="lg" className="rounded-pill px-5">
              Shop Now <FaArrowRight className="ms-2" />
            </Button>
          </Link>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;