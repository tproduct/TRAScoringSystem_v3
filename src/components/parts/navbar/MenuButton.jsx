import { VStack, IconButton, Text, HStack } from "@chakra-ui/react";
import { cloneElement } from "react";
import { useNavigate } from "react-router-dom";

const MenuButton = ({icon, label, href, handler}) => {
  const coloredIcon = cloneElement(icon, { color: "black" });
  const navigate = useNavigate();

  return (
    <HStack>
      <IconButton
        bg="white"
        onClick={async () => {
          if(handler) await handler();
          navigate(`${href}`);
        }}
      >
        {coloredIcon}
      </IconButton>
      <Text color="black" fontSize="14px" onClick={async () => {
          if(handler) await handler();
          navigate(`${href}`);
        }}>
        {label}
      </Text>
    </HStack>
  );
};

export default MenuButton;