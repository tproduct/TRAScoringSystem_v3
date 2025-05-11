import { Box, Flex, HStack, Stack, Table } from "@chakra-ui/react";
import { useForm } from "@hooks/useForm";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useEffect, useState } from "react";
import { FaRegSquareMinus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { setTeams } from "@store/competitionSlice";
import AddButton from "@parts/AddButton";
import DeleteButton from "@parts/DeleteButton";
import BoxWithDeleteButton from "@parts/BoxWithDeleteButton";

const TeamForm = ({ gender, competitionId, categoryId = null, players }) => {
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const userId = useSelector((state) => state.user.info.id);
  const registeredTeams = useSelector((state) => state.competition.teams);

  useEffect(() => {
    const newTeams = categoryId
      ? registeredTeams.filter(
          (team) => team.category_id === categoryId && team.gender === gender
        )
      : registeredTeams.filter((team) => team.gender === gender);
    const newTeamPlayers = newTeams?.map((team) => {
      const newPlayers = [1, 2, 3, 4].reduce((acc, index) => {
        const newPlayer = players.find(
          (player) => player.id == team[`player${index}`]
        );

        return newPlayer ? [...acc, newPlayer] : acc;
      }, []);

      return {
        id: team.id,
        name: team.name,
        players: newPlayers,
      };
    });
    setTeamPlayers(newTeamPlayers);
  }, [registeredTeams]);

  const [errors, setErrors] = useState(null);

  const methods = categoryId
    ? {
        post: `/users/${userId}/competitions/${competitionId}/categories/${categoryId}/teams`,
        delete: `/users/${userId}/competitions/${competitionId}/teams`,
      }
    : {
        post: `/users/${userId}/competitions/${competitionId}/teams`,
        delete: `/users/${userId}/competitions/${competitionId}/teams`,
      };

  const { createDefaultState, formAsyncAction } = useForm(
    ["id", "name", "player1", "player2", "player3", "player4"],
    methods,
    setTeams,
    setErrors
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      if (
        formData.get("button") === "delete" &&
        !window.confirm("削除すると元に戻せません。削除しますか？")
      ) {
        return prev;
      }
      return formAsyncAction(prev, formData, teamPlayers);
    },
    createDefaultState(teamPlayers)
  );

  const handleAdd = () => {
    setTeamPlayers((prev) => {
      return [
        ...prev,
        {
          id: self.crypto.randomUUID(),
          name: "",
          players: [],
        },
      ];
    });
  };

  const handleDelete = (teamId) => {
    setTeamPlayers((prev) => {
      return prev.filter((team) => team.id !== teamId);
    });
  };

  const handlePlayerAdd = (player) => {
    if (!selectedTeam) return;

    setTeamPlayers((prev) => {
      return prev.map((team) => {
        if (team.id === selectedTeam.id && team.name === "")
          team.name = player.team;

        return team.id === selectedTeam.id && team.players.length < 4
          ? { ...team, players: [...team.players, player] }
          : team;
      });
    });
  };

  const handlePlayerDelete = (teamId, playerId) => {
    setTeamPlayers((prev) => {
      return prev.map((team) => {
        return team.id === teamId
          ? {
              ...team,
              players: team.players.filter((player) => player.id !== playerId),
            }
          : team;
      });
    });
  };

  const selectTeam = (team) => {
    setSelectedTeam(team);
  };

  return (
    <form action={formAction}>
      <Stack w="100%">
        <Flex
          direction="column" h="70svh" w="100%"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            flex="1"
            overflow="auto"
            gap="4"
            p="2"
          >
            <Box w={{ base: "100%", md: "50%" }}>
            {teamPlayers?.map((team, teamIndex) => (
              <BoxWithDeleteButton
                layerStyle="boxSingle"
                key={team.id}
                handler={() => {
                  if (teamPlayers.length > 1) handleDelete(team.id);
                }}
                onClick={() => {
                  selectTeam(team);
                }}
                borderColor={selectedTeam?.id === team.id ? "red" : "black"}
              >
                <input
                  type="hidden"
                  name={`id${teamIndex}`}
                  defaultValue={team.id.includes("team_") ? team.id : ""}
                />
                <input
                  type="hidden"
                  name={`gender${teamIndex}`}
                  defaultValue={gender}
                />

                <InputField
                  label="チーム名"
                  type="text"
                  name={`name${teamIndex}`}
                  defaultValue={team.name}
                />
                <HStack gap="2">
                  {team?.players?.map((player, playerIndex) =>
                    player ? (
                      <Box key={player.id}>
                        <HStack>
                          {player.name}
                          <input
                            type="hidden"
                            defaultValue={player.id}
                            name={`player${playerIndex + 1}${teamIndex}`}
                          />
                          <FaRegSquareMinus
                            size="1em"
                            color="#1a3478"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handlePlayerDelete(team.id, player.id);
                            }}
                          />
                        </HStack>
                      </Box>
                    ) : (
                      ""
                    )
                  )}
                </HStack>
              </BoxWithDeleteButton>
            ))}
            <AddButton
              label="Team"
              handler={handleAdd}
              layerStyle="boxSingle"
            />
            </Box>

          <Box
            w={{ base: "100%", md: "50%" }}
          >
            <Table.ScrollArea rounded="md" height="50svh" w="98%" mt="3">
              <Table.Root size="sm" stickyHeader>
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Team</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {players.map((player) => (
                    <Table.Row key={player.id}>
                      <Table.Cell
                        onClick={() => {
                          handlePlayerAdd(player);
                        }}
                        style={{
                          color:
                            player.team === selectedTeam?.name
                              ? "blue"
                              : "black",
                        }}
                      >
                        {player.name}
                      </Table.Cell>
                      <Table.Cell
                        style={{
                          color:
                            player.team === selectedTeam?.name
                              ? "blue"
                              : "black",
                        }}
                      >
                        {player.team}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Box>
          </Flex>

          <Flex
            justifyContent="flex-end"
            p="4"
            borderTop="1px solid #ccc"
            bg="white"
          >
            <HStack gap="2">
              <SubmitButton label="Update" value="sync" disabled={isPending} />
              <SubmitButton
                label="Delete"
                value="delete"
                disabled={isPending}
              />
            </HStack>
          </Flex>

        </Flex>
      </Stack>
    </form>
  );
};

export default TeamForm;
