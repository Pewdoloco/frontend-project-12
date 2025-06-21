import React from 'react';
import { Container, Alert } from 'react-bootstrap';

function NotFound() {
  return (
    <Container className="text-center mt-5">
      <Alert variant="warning">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </Alert>
    </Container>
  );
}

export default NotFound;