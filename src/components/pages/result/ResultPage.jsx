import { Box, Heading, Stack, Image, HStack } from "@chakra-ui/react";
import { useApiRequest } from "@hooks/useApiRequest";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ResultHeader from "@parts/result/ResultHeader";
import ResultFirstRow from "@parts/result/ResultFirstRow";
import ResultSecondRow from "@parts/result/ResultSecondRow";
import ResultThirdRow from "@parts/result/ResultThirdRow";
import { typeLabels, genderLabels, roundLabels } from "@libs/constants";
import ResultTitle from "@parts/result/ResultTitle";
import DownloadCSVButton from "@parts/result/DownloadCSVButton";
import { useCompetition } from "@hooks/useCompetition";

const ResultPage = () => {
  const { competitionId, categoryId, type, gender, round, routine } =
    useParams();
  const { get } = useApiRequest(
    `/result/${competitionId}/${type}/${gender}/${categoryId}/${round}/${routine}`
  );
  const [data, setData] = useState(null);
  const [withPhonetic, setWithPhonetic] = useState(false);
  const { competition, fetchCompetition } = useCompetition(competitionId);
  const tableRef = useRef(null);

  const competitionType = competition?.info.type;
  const rule = competition?.rules[round].find(
    (rule) => rule.category_id === categoryId
  );
  const is_total = rule?.is_total || !rule?.refresh;
  const typeLabel = typeLabels[type];
  const genderLabel = genderLabels[gender];
  const roundLabel = roundLabels[round];

  const category = competition?.categories.find(
    (category) => category.id === categoryId
  );

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    fetchResult();
    fetchCompetition();

    return () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
  }, []);

  const fetchResult = async () => {
    const response = await get();
    setData(response.data);
  };

  return (
    <Box w="100svw" fontSize="12px">
      <Stack p="5">
        <HStack>
          <ResultTitle competitionInfo={competition?.info} />
          <DownloadCSVButton
            tableRef={tableRef}
            fileName={
              typeLabel +
              genderLabel +
              category?.name +
              roundLabel +
              (routine ? `${routine}本目` : "")
            }
          />
          <label htmlFor="phonetic" className="no-print">ふりがな</label>
          <input type="checkbox" className="no-print" id="phonetic" onChange={() => { setWithPhonetic(prev => !prev)}}/>
        </HStack>

        <Heading size="md" mb="2">
          {typeLabel +
            genderLabel +
            category?.name +
            roundLabel +
            (routine ? `${routine}本目` : "")}
        </Heading>

        <table ref={tableRef}>
          <ResultHeader type={competitionType} is_total={is_total} />
          <tbody style={{ textAlign: "center" }}>
            {data?.map((player, index) => (
              <Fragment key={player.player_id}>
                <ResultFirstRow
                  type={competitionType}
                  round={round}
                  player={player}
                  category={category}
                  rule={rule}
                  routine={routine}
                  withPhonetic={withPhonetic}
                />
                <ResultSecondRow
                  type={competitionType}
                  round={round}
                  player={player}
                  category={category}
                  rule={rule}
                />
                {round === "final" &&
                  category?.rounds > 1 &&
                  !rule?.refresh && (
                    <ResultThirdRow
                      type={competitionType}
                      round={round}
                      player={player}
                      category={category}
                      rule={rule}
                    />
                  )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Stack>
    </Box>
  );
};

export default ResultPage;
