import { Flex, IconButton } from "@chakra-ui/react";
import { TiDeleteOutline } from "react-icons/ti";

const DeleteButton = ({handler, itemId}) => {
  return (
      <IconButton bg="white" color="myBlue.800" border="1px solid" onClick={() => {
        handler(itemId);
      }}>
        <TiDeleteOutline
          
        />
      </IconButton>
  );
};

export default DeleteButton;
