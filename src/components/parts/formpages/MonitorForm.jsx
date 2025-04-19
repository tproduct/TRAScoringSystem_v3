import { Box, Flex, HStack, Spacer, Stack, Text } from "@chakra-ui/react";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { useForm } from "@hooks/useForm";
import { useSelector } from "react-redux";
import { setMonitor } from "@store/userSlice";

const MonitorForm = () => {
  const [errors, setErrors] = useState(null);
  const userId = useSelector((state) => state.user.info.id);
  const monitor = useSelector((state) => state.user.monitor);
  const { createDefaultState, formAsyncAction } = useForm(
    [
      "switch_time",
      "interval_time",
      "group_size",
    ],
    {
      post: `/users/${userId}/monitors`,
      patch: `/users/${userId}/monitors/${monitor?.id}`,
    },
    setMonitor,
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

  return (
    <Stack w="100%">
      <Text color="red">{errors?.message}</Text>
      <form action={formAction}>
        <HStack>
          {Object.entries({ switch_time:"得点表示時間（順位表に切り替えるまでの時間）", interval_time: "順位表示時間", group_size: "順位表示人数" }).map(
            ([key, label]) => (
              <InputField
                type="text"
                key={key}
                name={key}
                label={label}
                defaultValue={state?.[key] ? state[key] : monitor?.[key]}
                errorText={errors?.[key]}
                required
              />
            )
          )}
        </HStack>

        <Flex justifyContent="end" p="2">
          {monitor ? (
            <HStack gap="2">
              <SubmitButton
                label="Update"
                value="update"
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

export default MonitorForm;
