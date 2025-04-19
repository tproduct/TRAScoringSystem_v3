import { Box, Flex, HStack, Spacer, Stack, Text } from "@chakra-ui/react";
import InputField from "@parts/formparts/InputField";
import RadioField from "@parts/formparts/RadioField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { useForm } from "@hooks/useForm";
import CheckboxField from "@parts/formparts/CheckboxField";
import { useSelector } from "react-redux";
import { setCompetitionInfo } from "@store/competitionSlice";

const CompetitionInfoForm = () => {
  const [errors, setErrors] = useState(null);
  const userId = useSelector((state) => state.user.info.id);
  const competition = useSelector((state) => state.competition.info);
  const { createDefaultState, formAsyncAction } = useForm(
    [
      "type",
      "name",
      "date_from",
      "date_to",
      "venue",
      "panels",
      "num_e",
      "team_by_cat",
      "team_routines",
      "read_d",
      "read_h",
      "read_t",
      "full_d",
      "full_h",
      "full_t",
    ],
    {
      post: `/users/${userId}/competitions`,
      patch: `/users/${userId}/competitions/${competition?.id}`,
      delete: `/users/${userId}/competitions/${competition?.id}`,
    },
    setCompetitionInfo,
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
      return formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  const items = {
    type: [
      { label: "TRA", value: "TRA" },
      { label: "DMT", value: "DMT" },
      { label: "TUM", value: "TUM" },
    ],
    team_routines: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
    ],
    panels: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
    ],
    num_e: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6", value: "6" },
    ],
  };

  return (
    <Stack w="100%">
      <Text color="red">{errors?.message}</Text>
      <form action={formAction}>
        <RadioField
          type="text"
          name="type"
          label="種別"
          defaultValue={
            state?.type
              ? state.type
              : competition?.type
              ? competition.type
              : "TRA"
          }
          items={items.type}
          errorText={errors?.type}
          required
        />
        <HStack>
          {Object.entries({ name: "大会名", venue: "会場" }).map(
            ([key, label]) => (
              <InputField
                type="text"
                key={key}
                name={key}
                label={label}
                defaultValue={state?.[key] ? state[key] : competition?.[key]}
                errorText={errors?.[key]}
                required
              />
            )
          )}
        </HStack>

        <HStack>
          {Object.entries({ date_from: "開始日", date_to: "終了日" }).map(
            ([key, label]) => (
              <InputField
                type="date"
                key={key}
                name={key}
                label={label}
                defaultValue={state?.[key] ? state[key] : competition?.[key]}
                errorText={errors?.[key]}
                required
              />
            )
          )}
        </HStack>
        <HStack>
          {Object.entries({ panels: "パネル数", num_e: "E審判数" }).map(
            ([key, label]) => (
              <RadioField
                type="date"
                key={key}
                name={key}
                label={label}
                items={items[key]}
                defaultValue={
                  state?.[key]
                    ? state[key]
                    : competition?.[key]
                    ? competition[key]
                    : "1"
                }
                errorText={errors?.[key]}
                required
              />
            )
          )}
        </HStack>
        <HStack mt="2">
          <RadioField
            type="text"
            name="team_routines"
            label="団体競技に含む試技数"
            defaultValue={
              state?.team_routines
                ? state.team_routines
                : competition?.team_routines
                ? competition.team_routines
                : "TRA"
            }
            items={items.team_routines}
            errorText={errors?.team_routines}
            required
          />
          <CheckboxField
            label="団体競技をカテゴリーごとに行う"
            name="team_by_cat"
            defaultChecked={
              state?.team_by_cat
                ? !!state.team_by_cat
                : !!competition?.team_by_cat
            }
          />
        </HStack>

        <HStack gap="1" mt="2">
          <Box w="100%">
            <Text>端末で操作する得点</Text>
          </Box>
          {Object.entries({ read_d: "D", read_h: "H", read_t: "T" }).map(
            ([key, label]) => (
              <CheckboxField
                label={label}
                key={key}
                name={key}
                defaultChecked={
                  state?.[key] ? !!state[key] : !!competition?.[key]
                }
              />
            )
          )}
        </HStack>
        <HStack gap="1">
          <Box w="100%">
            <Text>種目ごとに得点を入力</Text>
          </Box>
          {Object.entries({ full_d: "D", full_h: "H", full_t: "T" }).map(
            ([key, label]) => (
              <CheckboxField
                label={label}
                key={key}
                name={key}
                defaultChecked={
                  state?.[key] ? !!state[key] : !!competition?.[key]
                }
              />
            )
          )}
        </HStack>
        <InputField
          type="password"
          label="審判用ログインパスワード"
          name="judge_password"
          defaultValue={
            state?.judge_password
              ? state.judge_password
              : competition?.judge_password
          }
          errorText={errors?.judge_password}
        />
        <Flex justifyContent="end" p="2">
          {competition ? (
            <HStack gap="2">
              <SubmitButton
                label="Update"
                value="update"
                disabled={isPending}
              />
              <SubmitButton
                label="Delete"
                value="delete"
                disabled={isPending}
              />
            </HStack>
          ) : (
            <SubmitButton label="Create" value="create" disabled={isPending} />
          )}
        </Flex>
      </form>
    </Stack>
  );
};

export default CompetitionInfoForm;
