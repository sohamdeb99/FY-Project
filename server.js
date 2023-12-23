const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MONGO_URI, JWT_SECRET } = require('./config/keys');
const chatbotRoute = require('./routes/ChatbotFunction');
const authRoutes = require('./routes/Auth');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.post('/verifyToken', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).send('No token provided');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ isValid: false, error: err.message });
    }
    User.findById(decoded.user.id, (err, user) => {
      if (err || !user) {
        console.error('User not found:', err);
        return res.status(401).json({ isValid: false, error: 'User not found' });
      }
      res.json({ isValid: true, username: user.username });
    });
  });
});

app.use('/api', chatbotRoute);
app.use('/Auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
