import Alert from 'react-bootstrap/Alert';

const AlertMessage = ({ variant, message, show, onClose, customClass }) => {
  return (
    <>
      {show && (
        <Alert 
          variant={variant}
          onClose={onClose} 
          dismissible
          style={{ marginBottom: '0' }}
        >
          {message}
        </Alert>
      )}
    </>
  );
};

export default AlertMessage;

