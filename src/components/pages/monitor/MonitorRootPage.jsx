import { useEffect, useState } from "react";
import ScoreMonitor from "./ScoreMonitor";
import { useParams } from "react-router-dom";
import Pusher from "pusher-js";
import { useApiRequest } from "@hooks/useApiRequest";
import { useCompetition } from "@hooks/useCompetition";
import RankMonitor from "./RankMonitor";

const MonitorRootPage = () => {
  const [monitorType, setMonitorType] = useState("score");
  const [pusherData, setPusherData] = useState(null);
  const [error, setError] = useState([]);
  const [result, setResult] = useState(null);
  const { competitionId } = useParams();
  const { competition, fetchCompetition } = useCompetition(competitionId);

  useEffect(() => {
    document.body.style.backgroundColor = "#0c142e";
    document.body.style.color = "white";

    fetchCompetition();

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true,
      activityTimeout: 10 * 60 * 10000,
    });

    const channel = pusher.subscribe(
      import.meta.env.VITE_PUSHER_CHANNEL + competitionId
    );

    channel.bind("sendMonitor", (data) => {
      const { monitorType, type, player, categoryId, round, routine } = data;

      setMonitorType(monitorType);
      setPusherData(data);
      fetchResult(type, player.gender, categoryId, round, routine);
    });

    //エラーハンドリング
    pusher.connection.bind("error", (error) => {
      setError("リアルタイム通信に接続できませんでした");
    });
    channel.bind("pusher:subscription_error", (data) => {
      setError("サーバーとの通信が確立できませんでした");
    });

    return () => {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "#0c142e";
    }
  }, []);

  const fetchResult = async (type, gender, categoryId, round, routine) => {
    const getResult = useApiRequest(
      `/result/${competitionId}/${type}/${gender}/${categoryId}/${round}/${routine}`
    ).get;
    const response = await getResult();
    setResult(response.data);
  };
  console.log(pusherData)

  switch (monitorType) {
    case "score":
      return (
        <ScoreMonitor
          competition={competition}
          pusherData={pusherData}
          rank={
            result
              ? result.find((item) => item.player_id === pusherData.player.id)
                  ?.rank
              : ""
          }
        />
      );
    case "rank":
      return (
        <RankMonitor
          competition={competition}
          pusherData={pusherData}
          result={result}
        />
      );
  }
};

export default MonitorRootPage;
