const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const fixOrderDuplicate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    const db = mongoose.connection.db;
    
    // Get all indexes on orders collection
    const indexes = await db.collection('orders').indexes();
    console.log("Current indexes:", JSON.stringify(indexes, null, 2));
    
    // Drop all indexes except _id
    try {
      await db.collection('orders').dropIndexes();
      console.log("✅ All indexes dropped from orders collection");
    } catch (err) {
      console.log("Error dropping indexes:", err.message);
    }
    
    // Drop the orders collection entirely (optional - removes all orders)
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Do you want to delete all existing orders? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        await db.collection('orders').drop();
        console.log("✅ Orders collection dropped");
      }
      readline.close();
      console.log("\n✅ Fix complete! Restart your server.");
      await mongoose.disconnect();
      process.exit(0);
    });
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

fixOrderDuplicate();