import { Box, Flex, Text, Tabs } from "@chakra-ui/react";
import BaseDrawer from "@parts/BaseDrawer";
import RoutineForm from "@parts/formpages/RoutineForm";
import { routine_desc } from "@descriptions/routine_desc";
import { useSelector } from "react-redux";
import { isConfigIncomplete } from "@libs/helper";
import Alert from "@parts/Alert";

const RoutinePage = () => {
  const categories = useSelector((state) => state.competition.categories);
  const rules = useSelector((state) => state.competition.rules);

  if (!categories) return <Alert message="カテゴリーを設定してください" />;

  if (isConfigIncomplete(categories, rules)) return <Alert message="ルールを設定してください" />;
  
  return (
    <Box>
      <Flex alignItems="center">
        <Text textStyle="title">得点設定</Text>
        <BaseDrawer description={routine_desc} />
      </Flex>
      <Tabs.Root
        defaultValue="qualify"
        variant="line"
        colorPalette="myBlue"
        size="sm"
        w="100%"
        fitted
      >
        <Tabs.List>
          <Tabs.Trigger value="qualify" bg="white">
            予選
          </Tabs.Trigger>
          <Tabs.Trigger value="semifinal" bg="white">
            準決勝
          </Tabs.Trigger>
          <Tabs.Trigger value="final" bg="white">
            決勝
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="qualify">
          {rules.qualify ? <RoutineForm round="qualify" /> : <Alert message="ルールを設定してください" />}
        </Tabs.Content>
        <Tabs.Content value="semifinal">
          {rules.semifinal ? <RoutineForm round="semifinal" /> : <Alert message="ルールを設定してください" />}
        </Tabs.Content>
        <Tabs.Content value="final">
          {rules.final ? <RoutineForm round="final" /> : <Alert message="ルールを設定してください" />}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default RoutinePage;
