import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useRef, useState } from "react";
import { useForm } from "@hooks/useForm";
import CheckboxField from "@parts/formparts/CheckboxField";
import { useSelector } from "react-redux";
import {
  setQualifyRoutines,
  setSemifinalRoutines,
  setFinalRoutines,
} from "@store/competitionSlice";

const RoutineForm = ({ round }) => {
  const [errors, setErrors] = useState([]);
  const userId = useSelector((state) => state.user.info.id);
  const competition = useSelector((state) => state.competition);
  const competitionId = competition?.info?.id;
  const categories = competition?.categories;
  const rules = competition?.rules[round];
  const routines = competition?.routines[round];
  const actions = {
    qualify: setQualifyRoutines,
    semifinal: setSemifinalRoutines,
    final: setFinalRoutines,
  };
  const roundCond = {
    qualify: 1,
    semifinal: 2,
    final: 0,
  }[round];

  const filteredCategories = categories.filter(
    (category) => category.rounds > roundCond
  );

  const defaultRoutines = [];
  filteredCategories.forEach((category) => {
    const maxRoutine = Number(
      rules.find((rule) => rule.category_id === category.id)?.routines
    );
    for (let i = 0; i < maxRoutine; i++) {
      const routine = routines?.find(
        (routine) =>
          routine.category_id === category.id && routine.number - 1 === i
      );
      defaultRoutines.push({
        id: routine ? routine.id : null,
        category_id: category.id,
        number: i + 1,
        name: `${category.name}${i + 1}本目`,
        has_d: routine ? routine.has_d : true,
        has_h: routine ? routine.has_h : true,
        has_t: routine ? routine.has_t : true,
      });
    }
  });

  const { createDefaultState, formAsyncAction } = useForm(
    ["id", "category_id", "number", "has_d", "has_h", "has_t"],
    {
      post: `/users/${userId}/competitions/${competitionId}/routines/${round}`,
    },
    actions[round],
    setErrors
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData, defaultRoutines);
    },
    createDefaultState(defaultRoutines)
  );

  return (
    <Stack w="100%">
      <Text color="red">{errors?.message}</Text>
      <form action={formAction}>
        <Box display="flex" flexWrap="wrap" gap="1">
          {defaultRoutines.map((routine, index) => (
            <Box key={routine.id + index} layerStyle="boxSingle">
              <Text color="red">
                {routine.id ? "" : "まだ設定されていません"}
              </Text>
              <Text>{routine.name}</Text>
              <input
                type="hidden"
                name={`id${index}`}
                defaultValue={routine.id}
              />
              <input
                type="hidden"
                name={`category_id${index}`}
                defaultValue={routine.category_id}
              />
              <input
                type="hidden"
                name={`number${index}`}
                defaultValue={routine.number}
              />
              <HStack>
                <CheckboxField
                  name={`has_d${index}`}
                  label="Diff"
                  defaultChecked={
                    state[index]?.has_d
                      ? !!state[index].has_d
                      : !!defaultRoutines[index].has_d
                  }
                />
                {competition?.info?.type === "TRA" && (
                  <>
                    <CheckboxField
                      name={`has_h${index}`}
                      label="HD"
                      defaultChecked={
                        state[index]?.has_h
                          ? !!state[index].has_h
                          : !!defaultRoutines[index].has_h
                      }
                    />
                    <CheckboxField
                      name={`has_t${index}`}
                      label="Time"
                      defaultChecked={
                        state[index]?.has_t
                          ? !!state[index].has_t
                          : !!defaultRoutines[index].has_t
                      }
                    />
                  </>
                )}
              </HStack>
            </Box>
          ))}
        </Box>
        <Flex justifyContent="end" p="2">
          <HStack gap="2">
            <SubmitButton label="Update" value="sync" disabled={isPending} />
          </HStack>
        </Flex>
      </form>
    </Stack>
  );
};

export default RoutineForm;
