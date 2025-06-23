import React from 'react';
import { Button } from 'react-bootstrap';

function TestError() {
  const throwError = () => {
    throw new Error('Test Rollbar error');
  };

  return (
    <div>
      <h1>Test Rollbar</h1>
      <Button onClick={throwError}>Throw Error</Button>
    </div>
  );
}

export default TestError;