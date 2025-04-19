import { Center, VStack } from "@chakra-ui/react";
import { FaRegSquarePlus } from "react-icons/fa6";

const AddButton = ({label, handler, layerStyle}) => {
  return (
    <Center
      layerStyle={layerStyle}
      _hover={{ cursor: "pointer" }}
      onClick={handler}
    >
      <VStack>
        <FaRegSquarePlus size="1.8em" color="#1a3478" />
        Add New {label}
      </VStack>
    </Center>
  );
};

export default AddButton;
