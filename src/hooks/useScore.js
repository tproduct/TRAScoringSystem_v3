import { useState } from "react";
import { sumOfEntries, removeKey } from "@libs/helper";
import { useSelector } from "react-redux";
import { defaultScores } from "@libs/constants";

export const useScore = () => {
  const [scores, setScores] = useState(defaultScores);
  const competition = useSelector((state) => state.competition);

  const createScoreElement = (categoryId, round, routine) => {
    const { has_d, has_h, has_t } =
      competition?.routines[round]?.find(
        ({ category_id, number }) =>
          category_id === categoryId && Number(number) === routine
      ) || {};
    return {
      exe: true,
      diff: has_d,
      hd: has_h,
      time: has_t,
      pen: true,
      sum: true,
    };
  };

  const calcSum = (scores) => {
    const newScores = removeKey({ ...scores }, "sum");
    return sumOfEntries(Object.entries(newScores)) - scores.pen * 2;
  };

  const handleScoreChange = (key, value) => {
    if (isNaN(Number(value))) return;

    setScores((prev) => {
      const newScores = {
        ...prev,
        [key]: value,
      };
      newScores.sum = calcSum(newScores);
      return newScores;
    });
  };

  return { scores, handleScoreChange, setScores, createScoreElement };
};
