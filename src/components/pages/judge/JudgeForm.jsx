import { Button, Flex, Stack, Table, Text } from "@chakra-ui/react";
import { useWebSocket } from "@hooks/useWebSocket";
import Keyboard from "@parts/Keyboard";
import { toaster } from "@ui/toaster";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const JudgeForm = ({ judge, maxSkills, panel }) => {
  const [scores, setScores] = useState(null);
  const [focusElement, setFocusElement] = useState("");
  const competitionId = useParams().competitionId;
  const [maxMark, setMaxMark] = useState(maxSkills);
  const [isReading, setIsReading] = useState(false);
  const [prevScores, setPrevScores] = useState(null);
  const [tempScore, setTempScore] = useState("");
  const { socket, isConnetcted, joinRoom, setMessageHandler } = useWebSocket();
  
  const isExe = judge.at(0) === "e";

  const inputElementHeader = isExe
    ? Array(maxMark)
        .fill(0)
        .reduce((acc, val, index) => {
          return [...acc, `s${index + 1}`];
        }, [])
    : [];

  if (isExe && maxMark === maxSkills) inputElementHeader.push("lnd");
  inputElementHeader.push("score");

  const defaultScores = Object.fromEntries(
    inputElementHeader.map((field) => [field, ""])
  );

  useEffect(() => {
    setScores(defaultScores);
    setTempScore("");
    setPrevScores(null);
    setFocusElement(inputElementHeader[0]);
  }, [judge]);

  useEffect(() => {
    joinRoom(competitionId, panel, "judge");

    setMessageHandler((event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "maxMarkFromSystem":
          setMaxMark(data.maxMark);
          break;
        case "isReadingFromSystem":
          setIsReading(data.isReading);
          break;
      }
    })
  }, [panel, isConnetcted]);

  const keys = isExe
    ? { 0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", "◀": "◀", "▶": "▶" }
    : {
        0: "0",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        BS: "bs",
      };

  const calcScore = (scores) => {
    return Object.entries(scores).reduce((acc, [key, value]) => {
      return key !== "score" && value ? acc + Number(value) : acc;
    }, 0);
  };

  const handleKeyDown = (value) => {
    if (isExe) {
      const focusElementIndex = inputElementHeader.findIndex(
        (field) => field === focusElement
      );
      switch (value) {
        case "▶":
          if (focusElementIndex + 1 < inputElementHeader.length - 1)
            setFocusElement(inputElementHeader[focusElementIndex + 1]);
          break;
        case "◀":
          if (focusElementIndex > 0)
            setFocusElement(inputElementHeader[focusElementIndex - 1]);
          break;
        default:
          const newScores = {
            ...scores,
            [focusElement]: value,
          };
          const score = maxSkills - calcScore(newScores) / 10;

          setScores({ ...newScores, score: `${score.toFixed(1)}` });
          if (focusElementIndex + 1 < inputElementHeader.length - 1)
            setFocusElement(inputElementHeader[focusElementIndex + 1]);
          break;
      }
    } else {
      switch (value) {
        case "bs":
          if (!tempScore.length) return;
          calcScoreOfJudge(judge);
          break;
        case "0":
          if (!tempScore.length) return;
          calcScoreOfJudge(judge, value);
          break;
        default:
          calcScoreOfJudge(judge, value);
          break;
      }
    }
  };

  const calcScoreOfJudge = (judge, value = null) => {
    setTempScore((prev) => {
      if(value !== null && tempScore.length === 3) return prev;

      const newScore = value === null ? `${prev.slice(0, -1)}` :`${prev}${value}`;
      setScores((prev) => ({
        score: `${Number(newScore) / (judge === "diff" ? 10 : 100)}`,
      }));
      return newScore;
    });
  }

  const handleReset = () => {
    setScores(defaultScores);
    setTempScore("");
    setPrevScores(null);
    setFocusElement(inputElementHeader[0]);
  };

  const handleSend = () => {
    socket.send(
      JSON.stringify({
        type: "sendScoreFromJudge",
        competitionId,
        panel,
        judge,
        scores,
      })
    );
    toaster.create({
      title: "成功",
      description: "送信しました",
      type: "success",
    });
    setPrevScores(scores);
    setTempScore("");
    setScores(defaultScores);
    setFocusElement(inputElementHeader[0]);
  };

  return (
    <>
      <Text fontSize="2xl">有効本数：{maxMark}</Text>

      {isReading && (
        <Stack gap="5" w="95svw">
          <input
            type="hidden"
            value={judge}
            name="judge"
            onChange={(e) => (e.target.value = judge)}
          />
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="20px"></Table.ColumnHeader>
                {inputElementHeader.map((field) => (
                  <Table.ColumnHeader
                    textAlign="center"
                    w="30px"
                    key={`${field}header`}
                  >
                    {field}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell></Table.Cell>
                {inputElementHeader.map((field) => (
                  <Table.Cell
                    textAlign="center"
                    key={field}
                    onClick={() => {
                      setFocusElement(field);
                    }}
                    borderColor={field === focusElement ? "red" : ""}
                  >
                 
                      <Text>{scores ? field === "score" ? Number(scores[field]).toFixed(isExe || judge === "diff" ? 1 : 2) : scores[field] : ""}</Text>
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>前回</Table.Cell>

                {inputElementHeader.map((field) => (
                  <Table.Cell textAlign="center" key={field + "2"}>
                    <Text>{prevScores ? prevScores[field] : ""}</Text>
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Body>
          </Table.Root>
          <Flex justifyContent="end" gap="2">
            <Button size="xs" bg="myBlue.400" onClick={handleSend}>
              Send
            </Button>
            <Button bg="red" size="xs" onClick={handleReset}>
              Reset
            </Button>
            <Button
              bg="orange"
              size="xs"
              onClick={() => {
                setScores(prevScores);
              }}
            >
              Prev
            </Button>
          </Flex>
          {!isExe || focusElement !== "score" ? (
            <Keyboard
              keys={
                focusElement === "lnd"
                  ? {
                      ...Object.fromEntries(
                        Object.entries(keys).filter(
                          ([key, value]) => key !== "4"
                        )
                      ),
                      10: "10",
                    }
                  : keys
              }
              handler={(value) => {
                handleKeyDown(value);
              }}
            />
          ) : (
            ""
          )}
        </Stack>
      )}
    </>
  );
};

export default JudgeForm;
