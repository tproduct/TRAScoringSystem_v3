import { Button, Flex, Stack, Table, Text } from "@chakra-ui/react";
import { useForm } from "@hooks/useForm";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import Keyboard from "@parts/Keyboard";
import { useActionState, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const JudgeForm = ({ judge, maxSkills, panel }) => {
  const [errors, setErrors] = useState(null);
  const [scores, setScores] = useState(null);
  const [focusElement, setFocusElement] = useState("");
  const competitionId = useParams().competitionId;
  const [maxMark, setMaxMark] = useState(maxSkills);
  const [isReading, setIsReading] = useState(false);
  const [ws, setWs] = useState(null);

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
    setFocusElement(inputElementHeader[0]);
  }, [judge]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    // 接続成功時
    socket.addEventListener("open", function (event) {
      socket.send(
        JSON.stringify({
          type: "join",
          competitionId,
          panel,
          role:"judge",
        })
      );
      console.log("サーバーに接続しました");
    });

    socket.addEventListener("message", function (event) {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "maxMarkFromSystem":
          setMaxMark(data.maxMark);
          break;
        case "isReadingFromSystem":
          setIsReading(data.isReading);
          break;
      }
    });
    setWs(socket);

    return () => {
      socket.close();
      setWs(null);
    };
  }, [panel]);

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
        ".": ".",
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
          if (!scores.score.length) return;

          setScores((prev) => ({
            score: `${prev.score.slice(0, -1)}`,
          }));
          break;
        case ".":
          if (!scores.score.length || scores.score.includes(value)) return;
          setScores((prev) => ({
            score: `${prev.score}${value}`,
          }));
          break;
        case "0":
          if (!scores.score.length) return;
          setScores((prev) => ({
            score: `${prev.score}${value}`,
          }));
          break;
        default:
          setScores((prev) => ({
            score: `${prev.score}${value}`,
          }));
          break;
      }
    }
  };

  const handleReset = () => {
    setScores(defaultScores);
    setFocusElement(inputElementHeader[0]);
  };

  const handleSend = () => {
    ws.send(JSON.stringify({
      type:"sendScoreFromJudge",
      competitionId,
      panel,
      judge,
      scores,
    }))
  }

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
                {inputElementHeader.map((field) => (
                  <Table.Cell
                    textAlign="center"
                    key={field}
                    onClick={() => {
                      setFocusElement(field);
                    }}
                    borderColor={field === focusElement ? "red" : ""}
                  >
                    <input
                      type="text"
                      defaultValue={scores ? scores[field] : ""}
                      style={{
                        width: field === "score" ? "60px" : "30px",
                        fontSize: "20px",
                        textAlign: "center",
                      }}
                      name={field}
                      readOnly
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Body>
          </Table.Root>
          <Flex justifyContent="end" gap="2">
            <Button size="xs" bg="myBlue.400" onClick={handleSend}>Send</Button>
            <Button bg="red" size="xs" onClick={handleReset}>
              Reset
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
