const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative']
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      trim: true
    },
    imageUrls: {
      type: [String],
      required: [true, 'Please provide product image URLs']
    },
    category: {
      type: String,
      required: [true, 'Please select a product category'],
      default: 'Others'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
