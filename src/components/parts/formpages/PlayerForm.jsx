import {
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  FileUpload,
  Button,
  Table,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "@hooks/useForm";
import CheckboxField from "@parts/formparts/CheckboxField";
import { useSelector } from "react-redux";
import {
  setIndividualPlayers,
  setSyncronizedPlayers,
} from "@store/competitionSlice";
import { HiUpload } from "react-icons/hi";
import { useCSVHandler } from "@hooks/useCSVHandler";
import EditableField from "@parts/formparts/EditableField";
import { TiDeleteOutline } from "react-icons/ti";
import { FaRegSquarePlus } from "react-icons/fa6";
import SelectGender from "@parts/select/SelectGender";
import TemplateDownloadButton from "@parts/TemplateDownloadButton";

const PlayerForm = ({ type }) => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [errors, setErrors] = useState(null);
  const { createDataFromCSV } = useCSVHandler();

  const userId = useSelector((state) => state.user.info.id);
  const competitionId = useSelector((state) => state.competition.info.id);
  const categories = useSelector((state) => state.competition.categories);
  const registeredPlayers = useSelector(
    (state) => state.competition.players[type]
  );
  const actions = {
    individual: setIndividualPlayers,
    syncronized: setSyncronizedPlayers,
  };
  const header = {
    individual: {
      gender: "8%",
      grp: "8%",
      number: "8%",
      name: "25%",
      phonetic: "25%",
      team: "25%",
      is_open: "8%",
    },
    syncronized: {
      gender: "7%",
      grp: "7%",
      number: "7%",
      name: "14%",
      phonetic: "14%",
      team: "14%",
      name2: "14%",
      phonetic2: "14%",
      team2: "14%",
      is_open: "5%",
    },
  }[type];

  const headerLabels = {
    individual: {
      gender: "性別",
      grp: "G",
      number: "試技順",
      name: "氏名",
      phonetic: "ふりがな",
      team: "チーム名",
      is_open: "OPEN",
    },
    syncronized: {
      gender: "性別",
      grp: "G",
      number: "試技順",
      name: "氏名１",
      phonetic: "ふりがな１",
      team: "チーム名１",
      name2: "氏名２",
      phonetic2: "ふりがな２",
      team2: "チーム名２",
      is_open: "OPEN",
    },
  }[type];

  useEffect(() => {
    setAllPlayers(
      registeredPlayers ??
        categories.reduce((acc, category) => {
          return [...acc, { category_id: category.id, players: [] }];
        }, [])
    );
  }, [registeredPlayers]);

  const { createDefaultState, formAsyncAction } = useForm(
    ["id", "category_id", ...Object.keys(header)],
    {
      post: `/users/${userId}/competitions/${competitionId}/players/${type}`,
      delete: `/users/${userId}/competitions/${competitionId}/players/${type}`,
    },
    actions[type],
    setErrors
  );

  const playerNumber = allPlayers
    ? allPlayers.map(({ players }, index) => {
        return allPlayers
          .slice(0, index + 1)
          .reduce((acc, { players }) => acc + players.length, 0);
      })
    : [];

  const formDataBaseArray = allPlayers
    ? allPlayers.reduce((acc, { players }) => {
        return players.length ? [...acc, ...players] : [...acc];
      }, [])
    : [];

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      if (
        formData.get("button") === "delete" &&
        !window.confirm("削除すると元に戻せません。削除しますか？")
      ) {
        return prev;
      }

      //試技順の重複チェック
      const numbersArray = allPlayers.map(({ players }, categoryIndex) => {
        return players.map((player, playerIndex) => {
          const group = formData.get(
            `grp${getFlattenedIndex(categoryIndex, playerIndex)}`
          );
          const number = formData.get(
            `number${getFlattenedIndex(categoryIndex, playerIndex)}`
          );
          return group + number;
        });
      });

      if (numbersArray.some((numbers) => hasDuplicates(numbers))) {
        setErrors({ message: "試技順が重複しています" });
        return prev;
      }
      return await formAsyncAction(prev, formData, formDataBaseArray);
    },
    createDefaultState(formDataBaseArray)
  );

  const handleAccept = async (e) => {
    const loadedPlayers = await createDataFromCSV(e);
    const newPlayers = categories.reduce((acc, category) => {
      return {
        ...acc,
        [category.id]: loadedPlayers.filter(
          (player) => player.category === category.name
        ),
      };
    }, {});

    setAllPlayers((prev) => {
      return prev.map(({ category_id, players }) => {
        return {
          category_id,
          players: [...players, ...newPlayers[category_id]],
        };
      });
    });
  };

  const hasDuplicates = (arr) => {
    const set = new Set(arr);
    return set.size !== arr.length;
  };

  const handleAdd = (categoryId) => {
    const newPlayer = Object.entries(header).reduce((acc, [field, width]) => {
      return {
        ...acc,
        [field]: field === "is_open" ? false : field,
      };
    }, {});
    setAllPlayers((prev) => {
      return prev.map(({ category_id, players }) => {
        return categoryId === category_id
          ? {
              category_id,
              players: players.length ? [...players, newPlayer] : [newPlayer],
            }
          : {
              category_id,
              players,
            };
      });
    });
  };

  const handleDelete = (playerId, categoryId) => {
    setAllPlayers((prev) => {
      return prev.map(({ category_id, players }) => {
        return categoryId === category_id
          ? {
              category_id,
              players: players.filter((player) => player.id !== playerId),
            }
          : {
              category_id,
              players,
            };
      });
    });
  };

  const getFlattenedIndex = (categoryIndex, playerIndex) => {
    return (
      playerIndex + (categoryIndex > 0 ? playerNumber[categoryIndex - 1] : 0)
    );
  };

  return (
    <Stack w="100%" h="75svh" overflow="auto">
      <Text color="red">{errors?.message}</Text>

      <form action={formAction}>
        <Flex justifyContent="space-between" p="2">
          <HStack>
            <FileUpload.Root
              accept={["text/csv"]}
              maxFiles="1"
              onFileAccept={(e) => handleAccept(e)}
            >
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm" border="1px solid">
                  <HiUpload /> CSVアップロード
                </Button>
              </FileUpload.Trigger>
            </FileUpload.Root>
            <TemplateDownloadButton type={type}/>
          </HStack>
          <Spacer />
          <HStack gap="2">
            <SubmitButton label="Update" value="sync" disabled={isPending} />
            <SubmitButton label="Delete" value="delete" disabled={isPending} />
          </HStack>
        </Flex>

        {allPlayers?.map(({ category_id, players }, categoryIndex) => (
          <Box key={category_id} mt="2">
            <HStack gap="5">
              <Text>
                {
                  categories.find((category) => category.id === category_id)
                    ?.name
                }
              </Text>
              <IconButton
                bg="white"
                color="myBlue.800"
                h="15px"
                onClick={() => {
                  handleAdd(category_id);
                }}
              >
                <FaRegSquarePlus />
              </IconButton>
            </HStack>
            <Table.ScrollArea rounded="md" height="300px" w="98%" mt="3">
              <Table.Root size="sm" stickyHeader>
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    {Object.entries(header).map(([title, width]) => (
                      <Table.ColumnHeader
                        key={`${category_id}header_${title}`}
                        w={width}
                      >
                        {headerLabels[title]}
                      </Table.ColumnHeader>
                    ))}
                    <Table.ColumnHeader></Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {!!players.length &&
                    players.map((player, playerIndex) => (
                      <Table.Row
                        key={`${category_id}player${player.name}${player.team}`}
                      >
                        {Object.entries(header).map(([field, width]) => (
                          <Table.Cell
                            key={`${category_id}player_${field}${player.name}${player.team}`}
                          >
                            {field === "is_open" ? (
                              <CheckboxField
                                name={`${field}${getFlattenedIndex(
                                  categoryIndex,
                                  playerIndex
                                )}`}
                                defaultChecked={!!player[field]}
                              />
                            ) : field === "gender" ? (
                              <SelectGender
                                handler={() => {}}
                                defaultValue={player[field]}
                                width="80px"
                                name={`${field}${getFlattenedIndex(
                                  categoryIndex,
                                  playerIndex
                                )}`}
                              />
                            ) : (
                              <EditableField
                                name={`${field}${getFlattenedIndex(
                                  categoryIndex,
                                  playerIndex
                                )}`}
                                defaultValue={String(player[field])}
                                // errorText={errors ? errors[getFlattenedIndex(
                                //   categoryIndex,
                                //   playerIndex
                                // )][field] : ""}
                              />
                            )}
                          </Table.Cell>
                        ))}
                        <Table.Cell>
                          <IconButton
                            bg="white"
                            color="myBlue.800"
                            h="15px"
                            onClick={() => handleDelete(player.id, category_id)}
                          >
                            <TiDeleteOutline />
                          </IconButton>
                        </Table.Cell>
                        <Table.Cell>
                          <input
                            type="hidden"
                            name={`category_id${getFlattenedIndex(
                              categoryIndex,
                              playerIndex
                            )}`}
                            defaultValue={category_id}
                          />
                          <input
                            type="hidden"
                            name={`id${getFlattenedIndex(
                              categoryIndex,
                              playerIndex
                            )}`}
                            defaultValue={player.id}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Box>
        ))}
      </form>
    </Stack>
  );
};

export default PlayerForm;
