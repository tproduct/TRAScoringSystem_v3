import { Box, Heading, Stack, Image, HStack } from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { typeLabels, genderLabels, roundLabels } from "@libs/constants";
import ResultTitle from "@parts/result/ResultTitle";
import DownloadCSVButton from "@parts/result/DownloadCSVButton";
import { useCompetition } from "@hooks/useCompetition";
import { maxOfObjArray } from "@libs/helper";
import { useApiRequest } from "@hooks/useApiRequest";

const SpecialPrizePage = () => {
  const { competitionId } = useParams();
  const { competition, fetchCompetition } = useCompetition(competitionId);
  const [withPhonetic, setWithPhonetic] = useState(false);
  const [checks, setChecks] = useState({
    qualify: false,
    semifinal: false,
    final: false,
  });
  const [scoreType, setScoreType] = useState("Exe");
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
    const rounds = Object.entries(checks).reduce( (acc, [round, value]) => {
      return value ? acc === "" ? round : acc + "-" + round : acc
    },"");

    const { get } = useApiRequest(`/competitions/${competitionId}/scores/${gender}/${scoreType}/${rounds}`);
    const response = await get();
    setExtractedScores(response.data)
  }

  const handleCheckChange = (field) => {
    setChecks((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const scoreLabels = {
    exe: "E得点",
    diff: "D得点",
    hd: "H得点",
    time: "T得点",
  }

  return (
    <Box w="100svw" fontSize="12px">
      <Stack p="5">
        <HStack>
          <ResultTitle competitionInfo={competition?.info} />
          <DownloadCSVButton tableRef={tableRef} fileName="specialprize" />
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
          {Object.entries(roundLabels).map(([round, label]) => (
            <HStack key={round}>
              <label htmlFor={`check${round}`} className="no-print">
                {label}
              </label>
              <input
                type="checkbox"
                className="no-print"
                id={`check${round}`}
                onChange={() => {
                  handleCheckChange(round);
                }}
              />
            </HStack>
          ))}
        </HStack>

        <HStack>
          {Object.entries(genderLabels).map(([gender2, label]) => (
            <HStack key={gender2}>
              <input
                type="radio"
                value={gender2}
                name="radioGender"
                id={`radio${gender2}`}
                defaultChecked={gender2 === gender}
                onChange={() => {setGender(gender2)}}
              />
              <label htmlFor={`radio${gender2}`}>{label}</label>
            </HStack>
          ))}
        </HStack>

        <HStack>
          {Object.entries(scoreLabels).map(([scoreType2, label]) => (
            <HStack key={scoreType2}>
              <input
                type="radio"
                value={scoreType2}
                name="radioScore"
                id={`radio${scoreType2}`}
                defaultChecked={scoreType2 === scoreType}
                onChange={() => {setScoreType(scoreType2)}}
              />
              <label htmlFor={`radio${scoreType2}`}>{label}</label>
            </HStack>
          ))}
        </HStack>

        <table ref={tableRef}>
          <tbody style={{ textAlign: "center" }}>
            {extractedScores?.map( score => (
              <tr key={score.id}>
                <td>{score.name}</td>
                <td>{score.team}</td>
                <td>{Number(score[scoreType]).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Stack>
    </Box>
  );
};

export default SpecialPrizePage;
