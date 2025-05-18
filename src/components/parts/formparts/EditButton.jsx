import { IconButton } from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const EditButton = ({ isEditting, setIsEditting }) => {
  return (
    <IconButton
      bg="white"
      color="myBlue.800"
      onClick={() => {
        setIsEditting(prev => !prev);
      }}
    >
      {isEditting ? <FaTimes />: <FaRegEdit />}
    </IconButton>
  );
};

export default EditButton;
