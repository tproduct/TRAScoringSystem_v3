import {
  HStack,
  Stack,
  Text,
  Flex,
  Pagination,
  IconButton,
  Box,
  Table,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ScoreBlock from "./ScoreBlock";
import SelectType from "@parts/select/SelectType";
import SelectGender from "@parts/select/SelectGender";
import SelectCategory from "@parts/select/SelectCategory";
import SelectRound from "@parts/select/SelectRound";
import SelectRoutine from "@parts/select/SelectRoutine";
import { useSelector } from "react-redux";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { isNullObject } from "@libs/helper";
import Alert from "@parts/Alert";
import Pusher from "pusher-js";
import SelectPanel from "@parts/select/SelectPanel";

const ScorePage = () => {
  const competition = useSelector((state) => state.competition);
  if (!competition.info) return <Alert message="大会情報を設定してください" />;
  if (isNullObject(competition.orders))
    return <Alert message="試技順を確定してください" />;

  const [page, setPage] = useState(1);
  const [selectValues, setSelectValues] = useState({
    type: "individual",
    gender: "men",
    categoryId: competition.categories[0].id,
    round: "qualify",
    routine: 1,
    panel: "A",
  });
  const [players, setPlayers] = useState([]);
  const [errors, setErrors] = useState(null);
  const [pusherData, setPusherData] = useState(null);

  useEffect(() => {
    if (Object.values(selectValues).some((val) => val === null)) return;

    const { type, gender, categoryId, round, routine } = selectValues;

    const orders =
      competition.orders[type][gender][round][categoryId][routine - 1];
    const scores =
      competition.scores[type][gender][round][categoryId][routine].scores;
    const eScores =
      competition.scores[type][gender][round][categoryId][routine].eScores;
    const currentPlayers =
      competition.players[type]?.find((item) => item.category_id === categoryId)
        ?.players || [];

    setPlayers(
      orders.map((order) => {
        const currentPlayer = currentPlayers.find(
          (player) => player.id === order.player_id
        );
        const currentScore = scores.find(
          (score) => score.order_id === order.id
        );
        const currentEScore = eScores.filter(
          (eScore) => eScore.order_id === order.id
        );

        return {
          ...currentPlayer,
          order_id: order.id,
          score: currentScore ? currentScore : null,
          escore: currentEScore.length ? currentEScore : null,
        };
      })
    );

    setPage((prev) => prev);
    setPusherData(null);
  }, [selectValues, competition]);

  useEffect(() => {
    setPage(1);
    setPusherData(null);
  }, [selectValues]);

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true,
      activityTimeout: 10 * 60 * 10000,
    });

    const channel = pusher.subscribe(
      import.meta.env.VITE_PUSHER_CHANNEL + competition?.info.id + selectValues.panel
    );

    channel.bind("sendScore", (data) => {
      setPusherData(data);
    });

    //エラーハンドリング
    pusher.connection.bind("error", (error) => {
      setErrors("リアルタイム通信に接続できませんでした");
    });
    channel.bind("pusher:subscription_error", (data) => {
      setErrors("サーバーとの通信が確立できませんでした");
    });

    return () => {
      pusher.unsubscribe(import.meta.env.VITE_PUSHER_CHANNEL + competition?.info.id + selectValues.panel);
    }
  }, [selectValues]);

  const handleSelect = (key, val) => {
    setSelectValues((prev) => {
      return {
        ...prev,
        [key]: val,
      };
    });
  };

  const rounds = competition.categories.find(
    (category) => category.id === selectValues.categoryId
  ).rounds;
  const routines = competition.rules[selectValues.round].find(
    (rule) => rule.category_id === selectValues.categoryId
  ).routines;

  return (
    <HStack>
      <Table.ScrollArea rounded="md" height="95svh" w="15svw">
        <Table.Root size="sm" fontSize="12px">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Player</Table.ColumnHeader>
              <Table.ColumnHeader>Score</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {players?.map((player, index) => (
              <Table.Row key={player.id}>
                <Table.Cell>{player.name}</Table.Cell>
                <Table.Cell
                  color="blue"
                  _hover={{ cursor: "pointer" }}
                  onClick={() => {
                    setPage(index + 1);
                  }}
                >
                  {player.score?.sum !== null && player.score?.sum !== undefined
                    ? player.score?.sum
                    : !!player.score?.dns
                    ? "DNS"
                    : "*****"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <Stack gap="1" h="100svh" w="75svw">
        {/* select area */}
        <Flex justifyContent="flex-start" flexWrap="wrap">
          <SelectGender handler={handleSelect} />
          <SelectType handler={handleSelect} />
          <SelectCategory handler={handleSelect} />
          <SelectRound rounds={rounds} handler={handleSelect} />
          <SelectRoutine routines={routines} handler={handleSelect} />
          <SelectPanel panels={competition?.info.panels} handler={handleSelect} />
        </Flex>

        {/* player area */}
        <Flex justifyContent="flex-start" alignItems="center" gap="2">
          <Pagination.Root
            page={page}
            count={players?.length}
            pageSize={1}
            onPageChange={(e) => {
              setPage(e.page);
              setPusherData(null);
            }}
          >
            <HStack>
              <Pagination.PrevTrigger asChild>
                <IconButton bg="white" color="black">
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.PageText />
              <Pagination.NextTrigger asChild>
                <IconButton bg="white" color="black">
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </HStack>
          </Pagination.Root>

          <Text textStyle="title" ml="2">
            {(players[page - 1]?.name ?? "") +
              (players[page - 1]?.name2 ? `/${players[page - 1]?.name2}` : "")}
          </Text>
          <Text textStyle="subtitle">
            {(players[page - 1]?.team ?? "") +
              (players[page - 1]?.team2 &&
              players[page - 1].team !== players[page - 1].team2
                ? `/${players[page - 1]?.team2}`
                : "")}
          </Text>
        </Flex>

        <ScoreBlock
          type={selectValues.type}
          player={players[page - 1]}
          categoryId={selectValues.categoryId}
          round={selectValues.round}
          routine={selectValues.routine}
          pusherData={pusherData}
          panel={selectValues.panel}
        />
      </Stack>
    </HStack>
  );
};

export default ScorePage;
