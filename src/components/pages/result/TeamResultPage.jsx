import {
  Box,
  Heading,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { useApiRequest } from "@hooks/useApiRequest";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { genderLabels } from "@libs/constants";
import ResultTitle from "@parts/result/ResultTitle";
import DownloadCSVButton from "@parts/result/DownloadCSVButton";
import { useCompetition } from "@hooks/useCompetition";

const TeamResultPage = () => {
  const { competitionId, gender, categoryId } = useParams();
  const endpoint = categoryId
    ? `/result/${competitionId}/team/${gender}/${categoryId}`
    : `/result/${competitionId}/team/${gender}`;
  const { get } = useApiRequest(endpoint);
  const { competition, fetchCompetition } = useCompetition(competitionId);
  const [result, setResult] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    fetchData();
    fetchCompetition();

    return () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
  }, []);

  const fetchData = async () => {
    const response = await get();
    setResult(response.data);
  };

  const teams = result?.reduce((acc, player) => {
    return acc.find((team) => team.id === player.team_id)
      ? acc
      : [
          ...acc,
          {
            id: player.team_id,
            rank: player.rank,
            name: player.team_name,
            score: player.score.toFixed(2),
            players: result.filter(
              (player2) => player2.team_id === player.team_id
            ),
          },
        ];
  }, []);

  const categoryName = categoryId ? competition?.categories.find( category => category.id === categoryId ).name : "";

  return (
    <Box h="100svh" overflow="auto" fontSize="12px">
      <Stack p="5">
        <HStack>
          <ResultTitle competitionInfo={competition?.info} />
          <DownloadCSVButton tableRef={tableRef} fileName={`団体${genderLabels[gender]}${categoryName}`}/>
        </HStack>

        <Heading size="md" mb="2">
          {`団体${genderLabels[gender]}${categoryName}`}
        </Heading>

        <table style={{ fontSize: "14px" }} ref={tableRef}>
          <thead>
            <tr style={{ borderBottom: "1px solid", height: "30px" }}>
              <th width="50px">Rank</th>
              <th width="250px">Name</th>
              <th width="150px">
                {competition?.info.team_routines === "2" ? "Rtn1" : ""}
              </th>
              {competition?.info.team_routines === "2" && (
                <th width="150px">Rtn2</th>
              )}
              <th width="150px">Score</th>
            </tr>
          </thead>
          <tbody>
            {teams?.map((team) => (
              <Fragment key={team.id}>
                <tr height="30px" style={{ textAlign: "center" }}>
                  <td>{team.rank}</td>
                  <td>{team.name}</td>
                  {competition?.info.team_routines === "2" && <td></td>}
                  <td></td>
                  <td>{team.score}</td>
                </tr>
                {team.players?.map((player, index) => (
                  <tr
                    key={`${team.id}player${index}`}
                    height="30px"
                    style={
                      index + 1 === team.players.length
                        ? { borderBottom: "1px solid", textAlign: "center" }
                        : { textAlign: "center" }
                    }
                  >
                    <td></td>
                    <td align="right">{player.player_name}</td>
                    <td>{player.sum_1 ? player.sum_1.toFixed(2) : ""}</td>
                    {competition?.info.team_routines === "2" && (
                      <td>{player.sum_2 ? player.sum_2.toFixed(2) : ""}</td>
                    )}
                    <td></td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Stack>
    </Box>
  );
};

export default TeamResultPage;
