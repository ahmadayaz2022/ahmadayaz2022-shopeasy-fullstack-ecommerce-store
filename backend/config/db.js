const mongoose = require('mongoose');

const dropStaleOrderIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('orders');
    const indexes = await collection.indexes();

    const staleIndexes = indexes.filter((index) => {
      return index.name === 'orderNumber_1' ||
        (index.key && index.key.orderNumber === 1);
    });

    for (const index of staleIndexes) {
      await collection.dropIndex(index.name);
      console.log(`Dropped stale orders index: ${index.name}`);
    }

    if (staleIndexes.length === 0) {
      console.log('No stale orders indexes found.');
    }
  } catch (error) {
    if (error.codeName === 'NamespaceNotFound') {
      console.log('Orders collection does not exist yet; no indexes to drop.');
    } else {
      console.error('Failed to drop stale orders indexes:', error.message);
    }
  }
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    
    await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');
    await dropStaleOrderIndexes();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
