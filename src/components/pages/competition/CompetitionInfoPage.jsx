import { Box, Flex, Text } from "@chakra-ui/react";
import CompetitionInfoForm from "@parts/formpages/CompetitionInfoForm";
import { competition_desc } from "@descriptions/competition_desc";
import BaseDrawer from "@parts/BaseDrawer";

const CompetitionInfoPage = () => {
  return (
    <Box layerStyle="boxSingle">
      <Flex alignItems="center">
        <Text textStyle="title">大会情報設定</Text>
        <BaseDrawer description={competition_desc} />
      </Flex>
      <CompetitionInfoForm />
    </Box>
  );
};

export default CompetitionInfoPage;
