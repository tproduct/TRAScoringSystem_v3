import { Flex, IconButton } from "@chakra-ui/react";
import { TiDeleteOutline } from "react-icons/ti";

const DeleteButton = ({handler, itemId}) => {
  return (
    <Flex _hover={{ cursor: "pointer" }} justifyContent="end">
      <IconButton bg="white" color="myBlue.800" w="15px" h="15px">
        <TiDeleteOutline
          onClick={() => {
            handler(itemId);
          }}
        />
      </IconButton>
    </Flex>
  );
};

export default DeleteButton;
