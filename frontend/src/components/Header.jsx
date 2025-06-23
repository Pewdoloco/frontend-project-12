import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import { useTranslation } from 'react-i18next';

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.setItem('isLoggingOut', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    socket.disconnect();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fs-4">
          {t('header.appName')}
        </Navbar.Brand>
        <Nav className="ms-auto">
          {isAuthenticated && (
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              {t('common.logout')}
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;