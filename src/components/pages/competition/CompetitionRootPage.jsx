import { Tabs } from "@chakra-ui/react";
import CompetitionInfoPage from "./CompetitionInfoPage";
import CategoryPage from "./CategoryPage";
import RulePage from "./RulePage";
import RoutinePage from "./RoutinePage";
import PlayerPage from "./PlayerPage";
import OrderPage from "./OrderPage";
import TeamPage from "./TeamPage";

const CompetitionRootpage = () => {
  return (
    <Tabs.Root
      defaultValue="info"
      variant="line"
      fitted
      size="sm"
      colorPalette="myBlue"
      h="100svh"
      w="100%"
    >
      <Tabs.List
        overflowX="auto"
        whiteSpace="nowrap"
        gap="2"
        p="2"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        {["info", "category", "rule", "routine", "player", "order", "team"].map(
          (val, i) => (
            <Tabs.Trigger
              key={val}
              value={val}
              bg="white"
              px={{ base: 2, md: 4 }}
              fontSize={{ base: "xs", md: "sm" }}
            >
              {
                [
                  "大会情報",
                  "カテゴリー",
                  "ルール",
                  "得点",
                  "選手登録",
                  "試技順",
                  "団体登録",
                ][i]
              }
            </Tabs.Trigger>
          )
        )}
      </Tabs.List>
      <Tabs.Content value="info" p="2">
        <CompetitionInfoPage />
      </Tabs.Content>
      <Tabs.Content value="category" p="2">
        <CategoryPage />
      </Tabs.Content>
      <Tabs.Content value="rule" p="2">
        <RulePage />
      </Tabs.Content>
      <Tabs.Content value="routine" p="2">
        <RoutinePage />
      </Tabs.Content>
      <Tabs.Content value="player" p="2">
        <PlayerPage />
      </Tabs.Content>
      <Tabs.Content value="order" p="2">
        <OrderPage />
      </Tabs.Content>
      <Tabs.Content value="team" p="2">
        <TeamPage />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default CompetitionRootpage;
