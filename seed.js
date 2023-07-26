const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const { User, Designation } = require('./models/schema.js')

mongoose.connect('mongodb+srv://Admin:8r2orA6FnbbZZXOS@cluster0.s121j0z.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    seedUser();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


async function seedUser() {
    try {
      // Check if the "admin" designation exists
      const adminDesignation = await Designation.findOne({ name: 'admin' });
      if (!adminDesignation) {
        console.error('Designation "admin" does not exist');
        return;
      }
  
      // Create a new user with the "admin" designation
      const newUser = new User({
        name: 'Admin',
        email: 'admin@example.com',
        mobile:'9337069625',
        active: true,
        password: await bcrypt.hash('password', 10), // Hashed password
        designation: adminDesignation._id,
      });
  
      // Save the user to the database
      const savedUser = await newUser.save();
      console.log('Admin user created:', savedUser);
  
      // Close the MongoDB connection
      mongoose.connection.close();
    } catch (error) {
      console.error('Error seeding user:', error);
    }
  }
  