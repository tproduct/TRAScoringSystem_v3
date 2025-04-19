import { Box, Flex, Text, Tabs } from "@chakra-ui/react";
import BaseDrawer from "@parts/BaseDrawer";
import RuleForm from "@parts/formpages/RuleForm";
import { rule_desc } from "@descriptions/rule_desc";
import { useSelector } from "react-redux";
import Alert from "@parts/Alert";

const RulePage = () => {
  const categories = useSelector((state) => state.competition.categories);

  if (!categories) return <Alert message="カテゴリーを設定してください" />;

  return (
    <Box>
      <Flex alignItems="center">
        <Text textStyle="title">ルール設定</Text>
        <BaseDrawer description={rule_desc} />
      </Flex>
      <Tabs.Root
        defaultValue="qualify"
        variant="line"
        colorPalette="myBlue"
        w="100%"
        size="sm"
        fitted
      >
        <Tabs.List>
          <Tabs.Trigger value="qualify" bg="white">
            予選１
          </Tabs.Trigger>
          <Tabs.Trigger value="semifinal" bg="white">
            予選２
          </Tabs.Trigger>
          <Tabs.Trigger value="final" bg="white">
            決勝
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="qualify">
          <RuleForm round="qualify" />
        </Tabs.Content>
        <Tabs.Content value="semifinal">
          <RuleForm round="semifinal" />
        </Tabs.Content>
        <Tabs.Content value="final">
          <RuleForm round="final" />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default RulePage;
