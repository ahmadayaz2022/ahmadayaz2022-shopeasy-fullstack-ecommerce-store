// Generate unique ID
exports.generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format price
exports.formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

// Calculate discount
exports.calculateDiscount = (originalPrice, discount) => {
  return originalPrice - (originalPrice * discount) / 100;
};

// Validate email
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
exports.validatePhone = (phone) => {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Generate slug
exports.generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// Paginate results
exports.paginate = (page, limit, total) => {
  return {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: limit,
  };
};

// Calculate total price
exports.calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Format date
exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Get current timestamp
exports.getCurrentTimestamp = () => {
  return new Date();
};
