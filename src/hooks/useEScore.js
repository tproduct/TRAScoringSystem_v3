import { useState } from "react";
import { sumOfArray } from "@libs/helper";
import { useSelector } from "react-redux";
import { sumOfEntries, removeKeys } from "@libs/helper";

export const useEScore = (type, numE, maxSkill) => {
  const defaultEScores = Object.fromEntries(
    [
      ...Array(numE)
        .fill(0)
        .map((_, i) => `e${i + 1}`),
      "med",
    ].map((judge) => [
      judge,
      Object.fromEntries([
        ...Array(maxSkill)
          .fill(0)
          .map((item, j) => [`s${j + 1}`, null]),
        ["lnd", null],
        ["sum", null],
      ]),
    ])
  );
  const [eScores, setEScores] = useState(defaultEScores);

  const competition = useSelector((state) => state.competition);

  const maxSkills = {
    TRA: 10,
    DMT: 2,
    TUM: 8,
  }[competition?.info?.type];
  const [maxMark, setMaxMark] = useState(maxSkills);

  const calcMedian = (eScores) => {
    const newEScores = eScores.map((eScore) =>
      eScore === null ? null : Number(eScore)
    );
    if (type === "individual") {
      newEScores.sort((a, b) => a - b);
      while (newEScores.length > 2) {
        newEScores.pop();
        newEScores.shift();
      }
      return sumOfArray(newEScores) === null
        ? null
        : sumOfArray(newEScores) * (newEScores.length === 2 ? 1 : 2);
    } else {
      switch (newEScores.length) {
        case 2:
          return sumOfArray(newEScores) === null
            ? null
            : sumOfArray(newEScores) / 2;
        case 4:
          return sumOfArray(newEScores) === null
            ? null
            : sumOfArray(newEScores) / 4;
        case 6:
          const eOf1 = [newEScores[0], newEScores[2], newEScores[4]].sort(
            (a, b) => a - b
          );
          const eOf2 = [newEScores[1], newEScores[3], newEScores[5]].sort(
            (a, b) => a - b
          );
          eOf1.pop();
          eOf2.pop();
          eOf1.shift();
          eOf2.shift();
          return eOf1[0] === null || eOf2[0] === null
            ? null
            : (eOf1[0] + eOf2[0]) / 2;
      }
    }
  };

  const calcMedianScores = (eScores) => {
    const newMedScoreEntries = Object.entries(eScores["e1"]).map(
      ([skill, val]) => {
        const eOfSkill = Object.keys(eScores).map(
          (judge) => eScores[judge][skill]
        );
        eOfSkill.pop();
        return [skill, calcMedian(eOfSkill)];
      }
    );
    newMedScoreEntries.pop();
    return Object.fromEntries(newMedScoreEntries);
  };

  const setSum = (eScores, maxMark = maxSkills) => {
    return Object.fromEntries(
      Object.entries(eScores).map(([judge, eScore]) => {
        const newEScore = removeKeys({ ...eScore }, [
          "id",
          "judge",
          "score_id",
          "order_id",
          "sum",
        ]);
        const sum = sumOfEntries(Object.entries(newEScore));
        newEScore.sum =
          judge !== "med"
            ? maxMark +
              { TRA: 0, DMT: 8 - (maxMark % 2), TUM: 2 }[
                competition.info.type
              ] -
              sum / 10
            : (maxMark +
                { TRA: 0, DMT: 8 - (maxMark % 2), TUM: 2 }[
                  competition.info.type
                ]) *
                { individual: 2, syncronized: 1 }[type] -
              sum / 10;
        return [judge, newEScore];
      })
    );
  };

  const setMedianScores = () => {
    setEScores((prev) => {
      return setSum({
        ...prev,
        med: calcMedianScores(eScores),
      });
    });
  };

  const handleEScoreChange = (judge, skill, val) => {
    if (isNaN(Number(val))) return;

    const newEScore = { ...eScores[judge], [skill]: Number(val) };
    const newEScores = setSum({
      ...{ ...eScores, [judge]: newEScore },
      med: calcMedianScores({ ...eScores, [judge]: newEScore }),
    });

    setEScores(newEScores);

    return newEScores;
  };

  const handleMaxMarkChange = (maxMark, handleScoreChange) => {
    if (maxMark === null) return;

    setMaxMark(Number(maxMark));
    setEScores((prev) => {
      const newEScores = setSum(
        Object.fromEntries(
          Object.entries({ ...prev }).map(([judge, eScore]) => {
            const updatedEScore = { ...eScore };
            for (let i = Number(maxMark); i < maxSkills; i++) {
              updatedEScore[`s${i + 1}`] = null;
            }
            if (maxMark < maxSkills) updatedEScore.lnd = null;
            return [judge, updatedEScore];
          })
        ),
        Number(maxMark)
      );
      handleScoreChange("exe", newEScores.med.sum);
      return newEScores;
    });
  };

  const handleEScoreChangeByPusher = (data) => {
    const newEScore = eScores[data.judge];
    Object.entries(data).forEach(([key, value]) => {
      newEScore[key] = value;
    });

    const newEScores = setSum({
      ...{ ...eScores, [data.judge]: newEScore },
      med: calcMedianScores({ ...eScores, [data.judge]: newEScore }),
    });

    setEScores(newEScores);
    return newEScores;
  };

  return {
    eScores,
    defaultEScores,
    setEScores,
    maxMark,
    setMaxMark,
    setMedianScores,
    handleEScoreChange,
    handleMaxMarkChange,
    maxSkills,
    handleEScoreChangeByPusher,
  };
};
