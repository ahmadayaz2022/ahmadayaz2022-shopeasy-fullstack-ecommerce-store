import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="contact-title">Contact Us</h1>
              <p className="contact-subtitle">
                We'd love to hear from you. Get in touch with us.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row>
            <Col lg={7} className="mb-4">
              <Card className="contact-form-card">
                <Card.Body>
                  <h3 className="mb-4">Send us a Message</h3>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Your message..."
                      />
                    </Form.Group>
                    <Button variant="dark" type="submit" size="lg">
                      Send Message
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5}>
              <Card className="contact-info-card mb-4">
                <Card.Body>
                  <h4>Contact Information</h4>
                  <div className="contact-info-item">
                    <FaPhone className="contact-icon" />
                    <div>
                      <h6>Phone</h6>
                      <p>+1 (234) 567-890</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <FaEnvelope className="contact-icon" />
                    <div>
                      <h6>Email</h6>
                      <p>support@shopeasy.com</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <div>
                      <h6>Address</h6>
                      <p>123 Fashion Street, New York, NY 10001</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <FaClock className="contact-icon" />
                    <div>
                      <h6>Working Hours</h6>
                      <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;