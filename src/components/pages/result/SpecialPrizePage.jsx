import { Box, Heading, Stack, Image, HStack, Table } from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { typeLabels, genderLabels, roundLabels } from "@libs/constants";
import ResultTitle from "@parts/result/ResultTitle";
import DownloadCSVButton from "@parts/result/DownloadCSVButton";
import { useCompetition } from "@hooks/useCompetition";
import { maxOfObjArray } from "@libs/helper";
import { useApiRequest } from "@hooks/useApiRequest";
import BoxWithTitle from "@parts/BoxWithTitle";

const SpecialPrizePage = () => {
  const { competitionId } = useParams();
  const { competition, fetchCompetition } = useCompetition(competitionId);
  const [withPhonetic, setWithPhonetic] = useState(false);
  const [checks, setChecks] = useState({
    qualify: true,
    semifinal: true,
    final: true,
  });
  const [scoreType, setScoreType] = useState("exe");
  const [gender, setGender] = useState("men");
  const [extractedScores, setExtractedScores] = useState(null);

  const tableRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    fetchCompetition();
    fetchExtractedScore();

    return () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
  }, [gender, scoreType, checks]);

  const fetchExtractedScore = async () => {
    const rounds = Object.entries(checks).reduce((acc, [round, value]) => {
      return value ? (acc === "" ? round : acc + "-" + round) : acc;
    }, "");

    const { get } = useApiRequest(
      `/competitions/${competitionId}/scores/${gender}/${scoreType}/${rounds}`
    );
    const response = await get();
    setExtractedScores(response.data);
  };

  const handleCheckChange = (field) => {
    setChecks((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const scoreLabels = {
    exe: "E",
    diff: "D",
    hd: "H",
    time: "T",
    exehd: "E+H",
  };

  return (
    <Box w="100svw" fontSize="14px">
      <Stack p="5">
        <HStack>
          <ResultTitle competitionInfo={competition?.info} />
          <DownloadCSVButton
            tableRef={tableRef}
            fileName={`specialprize_${gender}_${scoreType}`}
          />
          <label htmlFor="phonetic" className="no-print">
            ふりがな
          </label>
          <input
            type="checkbox"
            className="no-print"
            id="phonetic"
            onChange={() => {
              setWithPhonetic((prev) => !prev);
            }}
          />
        </HStack>

        <Heading size="md" mb="2">
          特別表彰
        </Heading>

        <HStack>
          <BoxWithTitle title="ラウンド" w="33svw">
            <HStack gap="4">
              {Object.entries(roundLabels).map(([round, label]) => (
                <HStack key={round}>
                  <label htmlFor={`check${round}`}>{label}</label>
                  <input
                    type="checkbox"
                    id={`check${round}`}
                    onChange={() => {
                      handleCheckChange(round);
                    }}
                    defaultChecked={true}
                  />
                </HStack>
              ))}
            </HStack>
          </BoxWithTitle>

          <BoxWithTitle title="性別" w="33svw">
            <HStack gap="4">
              {Object.entries(genderLabels).map(([gender2, label]) => (
                <HStack key={gender2}>
                  <input
                    type="radio"
                    value={gender2}
                    name="radioGender"
                    id={`radio${gender2}`}
                    defaultChecked={gender2 === gender}
                    onChange={() => {
                      setGender(gender2);
                    }}
                  />
                  <label htmlFor={`radio${gender2}`}>{label}</label>
                </HStack>
              ))}
            </HStack>
          </BoxWithTitle>

          <BoxWithTitle title="抽出" w="33svw">
            <HStack gap="4">
              {Object.entries(scoreLabels).map(([scoreType2, label]) => (
                <HStack key={scoreType2}>
                  <input
                    type="radio"
                    value={scoreType2}
                    name="radioScore"
                    id={`radio${scoreType2}`}
                    defaultChecked={scoreType2 === scoreType}
                    onChange={() => {
                      setScoreType(scoreType2);
                    }}
                  />
                  <label htmlFor={`radio${scoreType2}`}>{label}</label>
                </HStack>
              ))}
            </HStack>
          </BoxWithTitle>
        </HStack>

        <Table.Root ref={tableRef}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="50svw">Name</Table.ColumnHeader>
              <Table.ColumnHeader w="30svw">Team</Table.ColumnHeader>
              <Table.ColumnHeader w="20svw">Score</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body style={{ textAlign: "center" }}>
            {extractedScores?.map((score) => (
              <Table.Row key={score.id}>
                <Table.Cell>
                  {score.name + (withPhonetic ? `(${score.phonetic})` : "")}
                </Table.Cell>
                <Table.Cell>{score.team}</Table.Cell>
                <Table.Cell>{Number(score[scoreType]).toFixed(2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Stack>
    </Box>
  );
};

export default SpecialPrizePage;
