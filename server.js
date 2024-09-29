// Server.js
import express from 'express';
import mainRoute from './routes/index';

const app = express();
const PORT = process.env.PORT || 5000;

// Use the routes from routes/index.js
app.use(express.json());
app.use(mainRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});

export default app;
