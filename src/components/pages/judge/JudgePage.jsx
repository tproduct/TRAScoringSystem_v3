import { Stack, HStack, Text } from "@chakra-ui/react";
import SelectJudge from "@parts/select/SelectJudge";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JudgeForm from "./JudgeForm";
import { maxSkills } from "@libs/constants";
import { useCompetition } from "@hooks/useCompetition";
import SelectPanel from "@parts/select/SelectPanel";

const JudgePage = () => {
  const competitionId = useParams().competitionId;
  const { competition, fetchCompetition } = useCompetition(competitionId);
  const [judge, setJudge] = useState("diff");
  const type = competition ? competition.info.type : "TRA";

  const [panel, setPanel] = useState("A");

  useEffect(() => {
    fetchCompetition();
  }, []);

  const numE = Number(competition?.info.num_e) || 6;

  const handleSelect = (key, val) => {
    setJudge(val);
  };

  return (
    <Stack h="100svh" p="2">
      <HStack>
        <Text>Judge</Text>
        <SelectJudge handler={handleSelect} numE={numE} />
        <SelectPanel
          panels={competition?.info.panels}
          handler={(_, val) => setPanel(val)}
        />
      </HStack>

      <JudgeForm
        judge={judge}
        maxSkills={maxSkills[type]}
        panel={panel}
      />
    </Stack>
  );
};

export default JudgePage;
