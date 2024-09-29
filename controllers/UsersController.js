// controllers/UsersController.js
import { MongoClient } from 'mongodb';
import crypto from 'crypto';

const url = 'mongodb://localhost:27017'; // Adjust if necessary
const dbName = 'files_manager';

class UsersController {
  static async postNew(req, res) {
    console.log('Request Body:', req.body); // Log the request body for debugging

    const { email, password } = req.body;

    // Check for missing fields
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');

      // Check if the email already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      // Create a new user
      const newUser = { email, password: hashedPassword };
      const result = await usersCollection.insertOne(newUser);

      // Return the new user
      return res.status(201).json({ id: result.insertedId.toString(), email });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close();
    }
  }
}

export default UsersController;
