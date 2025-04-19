import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import Alert from "@parts/Alert";
import BaseDrawer from "@parts/BaseDrawer";
import MonitorForm from "@parts/formpages/MonitorForm";
import { useSelector } from "react-redux";

const MonitorPage = () => {
  const competitionInfo = useSelector((state) => state.competition.info);

  if(!competitionInfo) return <Alert message="大会を選択してください"/>

  return (
    <Stack h="100svh" w="94svw" p="2">
      <Box layerStyle="boxSingle">
        <Flex alignItems="center">
          <Text textStyle="title">速報設定</Text>
          {/* <BaseDrawer description={""} /> */}
        </Flex>
        <MonitorForm />
        {competitionInfo ? (
          <a href={`/monitor/${competitionInfo.id}`} target="_blank">
            <Button bg="myBlue.800" color="white">
              モニター起動
            </Button>
          </a>
        ) : (
          "大会を選択してください"
        )}
      </Box>
    </Stack>
  );
};

export default MonitorPage;
