import { Box, IconButton, VStack, Text } from "@chakra-ui/react";
import { FaGear, FaUser } from "react-icons/fa6";
import { FaHome, FaDatabase, FaNewspaper } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LuMonitor } from "react-icons/lu";

const Sidebar = () => {
  const navigate = useNavigate();
  const bg = "myBlue.900";

  return (
    <VStack w="60px" h="100svh" bg={bg} gap="5" p="5">
      <VStack>
        <IconButton
          bg={bg}
          onClick={() => {
            navigate("/system/user/home/");
          }}
        >
          <FaHome color="white" />
        </IconButton>
        <Text color="white" fontSize="10px">
          HOME
        </Text>
      </VStack>

      <VStack>
        <IconButton
          bg={bg}
          onClick={() => {
            navigate("/system/user/info/");
          }}
        >
          <FaUser color="white" />
        </IconButton>
        <Text color="white" fontSize="10px">
          ユーザー
        </Text>
      </VStack>

      <VStack>
        <IconButton
          bg={bg}
          onClick={() => {
            navigate("/system/competition/");
          }}
        >
          <FaGear color="white" />
        </IconButton>
        <Text color="white" fontSize="10px">
          大会設定
        </Text>
      </VStack>

      <VStack>
        <IconButton
          bg={bg}
          onClick={() => {
            navigate("/system/score/");
          }}
        >
          <FaDatabase color="white" />
        </IconButton>
        <Text color="white" fontSize="10px">
          得点集計
        </Text>
      </VStack>

      <VStack>
        <IconButton
          bg={bg}
          onClick={() => {
            navigate("/system/result/");
          }}
        >
          <FaNewspaper color="white" />
        </IconButton>
        <Text color="white" fontSize="10px">
          リザルト
        </Text>
      </VStack>
      <VStack>
        <IconButton
          bg={bg}
          onClick={() => {
            navigate(`/system/monitor/`);
          }}
        >
          <LuMonitor color="white" />
        </IconButton>
        <Text color="white" fontSize="10px">
          速報
        </Text>
      </VStack>
    </VStack>
  );
};

export default Sidebar;
