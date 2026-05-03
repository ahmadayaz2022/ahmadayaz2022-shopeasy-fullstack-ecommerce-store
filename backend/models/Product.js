// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     description: { type: String, required: true },

//     price: { type: Number, required: true },

//     category: {
//       type: String,
//       enum: ["men", "women", "child"],
//       required: true,
//     },

//     subCategory: {
//       type: String,
//       enum: ["topwear", "winter", "bottomwear"],
//       required: true,
//     },

//     sizes: {
//       type: [String], // ["S","M","L"]
//       required: true,
//     },

//     images: {
//       type: [String], // array of image URLs
//       required: true,
//     },

//     bestseller: {
//       type: Boolean,
//       default: false,
//     },

//     countInStock: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    currency: {
      type: String,
      enum: ["PKR", "USD", "EUR", "GBP", "AED", "SAR", "INR"],
      default: "USD",
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add index for faster querying
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ category: 1, subCategory: 1 });

module.exports = mongoose.model("Product", productSchema);