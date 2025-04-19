import { Stack, HStack, Text } from "@chakra-ui/react";
import SelectJudge from "@parts/select/SelectJudge";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JudgeForm from "./JudgeForm";
import Pusher from "pusher-js";
import { maxSkills } from "@libs/constants";
import { useCompetition } from "@hooks/useCompetition";

const JudgePage = () => {
  const competitionId = useParams().competitionId;
  const { competition, fetchCompetition } = useCompetition(competitionId);
  const [judge, setJudge] = useState("diff");
  const [error, setError] = useState("");
  const type = competition?.info.type;
  const [maxMark, setMaxMark] = useState(competition ? maxSkills[type] : 10);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    fetchCompetition();

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true,
      activityTimeout: 10 * 60 * 10000,
    });

    const channel = pusher.subscribe(import.meta.env.VITE_PUSHER_CHANNEL+competitionId);

    channel.bind("sendMaxMark", (data) => {
      setMaxMark(data);
    });

    channel.bind("sendIsReading", (data) => {
      setIsReading(data);
    });

    //エラーハンドリング
    pusher.connection.bind("error", (error) => {
      setError("リアルタイム通信に接続できませんでした");
    });
    channel.bind("pusher:subscription_error", (data) => {
      setError("サーバーとの通信が確立できませんでした");
    });
  }, []);

  const numE = Number(competition?.info.num_e) || 6;

  const handleSelect = (key, val) => {
    setJudge(val);
  };

  const readFullSkill = {
    diff: competition?.info.full_d,
    time: competition?.info.full_t,
    hd: competition?.info.full_h,
  }[judge];

  return (
    <Stack h="100svh" p="2">
      <HStack>
        <Text>Judge</Text>
        <SelectJudge handler={handleSelect} numE={numE} />
      </HStack>

      <Text fontSize="2xl">有効本数：{maxMark}</Text>

      <JudgeForm
        judge={judge}
        maxSkills={maxSkills[type]}
        maxMark={maxMark}
        isReading={isReading}
        readFullSkill={judge.at(0) === "e" ? true : !!readFullSkill}
      />
    </Stack>
  );
};

export default JudgePage;
