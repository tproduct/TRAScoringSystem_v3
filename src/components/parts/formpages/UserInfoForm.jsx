import { Heading, HStack, Stack, Text } from "@chakra-ui/react";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { useForm } from "@hooks/useForm";
import { useSelector } from "react-redux";
import { setUser } from "@store/userSlice";

const UserInfoForm = () => {
  const [errors, setErrors] = useState(null);
  const user = useSelector((state) => state.user.info);

  const fields = user
    ? {
        name: "氏名",
        email: "E-Mail",
        organization: "団体名",
      }
    : {
        name: "氏名",
        email: "E-Mail",
        organization: "団体名",
        password: "password",
      };
  const { createDefaultState, formAsyncAction } = useForm(
    Object.keys(fields),
    { post: "/users", patch: `/users/${user.id}`, delete: `/users/${user.id}` },
    setUser,
    setErrors
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  return (
    <Stack w="100%" h="100svh" gap="1">
            <Text color="red">{errors?.message}</Text>
      <Text textStyle="title">ユーザー情報</Text>
      <form action={formAction}>
        {Object.entries(fields).map(([key, label]) => {
          return key !== "password" ? (
            <InputField
              type="text"
              key={key}
              name={key}
              label={label}
              defaultValue={state[key] ? state[key] : user?.[key]}
              errorText={errors?.[key]}
            />
          ) : (
            <InputField
              type="password"
              name={key}
              label={label}
              defaultValue={state[key] ? state[key] : user?.[key]}
              errorText={errors?.[key]}
            />
          );
        })}

        {user ? (
          <HStack mt="2">
            <SubmitButton label="Update" value="update" disabled={isPending} />
            <SubmitButton label="Delete" value="delete" disabled={isPending} />
          </HStack>
        ) : (
          // <SubmitButton label="Create" value="create" disabled={isPending} />
          <SubmitButton label="Create" value="create" disabled={isPending} />
        )}
      </form>
    </Stack>
  );
};

export default UserInfoForm;
