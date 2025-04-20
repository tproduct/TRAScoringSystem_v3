import { Button } from "@chakra-ui/react";

const SubmitButton = ({ label, value, disabled }) => {
  return (
    <Button
      type="submit"
      size="xs"
      name="button"
      value={value}
      layerStyle={`submit_${value}`}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default SubmitButton;
