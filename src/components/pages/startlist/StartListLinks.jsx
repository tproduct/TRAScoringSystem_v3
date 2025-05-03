import { Flex, Heading, List, Stack } from "@chakra-ui/react";
import { typeLabels, genderLabels, roundLabels } from "@libs/constants";
import { useSelector } from "react-redux";

const StartListLinks = () => {
  const competition = useSelector((state) => state.competition);

  return (
    <Stack>
      <Heading>スタートリスト</Heading>
    <Flex>
      {Object.entries(competition?.orders).map(([type, genders]) => (
        <Stack key={type}>
          {Object.entries(genders).map(([gender, rounds]) => (
            <List.Root key={type + gender}>
              {Object.entries(rounds).map(([round, categories]) =>
                Object.entries(categories).map(
                  ([categoryId, order]) =>
                    !!order[0].length && (
                      <List.Item
                        key={type + gender + categoryId + round}
                        ml="10"
                      >
                        <a href={`/startlist/${competition?.info?.id}/${type}/${gender}/${categoryId}/${round}`} target="_blank">
                          {typeLabels[type] +
                            genderLabels[gender] +
                            competition?.categories.find(
                              (category) => category.id === categoryId
                            )?.name +
                            roundLabels[round]}
                        </a>
                      </List.Item>
                    )
                )
              )}
            </List.Root>
          ))}
        </Stack>
      ))}
    </Flex>
    </Stack>
  );
};

export default StartListLinks;
