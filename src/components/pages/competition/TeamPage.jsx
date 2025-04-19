import { Box, Flex, Text, Tabs } from "@chakra-ui/react";
import BaseDrawer from "@parts/BaseDrawer";
import { team_desc } from "@descriptions/team_desc";
import { useSelector } from "react-redux";
import Alert from "@parts/Alert";
import TeamForm from "@parts/formpages/TeamForm";
import { genderLabels } from "@libs/constants";

const TeamPage = () => {
  const competitionInfo = useSelector((state) => state.competition.info);
  const categories = useSelector((state) => state.competition.categories);
  const registeredPlayers = useSelector(
    (state) => state.competition.players.individual
  );
  const players = competitionInfo?.team_by_cat
    ? registeredPlayers
    : registeredPlayers?.reduce((acc, categorizedPlayers) => {
        return [...acc, ...categorizedPlayers.players];
      }, []);

  if (!categories) return <Alert message="カテゴリーを設定してください" />;
  if (!players) return <Alert message="選手登録をしてください" />;

  return (
    <Box>
      <Flex alignItems="center">
        <Text textStyle="title">団体登録</Text>
        <BaseDrawer description={team_desc} />
      </Flex>
      <Tabs.Root
        defaultValue="men"
        variant="line"
        colorPalette="myBlue"
        w="100%"
        size="sm"
        fitted
      >
        <Tabs.List>
          {Object.entries(genderLabels).map(([gender, label]) => (
            <Tabs.Trigger value={gender} key={`${gender}trigger`} bg="white">
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {Object.entries(genderLabels).map(([gender, label]) => (
          <Tabs.Content value={gender} key={`${gender}content`}>
            {competitionInfo.team_by_cat ? (
              <Tabs.Root
                defaultValue={categories[0].id}
                variant="line"
                colorPalette="myBlue"
                w="100%"
                size="sm"
                fitted
              >
                <Tabs.List>
                  {categories.map((category) => (
                    <Tabs.Trigger
                      value={category.id}
                      bg="white"
                      key={category.id}
                    >
                      {category.name}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                {categories.map((category) => (
                  <Tabs.Content
                    value={category.id}
                    key={category.id + "content"}
                  >
                    <TeamForm
                      gender={gender}
                      competitionId={competitionInfo.id}
                      categoryId={category.id}
                      players={
                        players?.find(
                          (categorizedPlayers) =>
                            categorizedPlayers.category_id === category.id
                        ).players.filter( player => player.gender === gender)
                      }
                    />
                  </Tabs.Content>
                ))}
              </Tabs.Root>
            ) : (
              <TeamForm
                gender={gender}
                competitionId={competitionInfo.id}
                players={players?.filter( player => player.gender === gender )}
              />
            )}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
};

export default TeamPage;
