import { Box, Float } from "@chakra-ui/react";
const BoxWithTitle = ({ title, icon, w, h, children }) => {
  return (
    <Box
      position="relative"
      w={w ? w : "fit-content"}
      h={h}
      border="1px solid"
      borderColor="gray.400"
      borderRadius="md"
      p="2"
      mb="2"
      boxShadow="md"
      color="myBlue.800"
      textAlign="center"
      alignItems="center"
      display="flex"
    >
      {children}
      <Float placement="top-start" offsetX="10" bg="white">
      {icon}{title}
      </Float>
    </Box>
  );
};

export default BoxWithTitle;
