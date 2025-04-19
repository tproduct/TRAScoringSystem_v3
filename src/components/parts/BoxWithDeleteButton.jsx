import { Box, Float, IconButton } from "@chakra-ui/react";
import { TiDeleteOutline } from "react-icons/ti";

const BoxWithDeleteButton = ({ handler, layerStyle, borderColor, onClick, children }) => {
  return (
    <Box layerStyle={layerStyle} position="relative" borderColor={borderColor} onClick={onClick}>
      {children}
      <Float offsetX="5" offsetY="5">
        <IconButton
          bg="white"
          color="myBlue.800"
          onClick={handler}
        >
          <TiDeleteOutline />
        </IconButton>
      </Float>
    </Box>
  );
};

export default BoxWithDeleteButton;
