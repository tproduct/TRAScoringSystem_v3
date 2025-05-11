import { Button } from "@chakra-ui/react";

const ScoreButton = ({ label, icon, handler, disabled = false }) => {
  return (
    <Button
      size="md"
      variant="outline"
      bg="white"
      color="black"
      onClick={handler}
      border="1px solid"
      borderColor="gray.300"
      disabled={disabled}
      m="1"
    >
      {icon}
      {label}
    </Button>
  );
};

export default ScoreButton;
