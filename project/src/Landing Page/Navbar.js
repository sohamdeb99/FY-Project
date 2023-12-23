import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'; // Ensure this path is correct
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Navbar({ openModal, isLoggedIn, username, handleLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  const performLogout = () => {
    handleCloseDropdown();
    handleLogout();
  };

  const handleLinkClick = (e, path) => {
    if (!isLoggedIn && path === "/packet-sniffing") {
      e.preventDefault();
      setDialogOpen(true);
    } else {
      navigate(path);
    }
  };
  
  return (
    <nav>
      <div className="logo">
        <img src="logo.jpg" alt="Logo" />
      </div>
      <ul className="nav__links">
        <li className="link"><Link to="/">HOME</Link></li>
        <li className="link" onClick={(e) => handleLinkClick(e, '/packet-sniffing')}>
          <a href="/packet-sniffing">Upload Packet Sniffing</a>
        </li>
        <li className="link"><a href="#">Data Visualization</a></li>
        <li className="link"><a href="#">User Dashboard</a></li>
        <li className="link"><a href="#">Alerts & Logs</a></li>
      </ul>

      {isLoggedIn ? (
        <div className="nav-user-menu">
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleToggleDropdown}
          >
            Welcome, {username}
          </Button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={performLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      ) : (
        <button className="login-button" onClick={openModal}>Login/Register</button>
      )}

<Dialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
  disableScrollLock={true}
>
  <DialogTitle id="alert-dialog-title" style={{ backgroundColor: '#1976d2', color: 'gold' }}>
    {"⚠️ Access Restricted"}
  </DialogTitle>
  <DialogContent style={{ backgroundColor: '#1976d2' }}>
    <DialogContentText id="alert-dialog-description" style={{ color: 'white' }}>
      Please login in order to access this page.
    </DialogContentText>
  </DialogContent>
  <DialogActions style={{ backgroundColor: '#1976d2' }}>
    <Button onClick={() => setDialogOpen(false)} style={{ color: 'white' }}>Close</Button>
  </DialogActions>
</Dialog>

    </nav>
  );
}

export default Navbar;