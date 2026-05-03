const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const fixCategoryIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Drop all indexes from categories collection
    try {
      await mongoose.connection.db.collection('categories').dropIndexes();
      console.log("✅ All indexes dropped from categories collection");
    } catch (err) {
      console.log("Error dropping indexes:", err.message);
    }

    // Drop the collection
    try {
      await mongoose.connection.db.collection('categories').drop();
      console.log("✅ Categories collection dropped");
    } catch (err) {
      console.log("Collection might not exist:", err.message);
    }

    console.log("\n✅ Fix complete! Now run: node seedCategories.js");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

fixCategoryIndex();