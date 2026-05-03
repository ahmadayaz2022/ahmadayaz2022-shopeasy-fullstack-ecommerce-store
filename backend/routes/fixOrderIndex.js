// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();

// const fixIndex = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB");

//     // Drop the problematic index
//     const result = await mongoose.connection.collection('orders').dropIndex("orderNumber_1");
//     console.log("Index dropped:", result);

//     // Or drop all indexes except _id
//     // await mongoose.connection.collection('orders').dropIndexes();
    
//     console.log("Index fixed successfully");
//   } catch (error) {
//     if (error.code === 27) {
//       console.log("Index not found, it may already be removed");
//     } else {
//       console.error("Error:", error);
//     }
//   } finally {
//     await mongoose.disconnect();
//     process.exit(0);
//   }
// };

// fixIndex();

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