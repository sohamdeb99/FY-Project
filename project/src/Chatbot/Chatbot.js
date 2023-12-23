import React, { useState } from 'react';
import './Chatbot.css'; // Ensure you have this CSS file for styling

const Chatbot = ({ username }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const toggleChatbot = () => setIsVisible(!isVisible);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const userMessage = userInput.trim();
    if (!userMessage) return;

    // Add user's message to the messages array
    setMessages([{ sender: 'user', text: userMessage }, ...messages]);
    setUserInput('');

    // Simulate the typing indicator
    setMessages(currentMessages => [{ sender: 'ai', typing: true }, ...currentMessages]);

    try {
      const response = await fetch('http://localhost:3001/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, username: username || "Guest" }) // Send username or "Guest"
      });
      const data = await response.json();

      // Wait for a few seconds to simulate typing
      setTimeout(() => {
        setMessages(currentMessages => [
          { sender: 'ai', text: data.reply },
          ...currentMessages.filter(message => !message.typing),
        ]);
      }, 2000); // Adjust delay as needed
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={`chatbot-container ${isVisible ? 'active' : ''}`}>
      <button className="chatbot-toggle" onClick={toggleChatbot}>
      </button>
      {isVisible && (
        <div className="chatbot">
          <div className="chatbot-header">
            <span>𝐂𝐡𝐚𝐭𝐁𝐨𝐭</span>
            <button className="close-button" onClick={toggleChatbot}>✖</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender} ${msg.typing ? 'typing-indicator' : ''}`}>
                {msg.typing ? (
                  <>
                    <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
                    <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                  </>
                ) : (
                  msg.text
                )}
              </div>
            ))}
          </div>
          <form className="chatbot-input-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="chatbot-input"
            />
            <button type="submit" className="send-button"></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
