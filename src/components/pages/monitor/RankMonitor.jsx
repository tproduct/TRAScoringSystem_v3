import { Text, Stack } from "@chakra-ui/react";
import { genderLabels, roundLabels } from "@libs/constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RankMonitor = ({ competition, pusherData, result }) => {
  const [startIndex, setStartIndex] = useState(0);
  const monitor = useSelector(state => state.user.monitor);
  const groupSize = monitor?.groupSize || 10;
  const intervalTime = monitor?.interval_time * 1000 || 5000;

  // スクロールとインデックス更新
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => {
        const next = prev + groupSize;
        // はみ出したら0に戻す
        return next >= result?.length ? 0 : next;
      });
    }, intervalTime); // 3秒ごとに切り替え

    return () => clearInterval(interval);
  }, [result?.length]);

  if (!competition || !pusherData || !result) return null;
  const { type, player, categoryId, round, routine } = pusherData;
  const category = competition.categories.find(
    (category) => category.id === categoryId
  );

  return (
    <Stack w="100svw" fontSize="36px" p="5" overflowY="auto">
      <Text fontSize="20px">{`${competition.info.name} ${
        genderLabels[player.gender]
      }${category.name}${roundLabels[round]}`}</Text>
      <table width="100%">
        <tbody align="center">
          {result
            .slice(startIndex, startIndex + groupSize)
            .map((item, index) => (
              <tr
                key={item.player_id}
                height="70px"
                style={player.id === item.player_id ? { color: "yellow" } : {}}
              >
                <td width="15%">{item.rank}</td>
                <td width="30%">{item.name}</td>
                <td width="30%" style={{fontSize:"24px"}}>{item.team}</td>
                <td width="25%">
                  {item.total ? item.total.toFixed(2) : item.best.toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Stack>
  );
};

export default RankMonitor;
