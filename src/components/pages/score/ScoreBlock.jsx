import {
  Container,
  Text,
  Box,
  Table,
  Editable,
  Flex,
  HStack,
  Stat,
  ButtonGroup,
  SegmentGroup,
} from "@chakra-ui/react";
import { TiCancel } from "react-icons/ti";
import { LuDownload, LuUpload } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useActionState, useEffect, useState } from "react";
import { toUpperCase, flattenArray } from "@libs/helper";
import { useEScore } from "@hooks/useEScore";
import { useScore } from "@hooks/useScore";
import { useForm } from "@hooks/useForm";
import SubmitButton from "@parts/formparts/SubmitButton";
import { setScores as setStoredScores } from "@store/competitionSlice";
import EInput from "@parts/formparts/EInput";
import { maxSkills } from "@libs/constants";
import { HiNumberedList } from "react-icons/hi2";
import BoxWithTitle from "@parts/BoxWithTitle";
import { TiSortNumerically } from "react-icons/ti";
import ScoreButton from "@parts/score/ScoreButton";
import { FiDatabase } from "react-icons/fi";
import { Spinner } from "@chakra-ui/react";
import { GoPerson } from "react-icons/go";
import { toaster } from "@ui/toaster";
import { useWebSocket } from "@hooks/useWebSocket";

const SystemBlock = ({
  type = "individual",
  player,
  categoryId,
  round,
  routine,
  panel,
}) => {
  const user = useSelector((state) => state.user);
  const userId = user?.info.id;
  const switchTime = user?.monitor.switch_time;
  const competition = useSelector((state) => state.competition);
  const [isReading, setIsReading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [check, setCheck] = useState({ dns: false, is_changed: false });
  const { scores, handleScoreChange, setScores, createScoreElement } =
    useScore();
  const scoreElement = createScoreElement(categoryId, round, routine);
  const numE = Number(competition.info.num_e);
  const maxSkill = maxSkills[competition?.info?.type];
  const { socket, isConnetcted, joinRoom, setMessageHandler } = useWebSocket();

  const {
    eScores,
    defaultEScores,
    setEScores,
    maxMark,
    handleEScoreChange,
    handleMaxMarkChange,
    handleEScoreChangeByPusher,
    alertColor,
  } = useEScore(type, numE, maxSkill);

  useEffect(() => {
    setEScores((prev) => {
      return player?.escore
        ? player.escore.reduce((acc, item) => {
            return {
              ...acc,
              [item.judge]: item,
            };
          }, {})
        : defaultEScores;
    });
    handleMaxMarkChange(
      player?.score ? player.score.maxmark : maxSkill,
      handleScoreChange
    );

    if (player?.score) {
      setScores({
        exe: player.score.exe,
        diff: player.score.diff,
        time: player.score.time,
        hd: player.score.hd,
        pen: player.score.pen,
        sum: player.score.sum,
      });
    } else {
      setScores({
        exe: 0,
        diff: 0,
        time: 0,
        hd: 0,
        pen: 0,
      });
    }

    setCheck({
      dns: player?.score ? !!player.score.dns : false,
      is_changed: player?.score ? !!player.score.is_changed : false,
    });
  }, [type, player, competition]);

  useEffect(() => {
    joinRoom(competition.info.id, panel, "system");
    setMessageHandler((event) => {
      const data = JSON.parse(event.data);
      if (data.type === "scoreFromJudge") {
        if (data.judge.at(0) === "e") {
          const newEScores = handleEScoreChangeByPusher({
            judge: data.judge,
            ...data.scores,
          });
          handleScoreChange("exe", newEScores.med.sum);
        } else {
          handleScoreChange(data.judge, data.scores.score);
        }
      }
    })
  }, [panel, isConnetcted]);

  const maxMarkArray = Array(maxSkill)
    .fill(0)
    .map((val, i) => `${i + 1}`);

  const header = {
    judge: "10%",
    ...Array(maxSkill)
      .fill("7%")
      .reduce((acc, val, i) => ({ ...acc, ["s" + (i + 1)]: val }), {}),
    lnd: "7%",
    sum: "10%",
  };

  const judgeE = [...Array(numE)].map((_, i) => `e${i + 1}`);
  judgeE.push("med");

  const formNames = flattenArray(
    judgeE.map((judge) => {
      return Object.keys(header)
        .filter((field) => field.startsWith("s") || field.startsWith("l"))
        .map((field) => {
          return judge + field;
        });
    })
  );

  const { createDefaultState, formAsyncAction } = useForm(
    [
      "score_id",
      "e1escore_id",
      "e2escore_id",
      "e3escore_id",
      "e4escore_id",
      "e5escore_id",
      "e6escore_id",
      "medescore_id",
      "order_id",
      "exe",
      "diff",
      "hd",
      "time",
      "pen",
      "sum",
      "maxmark",
      "is_changed",
      "dns",
      ...formNames,
    ],
    {
      post: `/users/${userId}/competitions/${competition?.info.id}/scores`,
      patch: `/users/${userId}/competitions/${competition?.info.id}/scores/${player?.score?.id}`,
      delete: `/users/${userId}/competitions/${competition?.info.id}/scores/${player?.score?.id}`,
    },
    setStoredScores,
    setErrors
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  const handleSegmentChange = async (e) => {
    handleMaxMarkChange(e.value, handleScoreChange);
    socket.send(
      JSON.stringify({
        type: "sendMaxMark",
        competitionId: competition.info.id,
        panel,
        maxMark: e.value,
      })
    );
  };

  const cancelReading = async () => {
    socket.send(
      JSON.stringify({
        type: "sendIsReading",
        competitionId: competition.info.id,
        panel,
        isReading: false,
      })
    );
    setIsReading(false);
  };

  const startReading = async () => {
    socket.send(
      JSON.stringify({
        type: "sendIsReading",
        competitionId: competition.info.id,
        panel,
        isReading: true,
      })
    );

    setIsReading(true);
    setTimeout(async () => {
      await cancelReading();
    }, 1000 * 60 * 3);
  };

  const handleCheckChange = (field) => {
    setCheck((prev) => {
      return {
        ...prev,
        [field]: !prev[field],
      };
    });
  };

  const handleMonitor = async (monitorType) => {
    const data = {
      type: "sendMonitorState",
      competitionId: competition.info.id,
      panel,
      playerType: type,
      categoryId,
      round,
      routine,
      player,
    };

    if (monitorType === "consecutive") {
      socket.send(
        JSON.stringify({
          ...data,
          monitorType: "score",
        })
      );

      setTimeout(async () => {
        socket.send(
          JSON.stringify({
            ...data,
            monitorType: "rank",
          })
        );
      }, switchTime * 1000);
    } else {
      socket.send(
        JSON.stringify({
          ...data,
          monitorType,
        })
      );
    }
    toaster.create({
      title: "成功",
      description: "送信しました",
      type: "success",
    });
  };

  return (
    <form action={formAction}>
      <Container>
        <input type="hidden" name="score_id" defaultValue={player?.score?.id} />
        <input type="hidden" name="order_id" defaultValue={player?.order_id} />

        {player?.escore?.map((escore) => (
          <input
            type="hidden"
            name={escore.judge + "escore_id"}
            defaultValue={escore.id}
            key={escore.judge + "escore_id"}
          />
        ))}
        {/* EScore area */}
        <Table.ScrollArea mt="2">
          <Table.Root size="sm" variant="outline" stickyHeader>
            <Table.ColumnGroup>
              {Object.keys(header).map((field) => (
                <Table.Column key={`col-${field}`} htmlWidth={header[field]} />
              ))}
            </Table.ColumnGroup>
            <Table.Header bg="blue.50">
              <Table.Row>
                {Object.keys(header).map((field) => (
                  <Table.ColumnHeader key={field} textAlign="center">
                    {toUpperCase(field)}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {judgeE.map((judge) => (
                <Table.Row key={judge}>
                  {Object.keys(header).map((field, index) => (
                    <Table.Cell key={judge + field} textAlign="center">
                      {field === "judge" ? (
                        toUpperCase(judge)
                      ) : (
                        <EInput
                          name={judge + field}
                          value={
                            field === "sum"
                              ? String(
                                  eScores[judge][field]
                                    ? eScores[judge][field].toFixed(1)
                                    : ""
                                )
                              : String(eScores[judge][field] ?? "")
                          }
                          onChange={(value) => {
                            const newEScores = handleEScoreChange(
                              judge,
                              field,
                              value
                            );
                            handleScoreChange("exe", newEScores.med.sum);
                          }}
                          bg={alertColor[index - 1]}
                          readOnly={maxMark < maxSkill && index > maxMark}
                        />
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        {/* Maxmark area */}
        <HStack>
          <Text>MaxMark</Text>
          <SegmentGroup.Root
            bg="blue.50"
            value={`${maxMark}`}
            size="xs"
            onValueChange={(e) => {
              handleSegmentChange(e);
            }}
            name="maxmark"
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={maxMarkArray} />
          </SegmentGroup.Root>
          DNS
          <input
            type="checkbox"
            name="dns"
            checked={check.dns}
            onChange={() => {
              handleCheckChange("dns");
            }}
          />
        </HStack>

        {/* Total Score area */}
        <Container>
          <Flex justifyContent="flex-start" flexWrap="wrap">
            {Object.entries(scores).map(
              ([key, value]) =>
                scoreElement[key] && (
                  <Box key={key} w="100px" mt="2">
                    <Stat.Root>
                      <Flex alignItems="center">
                        <Stat.Label mr="2">
                          {key === "time" && type === "syncronized"
                            ? "Sync"
                            : toUpperCase(key)}
                        </Stat.Label>
                        {key === "diff" && (
                          <input
                            type="checkbox"
                            name="is_changed"
                            checked={check.is_changed}
                            onChange={() => {
                              handleCheckChange("is_changed");
                            }}
                          />
                        )}
                      </Flex>
                      <HStack>
                        <Stat.ValueText>
                          <Editable.Root
                            textAlign="start"
                            value={value ? String(value) : "0"}
                            onValueChange={(e) => {
                              handleScoreChange(key, e.value);
                            }}
                            color={"blue.950"}
                            fontSize="20px"
                          >
                            <Editable.Preview
                              color={
                                key === "diff" && check.is_changed
                                  ? "red"
                                  : "black"
                              }
                            />
                            <Editable.Input w="90%" name={key} />
                          </Editable.Root>
                        </Stat.ValueText>
                      </HStack>
                    </Stat.Root>
                  </Box>
                )
            )}
          </Flex>
        </Container>

        <Flex mt="5" justifyContent="flex-start" flexWrap="wrap">
          <HStack>
            <BoxWithTitle title="Judge" icon={<LuDownload />} h="65px">
              <HStack gap="2">
                <ScoreButton
                  label="Read"
                  icon={
                    isReading ? (
                      <Spinner color="myBlue.400" size="md" />
                    ) : (
                      <TiSortNumerically />
                    )
                  }
                  handler={startReading}
                  disabled={isReading}
                />
                <ScoreButton
                  label="Cancel"
                  icon={<TiCancel />}
                  handler={cancelReading}
                  disabled={!isReading}
                />
              </HStack>
            </BoxWithTitle>
            <BoxWithTitle title="Publish" icon={<LuUpload />} h="65px">
              <HStack gap="2">
                <ScoreButton
                  label="Score&Rank"
                  icon={
                    <>
                      <TiSortNumerically />&<HiNumberedList />
                    </>
                  }
                  handler={() => {
                    handleMonitor("consecutive");
                  }}
                  disabled={!player?.score?.id}
                />
                <ScoreButton
                  label="Score"
                  icon={<TiSortNumerically />}
                  handler={() => {
                    handleMonitor("score");
                  }}
                  disabled={!player?.score?.id}
                />
                <ScoreButton
                  label="Rank"
                  icon={<HiNumberedList />}
                  handler={() => {
                    handleMonitor("rank");
                  }}
                  disabled={!player?.score?.id}
                />
                <ScoreButton
                  label="Player"
                  icon={<GoPerson />}
                  handler={() => {
                    handleMonitor("player");
                  }}
                />
              </HStack>
            </BoxWithTitle>
            <BoxWithTitle title="Regist" icon={<FiDatabase />} h="65px">
              <ButtonGroup>
                {player?.score?.id ? (
                  <SubmitButton label="Update" value="update" />
                ) : (
                  <SubmitButton label="Regist" value="create" />
                )}
                {player?.score?.id ? (
                  <SubmitButton label="Delete" value="delete" />
                ) : (
                  ""
                )}
              </ButtonGroup>
            </BoxWithTitle>
          </HStack>
        </Flex>
      </Container>
    </form>
  );
};

export default SystemBlock;
