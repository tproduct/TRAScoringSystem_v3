import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import RadioField from "@parts/formparts/RadioField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { useForm } from "@hooks/useForm";
import CheckboxField from "../formparts/CheckboxField";
import { useSelector } from "react-redux";
import {
  setQualifyRules,
  setSemifinalRules,
  setFinalRules,
} from "@store/competitionSlice";
import InputField from "@parts/formparts/InputField";

const RuleForm = ({ round }) => {
  const [errors, setErrors] = useState([]);
  const userId = useSelector((state) => state.user.info.id);
  const competitionId = useSelector((state) => state.competition.info.id);
  const competitionType = useSelector((state) => state.competition.info.type);
  const categories = useSelector((state) => state.competition.categories);
  const rules = useSelector((state) => state.competition.rules[round]);
  const actions = {
    qualify: setQualifyRules,
    semifinal: setSemifinalRules,
    final: setFinalRules,
  };
  const roundCond = {
    qualify: 1,
    semifinal: 2,
    final: 0,
  }[round];

  const filteredCategories = categories.filter(
    (category) => category.rounds > roundCond
  );
  const defaultRules = filteredCategories.map((category) => {
    const rule = rules?.find((rule) => rule.category_id === category.id);
    return {
      id: rule ? rule.id : null,
      category_id: category.id,
      name: category.name,
      nextround: rule ? rule.nextround : "10",
      routines: rule ? rule.routines : "1",
      is_total: rule ? !!rule.is_total : false,
      refresh: rule ? !!rule.refresh : false,
    };
  });

  const { createDefaultState, formAsyncAction } = useForm(
    ["id", "category_id", "routines", "is_total", "refresh", "nextround"],
    {
      post: `/users/${userId}/competitions/${competitionId}/rules/${round}`,
    },
    actions[round],
    setErrors
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData, defaultRules);
    },
    createDefaultState(defaultRules)
  );

  const items = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
  ];

  return (
    <Stack w="100%">
      <Text color="red">{errors?.message}</Text>
      <form action={formAction}>
        <Box display="flex" flexWrap="wrap" gap="1">
          {defaultRules.map((rule, index) => (
            <Box key={rule.id + index} layerStyle="boxThird">
              <Text color="red">{rule.id ? "" : "まだ設定されていません"}</Text>
              <Text>{rule.name}</Text>
              <input type="hidden" name={`id${index}`} defaultValue={rule.id} />
              <input
                type="hidden"
                name={`category_id${index}`}
                defaultValue={rule.category_id}
              />
              <RadioField
                name={`routines${index}`}
                label="試技数"
                items={items}
                defaultValue={
                  competitionType !== "TRA" && round === "final"
                    ? "2"
                    : state[index]?.routines
                    ? state[index].routines
                    : defaultRules[index].routines
                }
                errorText={errors ? errors[index]?.routines : ""}
                required
              />
              {round !== "final" ? (
                <InputField
                  type="text"
                  name={`nextround${index}`}
                  label="次ラウンド進出人数"
                  defaultValue={
                    state[index]?.nextround
                      ? state[index].nextround
                      : defaultRules[index].nextround
                  }
                  errorText={errors ? errors[index]?.nextround : ""}
                  required
                />
              ) : (
                <input type="hidden" name={`nextround${index}`} />
              )}

              {round === "qualify" ? (
                <CheckboxField
                  name={`is_total${index}`}
                  label="ラウンド合計点で競う"
                  defaultChecked={
                    state[index]?.is_total
                      ? !!state[index].is_total
                      : !!defaultRules[index].is_total
                  }
                />
              ) : (
                <input type="hidden" name={`is_total${index}`} />
              )}

              {round !== "qualify" ? (
                <CheckboxField
                  name={`refresh${index}`}
                  label="リフレッシュスタート"
                  defaultChecked={
                    competitionType !== "TRA" || round === "semifinal"
                      ? true
                      : state[index]?.refresh
                      ? !!state[index].refresh
                      : !!defaultRules[index].refresh
                  }
                />
              ) : (
                <input type="hidden" name={`refresh${index}`} />
              )}
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

export default RuleForm;
