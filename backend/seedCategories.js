const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category");

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete existing categories
    await Category.deleteMany({});
    console.log("✅ Old categories deleted");
    
    // Default categories
    const defaultCategories = [
      {
        name: "men",
        subCategories: ["topwear", "bottomwear", "winter", "accessories", "shoes"]
      },
      {
        name: "women",
        subCategories: ["topwear", "bottomwear", "winter", "dresses", "accessories"]
      },
      {
        name: "child",
        subCategories: ["topwear", "bottomwear", "winter", "toys", "accessories"]
      },
      {
        name: "kids",
        subCategories: ["topwear", "bottomwear", "winter", "toys"]
      }
    ];

    for (const cat of defaultCategories) {
      const created = await Category.create(cat);
      console.log(`✅ Created category: ${created.name} with ${created.subCategories.length} subcategories`);
    }

    console.log("\n✅ All categories seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();