const express = require('express');
const router = express.Router();
const predefinedResponses = require('./responses'); // Make sure to define your responses

router.post('/chatbot', (req, res) => {
  const { message, username } = req.body;
  const userMessage = message.toLowerCase();

  // Find a response and customize it with the username or 'Guest'
  let reply = predefinedResponses[userMessage];
  if (reply) {
    const nameToUse = username || "Guest"; // Use 'Guest' if username is not provided
    reply = reply.replace("{username}", nameToUse); // Replace placeholder with username or 'Guest'
  }

  res.json({ 
    reply: reply || "I'm not sure how to answer that. Can you please ask in a different way?"
  });
});

module.exports = router;
