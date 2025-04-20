import { IconButton } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";
import { FaSyncAlt } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";

const MessageSubmitButton = ({value}) => {
  const icon = {
    create:<LuSend />,
    update:<FaSyncAlt />,
    delete:<LuTrash2 />,
  }[value];

  return (
    <IconButton bg="white" color="myBlue.800" type="submit" value={value} name="button">
      {icon}
    </IconButton>
  )
}

export default MessageSubmitButton;