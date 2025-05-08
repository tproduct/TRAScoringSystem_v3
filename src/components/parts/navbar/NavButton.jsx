import { VStack, IconButton, Text } from "@chakra-ui/react";
import { cloneElement } from "react";
import { useNavigate } from "react-router-dom";

const NavButton = ({icon, label, href, handler}) => {
  const coloredIcon = cloneElement(icon, { color: "white" });
  const navigate = useNavigate();

  return (
    <VStack>
      <IconButton
        bg="myBlue.900"
        onClick={async () => {
          if(handler) await handler();
          navigate(`${href}`);
        }}
      >
        {coloredIcon}
      </IconButton>
      <Text color="white" fontSize="10px">
        {label}
      </Text>
    </VStack>
  );
};

export default NavButton;