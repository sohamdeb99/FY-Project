import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import SwiperContainer from './SwiperContainer';
import Modal from './Modal';
import PacketSniffing from '../Packet Sniffing/PacketSniffing';
import Chatbot from '../Chatbot/Chatbot';
import './App.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutDialogText, setLogoutDialogText] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('http://localhost:3001/verifyToken', { token });
          if (response.data.isValid) {
            setIsLoggedIn(true);
            setUsername(response.data.username); // Assuming username is returned
          } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      }
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    setLogoutDialogText('You have successfully logged out.');
    setLogoutDialogOpen(true);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };
  
  return (
    <Router>
      <div className="App">
        <video autoPlay muted loop className="body-video">
          <source src="/bg.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>

        <Navbar openModal={openModal} isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />
        <Routes>
          <Route exact path="/" element={
            <>
              <SwiperContainer openModal={openModal} />
              <div className="about-us-box">About Us</div>
              <div className="container">
                <div className="content">
                  <div className="content-text-box">
                    <h1>Cyber Security Prevention</h1>
                    <p>
                      Welcome to our Cyber Security prevention website in a digital world teeming with potential threats,
                      we're your shield and guide.
                      <br />
                      <h5>Our mission is simple: Your online safety.</h5>
                      <br />
                      Explore, Discover, Secure:
                      <br /><br />
                      Uncover the intricate web of data networks.
                      <br /><br />
                      Detect and stop threats before they strike.
                      <br /><br />
                      Stay ahead with proactive prevention.
                      <br /><br />
                      Expert insights for modern security.
                      <br /><br />
                      We're here for everyone, from individuals to businesses, ensuring your digital world stays secure. Dive in,
                      explore our tools, and trust us with your cybersecurity journey.
                      <br /><br />
                      Thank you for choosing us as your digital guardian.
                    </p>
                  </div>
                </div>
              </div>
            </>
          } />
          <Route path="/packet-sniffing" element={
            <PrivateRoute>
              <PacketSniffing />
            </PrivateRoute>
          } />
          {/* Additional routes can be added here */}
        </Routes>
        <Modal isVisible={isModalVisible} closeModal={closeModal} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />

<footer className="footer">
  <div className="container-fluid">
    <div className="row justify-content-between align-items-center">
      <div className="col-md-6 text-center text-md-start">
        <p>Cyber Intelligence © 2023</p>
      </div>
      <div className="col-md-6 text-center text-md-end">
        <p>Developed by Soham</p>
      </div>
    </div>
  </div>
</footer>

<Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
          disableScrollLock={true}
        >
          <DialogTitle id="logout-dialog-title" style={{ backgroundColor: '#1976d2', color: 'gold' }}>
            🛈 {"Logout Status"}
          </DialogTitle>
          <DialogContent style={{ backgroundColor: '#1976d2' }}>
            <DialogContentText id="logout-dialog-description" style={{ color: 'white' }}>
              {logoutDialogText}
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ backgroundColor: '#1976d2' }}>
            <Button onClick={() => setLogoutDialogOpen(false)} style={{ color: 'white' }}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Chatbot username={username} />
    </Router>
  );
}

export default App;