import { useApiRequest } from "@hooks/useApiRequest";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Heading, List, Stack, HStack, Flex, Box } from "@chakra-ui/react";
import { typeLabels, genderLabels, roundLabels } from "@libs/constants";
import Alert from "@parts/Alert";
import ResultTitle from "@parts/result/ResultTitle";
import BaseDrawer from "@parts/BaseDrawer";
import { result_desc } from "@descriptions/result_desc";
import { useCompetition } from "@hooks/useCompetition";
import LinkDialog from "@parts/LinkDialog";

const ResultListPage = () => {
  const registeredCompetition = useSelector((state) => state.competition);
  const competitionId = registeredCompetition.info
    ? registeredCompetition.info.id
    : useParams().competitionId;
  const { competition, fetchCompetition } = useCompetition(competitionId);
  const teamByCat = competition?.info?.team_by_cat;
  const userInfo = useSelector((state) => state.user.info);

  useEffect(() => {
    fetchCompetition();
  }, []);

  if (!competitionId) return <Alert message="大会を選択してください" />;
  if (!competition?.categories)
    return <Alert message="カテゴリーを設定してください" />;

  return (
    <Stack>
      <HStack>
        <ResultTitle competitionInfo={competition?.info} />
        {!!userInfo && (
          <>
            <LinkDialog linkType="result" competitionId={competitionId}/>
            <BaseDrawer description={result_desc} />
          </>
        )}
      </HStack>

      <Flex h="85svh" w="95svw" gap="2" p="2">
        {Object.entries(typeLabels).map(([type, typeLabel]) =>
          competition?.info?.type !== "TRA" && type === "syncronized" ? (
            ""
          ) : (
            <Stack key={type} layerStyle="boxThird" h="100%" overflow="auto">
              <Heading size="lg">{`${typeLabel}競技`}</Heading>
              {Object.entries(roundLabels).map(([round, roundLabel]) => (
                <Stack key={type + round}>
                  <Heading size="md">{roundLabel}</Heading>
                  <List.Root>
                    {Object.entries(genderLabels).map(([gender, genderLabel]) =>
                      competition?.categories?.map((category) =>
                        (round === "semifinal" && category.rounds !== "3") ||
                        (gender === "mix" && !category.has_mix) ? (
                          ""
                        ) : (
                          <List.Item key={gender + category.id} ml="10">
                            <a
                              href={`/result/${competitionId}/${type}/${gender}/${category.id}/${round}`}
                              target="_blank"
                            >
                              {genderLabel + category.name}
                            </a>
                          </List.Item>
                        )
                      )
                    )}
                  </List.Root>
                </Stack>
              ))}
            </Stack>
          )
        )}
        <Stack layerStyle="boxThird" h="100%" overflow="auto">
          <Heading size="lg">団体競技</Heading>
          {teamByCat ? (
            competition?.categories?.map((category) => (
              <Box key={`team${category.id}`}>
                <Heading size="md">{category.name}</Heading>
                <List.Root>
                  {Object.entries(genderLabels).map(([gender, genderLabel]) =>
                    gender === "mix" && !category.has_mix ? (
                      ""
                    ) : (
                      <List.Item key={`team${gender}${category.id}`} ml="10">
                        <a
                          href={`/result/${competitionId}/team/${gender}/${category.id}/`}
                          target="_blank"
                        >
                          {genderLabel}
                        </a>
                      </List.Item>
                    )
                  )}
                </List.Root>
              </Box>
            ))
          ) : (
            <List.Root>
              {Object.entries(genderLabels).map(([gender, genderLabel]) => (
                <List.Item key={`team${gender}`} ml="10">
                  <a
                    href={`/result/${competitionId}/team/${gender}/`}
                    target="_blank"
                  >
                    {genderLabel}
                  </a>
                </List.Item>
              ))}
            </List.Root>
          )}
          <Heading size="lg">抽出</Heading>
          <List.Root>
            <List.Item ml="10">
              <a href={`/result/${competitionId}/special/`} target="_blank">
                特別表彰
              </a>
            </List.Item>
          </List.Root>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default ResultListPage;
