import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();
  return (
    <Container className="text-center mt-5">
      <Alert variant="warning">
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.message')}</p>
      </Alert>
    </Container>
  );
}

export default NotFound;