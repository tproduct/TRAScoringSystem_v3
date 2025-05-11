import { Center, Flex, Stack, Text, VStack } from "@chakra-ui/react";
import { FaRegSquarePlus } from "react-icons/fa6";

const AddButton = ({label, handler, layerStyle}) => {
  return (
    <Center
      layerStyle={layerStyle}
      _hover={{ cursor: "pointer" }}
      onClick={handler}
    >
      <Stack direction={label === "competition" ? "column" : "row"} alignItems="center">
        <FaRegSquarePlus size="1.8em" color="#1a3478" />
        <Text>New {label}</Text>
      </Stack>
    </Center>
  );
};

export default AddButton;
