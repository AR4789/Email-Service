const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Define User schema and model
const userSchema = new mongoose.Schema({
  email: String,
});

const User = mongoose.model('User', userSchema);

const emails = [
  'raiaman172@gmail.com',
  'amanrai4789@gmail.com',
  'ayushrai803@gmail.com',
  'dev564@gmail.com',
  'amanrai2102@gmail.com'
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/emailDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
    
    // Remove existing data (optional)
    await User.deleteMany({});

    // Insert new data
    for (const email of emails) {
      await User.create({ email });
      console.log(`Inserted: ${email}`);
    }

    console.log('Data seeding complete');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the seed data function
seedData();
