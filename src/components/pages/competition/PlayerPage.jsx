import { Tabs, Text, Flex } from "@chakra-ui/react";
import BaseDrawer from "@parts/BaseDrawer";
import { player_desc } from "@descriptions/player_desc";
import PlayerForm from "@parts/formpages/PlayerForm";
import { useSelector } from "react-redux";
import { isConfigIncomplete, isNullObject } from "@libs/helper";
import Alert from "@parts/Alert";

const PlayerPage = () => {
  const categories = useSelector((state) => state.competition.categories);
  const rules = useSelector((state) => state.competition.rules);
  const routines = useSelector((state) => state.competition.routines);
  
  if (!categories) return <Alert message="カテゴリーを設定してください" />;
  if (isConfigIncomplete(categories, rules)) return <Alert message="ルールを設定してください" />;
  if (isConfigIncomplete(categories, routines, rules)) return <Alert message="得点設定をしてください" />;
  // if(isNullObject(routines)) return <Alert message="得点設定をしてください" />;
  
  return (
    <>
      <Flex alignItems="center">
        <Text textStyle="title">選手登録</Text>
        <BaseDrawer description={player_desc} />
      </Flex>

      <Tabs.Root
        defaultValue="individual"
        variant="line"
        colorPalette="myBlue"
        size="sm"
        w="100%"
        fitted
      >
        <Tabs.List>
          <Tabs.Trigger value="individual" bg="white">
            個人
          </Tabs.Trigger>
          <Tabs.Trigger value="syncronized" bg="white">
            シンクロ
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="individual">
          <PlayerForm type="individual" />
        </Tabs.Content>
        <Tabs.Content value="syncronized">
          <PlayerForm type="syncronized" />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default PlayerPage;
