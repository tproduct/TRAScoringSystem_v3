import { useEffect, useState } from "react";
import ScoreMonitor from "./ScoreMonitor";
import { useParams } from "react-router-dom";
import { useApiRequest } from "@hooks/useApiRequest";
import { useCompetition } from "@hooks/useCompetition";
import RankMonitor from "./RankMonitor";
import SelectPanel from "@parts/select/SelectPanel";
import { useWebSocket } from "@hooks/useWebSocket";

const MonitorRootPage = () => {
  const [monitorType, setMonitorType] = useState("score");
  const [pusherData, setPusherData] = useState(null);
  const [result, setResult] = useState(null);
  const { competitionId } = useParams();
  const { competition, fetchCompetition } = useCompetition(competitionId);
  const [panel, setPanel] = useState("A");
  const { isConnetcted, joinRoom, setMessageHandler } = useWebSocket();

  useEffect(() => {
    document.body.style.backgroundColor = "#0c142e";
    document.body.style.color = "white";

    fetchCompetition();

    joinRoom(competitionId, panel, "monitor");

    setMessageHandler((event) => {
      const data = JSON.parse(event.data);
      if (data.type === "monitorStateFromSystem") {
        const { monitorType, playerType, player, categoryId, round, routine } =
          data;

        setMonitorType(monitorType);
        setPusherData(data);
        fetchResult(playerType, player.gender, categoryId, round, routine);
      }
    });
  }, [panel, isConnetcted]);

  const fetchResult = async (type, gender, categoryId, round, routine) => {
    const getResult = useApiRequest(
      `/result/${competitionId}/${type}/${gender}/${categoryId}/${round}/${routine}`
    ).get;
    const response = await getResult();
    setResult(response.data);
  };

  const rankOfOpens = result
    ? result.filter((player) => player.is_open)?.map((player) => player.rank)
    : [];
  const rule = pusherData
    ? competition?.rules[pusherData.round].find(
        (rule) => rule.category_id === pusherData.categoryId
      )
    : null;
  const countIsOpen = rule
    ? rankOfOpens?.filter((rank) => rank <= rule.nextround).length
    : 0;

  const calcRank = (player, rankOfOpens) => {
    return player
      ? player.is_open
        ? "OP"
        : rankOfOpens
        ? player.rank -
          rankOfOpens.reduce((acc, rank) => {
            return rank < player.rank ? acc + 1 : acc;
          }, 0)
        : player.rank
      : "";
  };

  const player = result?.find(
    (item) => item.player_id === pusherData.player.id
  );
  // const rank = calcRank(player, rankOfOpens) + (calcRank(player, rankOfOpens) !== player.rank ? `(${player.rank})` : "");
  const rank = calcRank(player, rankOfOpens);

  switch (monitorType) {
    case "score":
      return (
        <>
          <SelectPanel
            panels={competition?.info.panels}
            bg="myBlue.950"
            handler={(_, val) => setPanel(val)}
          />
          <ScoreMonitor
            competition={competition}
            pusherData={pusherData}
            rank={rank}
          />
        </>
      );
    case "rank":
      return (
        <>
          <SelectPanel
            panels={competition?.info.panels}
            bg="myBlue.950"
            handler={(_, val) => setPanel(val)}
          />
          <RankMonitor
            competition={competition}
            pusherData={pusherData}
            result={result}
            rankOfOpens={rankOfOpens}
          />
        </>
      );
    case "player":
      return (
        <>
          <SelectPanel
            panels={competition?.info.panels}
            bg="myBlue.950"
            handler={(_, val) => setPanel(val)}
          />
          <ScoreMonitor
            competition={competition}
            pusherData={pusherData}
            rank="-1"
          />
        </>
      );
  }
};

export default MonitorRootPage;
