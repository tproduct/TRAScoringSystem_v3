import { Heading, HStack, Stack, Image, Text, Table } from "@chakra-ui/react";
import { useApiRequest } from "@hooks/useApiRequest";
import { useCompetition } from "@hooks/useCompetition";
import ResultTitle from "@parts/result/ResultTitle";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { typeLabels, genderLabels, roundLabels } from "@libs/constants";

const StartListPage = () => {
  const { competitionId, type, gender, categoryId, round } = useParams();
  const { competition, fetchCompetition } = useCompetition(competitionId);

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    fetchCompetition();

    return () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
  }, []);

  if( !competition ) return null;
  
  const order = competition?.orders[type][gender][round][categoryId];
  const players = competition?.players[type].find( categorizedPlayers => categorizedPlayers.category_id === categoryId)?.players;

  return (
    <Stack p="2">
      <ResultTitle competitionInfo={competition?.info} />
      <Heading size="2xl">
        {`${typeLabels[type]}${genderLabels[gender]}${
          competition?.categories.find((category) => category.id === categoryId)
            ?.name
        }${roundLabels[round]}`}
        スタートリスト
      </Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Gr</Table.ColumnHeader>
            <Table.ColumnHeader>No</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Team</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {order[0]?.map( orderedPlayers => (
            <Table.Row key={orderedPlayers.id}>
              <Table.Cell>{Math.floor(orderedPlayers.number / 100)}</Table.Cell>
              <Table.Cell>{orderedPlayers.number % 100}</Table.Cell>
              <Table.Cell>{players?.find( player => player.id === orderedPlayers.player_id)?.name + (type === "syncronized" ? "/"+players?.find( player => player.id === orderedPlayers.player_id)?.name2 : "")}</Table.Cell>
              <Table.Cell>{players?.find( player => player.id === orderedPlayers.player_id)?.team + (type === "syncronized" ? "/"+players?.find( player => player.id === orderedPlayers.player_id)?.team2 : "")}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};

export default StartListPage;
