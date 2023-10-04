import { Button } from '@mui/material';

function SubmitButton({ handleSubmit }: { handleSubmit: () => void }) {
  return (
    <div style={{ width: '100%', display: 'grid', justifyContent: 'center' }}>
      <Button
        variant="outlined"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="form-button"
      >
        Submit
      </Button>
    </div>
  );
}

export default SubmitButton;
