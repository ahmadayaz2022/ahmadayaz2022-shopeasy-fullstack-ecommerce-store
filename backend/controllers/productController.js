
const Product = require("../models/Product");

// ✅ Add Product (ADMIN)
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      category,
      subCategory,
      sizes,
      bestseller,
      countInStock, // ← Added this
    } = req.body;

    console.log('Add Product Request Body:', req.body); // Debug log
    console.log('countInStock received:', countInStock); 
    console.log('Currency received:', currency);// Debug log

    const images = req.files.map((file) => file.path);

    const product = new Product({
      name,
      description,
      price,
      currency: currency || "USD", 
      category,
      subCategory,
      sizes: JSON.parse(sizes), // ["S","M"]
      bestseller: bestseller === 'true' || bestseller === true, // Handle string/boolean
      countInStock: parseInt(countInStock) || 0, // ← Added this with conversion
      images,
    });

    console.log('Product to save:', product); // Debug log

    const created = await product.save();
    console.log('Product saved:', created); // Debug log
    
    res.status(201).json(created);
  } catch (error) {
    console.error('Add Product Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Edit / Update Product (ADMIN)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log('Update Product Request Body:', req.body); // Debug log

    const {
      name,
      description,
      price,
      currency,
      category,
      subCategory,
      sizes,
      bestseller,
      countInStock, // ← Added this
    } = req.body;

    // ✅ Update fields only if provided
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.currency = currency || product.currency; 
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    
    // Handle bestseller - it comes as string from FormData
    if (bestseller !== undefined) {
      product.bestseller = bestseller === 'true' || bestseller === true;
    }
    
    // ✅ Handle countInStock - parse it as integer
    if (countInStock !== undefined) {
      product.countInStock = parseInt(countInStock) || 0;
      console.log('Updated countInStock to:', product.countInStock); // Debug log
    }

    // ✅ Handle sizes (string → array)
    if (sizes) {
      product.sizes = JSON.parse(sizes);
    }

    // ✅ Handle images (if new images uploaded)
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => file.path);
      product.images = images;
    }

    console.log('Product before save:', {
      name: product.name,
      countInStock: product.countInStock,
      bestseller: product.bestseller
    }); // Debug log

    const updatedProduct = await product.save();
    
    console.log('Updated product:', {
      id: updatedProduct._id,
      countInStock: updatedProduct.countInStock
    }); // Debug log

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};