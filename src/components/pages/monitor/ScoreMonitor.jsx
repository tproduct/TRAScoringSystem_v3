import { Flex, Heading, HStack, Spacer, Stack, Text } from "@chakra-ui/react";
import { maxSkills } from "@libs/constants";
import { genderLabels, roundLabels } from "@libs/constants";

const ScoreMonitor = ({ competition, pusherData, rank }) => {
  if (!competition || !pusherData || !rank) return;
  const { type, player, categoryId, round, routine } = pusherData;

  const maxSkill = maxSkills[competition.info.type];
  const category = competition.categories.find(
    (category) => category.id === categoryId
  );

  const eScore = player.escore.find((escore) => escore.judge === "med");
  const score = player.score;

  return (
    <Stack h="100svh" w="100svw" fontSize="36px" gap="10" p="5">
      <Text fontSize="20px">{`${competition.info.name} ${
        genderLabels[player.gender]
      }${category.name}${roundLabels[round]} Routine${routine}`}</Text>
      <Flex alignItems="end">
        <Heading size="5xl">{player.name}</Heading>
        <Heading size="2xl" ml="10">
          {player.team}
        </Heading>
      </Flex>

      {rank === "-1" ? (
        ""
      ) : (
        <>
          <table>
            <thead>
              <tr style={{ borderBottom: "1px solid" }}>
                {Array(maxSkill)
                  .fill(0)
                  .map((val, index) => (
                    <th width="9%" key={`escoreheader${index}`}>
                      {index + 1}
                    </th>
                  ))}
                <th width="10%">L</th>
              </tr>
            </thead>
            <tbody>
              <tr
                style={{ height: "80px", color: "yellow", fontWeight: "bold" }}
              >
                {Array(maxSkill)
                  .fill(0)
                  .map((val, index) => (
                    <th key={`escore${index}`}>{eScore[`s${index + 1}`]}</th>
                  ))}
                <th>{eScore.lnd}</th>
              </tr>
            </tbody>
          </table>

          <table>
            <thead>
              <tr style={{ borderBottom: "1px solid" }}>
                <th width="14%">Exe</th>
                <th width="14%">Diff</th>
                <th width="14%">Time</th>
                <th width="14%">HD</th>
                <th width="14%">Pen</th>
                <th width="14%">Sum</th>
                <th width="16%">Rank</th>
              </tr>
            </thead>
            <tbody align="center">
              <tr
                style={{ height: "80px", color: "yellow", fontWeight: "bold" }}
              >
                <td>{score.exe.toFixed(2)}</td>
                <td style={score.is_changed ? { color: "red" } : {}}>
                  {score.diff.toFixed(1)}
                </td>
                <td>{score.time.toFixed(2)}</td>
                <td>{score.hd.toFixed(2)}</td>
                <td style={{ color: "red" }}>
                  {score.pen !== 0 && score.pen.toFixed(1)}
                </td>
                <td>{score.sum.toFixed(2)}</td>
                <td>{rank}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </Stack>
  );
};

export default ScoreMonitor;
