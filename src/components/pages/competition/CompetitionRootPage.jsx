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
      w="94svw"
    >
      <Tabs.List>
        <Tabs.Trigger value="info" bg="white">
          大会情報
        </Tabs.Trigger>
        <Tabs.Trigger value="category" bg="white">
          カテゴリー
        </Tabs.Trigger>
        <Tabs.Trigger value="rule" bg="white">
          ルール
        </Tabs.Trigger>
        <Tabs.Trigger value="routine" bg="white">
          得点
        </Tabs.Trigger>
        <Tabs.Trigger value="player" bg="white">
          選手登録
        </Tabs.Trigger>
        <Tabs.Trigger value="order" bg="white">
          試技順
        </Tabs.Trigger>
        <Tabs.Trigger value="team" bg="white">
          団体登録
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="info">
        <CompetitionInfoPage />
      </Tabs.Content>
      <Tabs.Content value="category">
        <CategoryPage />
      </Tabs.Content>
      <Tabs.Content value="rule">
        <RulePage />
      </Tabs.Content>
      <Tabs.Content value="routine">
        <RoutinePage />
      </Tabs.Content>
      <Tabs.Content value="player">
        <PlayerPage />
      </Tabs.Content>
      <Tabs.Content value="order">
        <OrderPage />
      </Tabs.Content>
      <Tabs.Content value="team">
        <TeamPage />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default CompetitionRootpage;
