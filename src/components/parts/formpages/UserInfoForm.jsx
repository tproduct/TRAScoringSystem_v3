import { Box, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { useForm } from "@hooks/useForm";
import { useSelector } from "react-redux";
import { setUser } from "@store/userSlice";
import { useNavigate } from "react-router-dom";
import { toaster } from "@ui/toaster";

const UserInfoForm = () => {
  const [errors, setErrors] = useState(null);
  const user = useSelector((state) => state.user.info);
  const navigate = useNavigate();

  const fields = !!user
    ? {
        name: "氏名",
        email: "E-Mail",
        organization: "団体名",
      }
    : {
        name: "氏名",
        email: "E-Mail",
        organization: "団体名",
        password:
          "パスワード（半角英数字８文字以上（大文字、数字各１文字以上））",
        confirm: "確認用パスワード",
        inviteCode: "招待コード",
      };
  const { createDefaultState, formAsyncAction } = useForm(
    Object.keys(fields),
    {
      post: "/users",
      patch: `/users/${user?.id}`,
      delete: `/users/${user?.id}`,
    },
    setUser,
    setErrors,
    () => {
      if(!!user) return;
      navigate("/login/");
    }
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  return (
    <Stack w="100%" h="100svh" gap="2" p="5">
      <Text color="red">{errors?.message}</Text>
      <Text textStyle="title">ユーザー{!!user ? "情報" : "登録"}</Text>
      <form action={formAction}>
        {Object.entries(fields).map(([key, label]) => {
          return key !== "password" && key !== "confirm" ? (
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
              key={key}
              name={key}
              label={label}
              defaultValue={state[key] ? state[key] : user?.[key]}
              errorText={errors?.[key]}
            />
          );
        })}

        {!!user ? (
          <HStack mt="2">
            <SubmitButton label="Update" value="update" disabled={isPending} />
            <SubmitButton label="Delete" value="delete" disabled={isPending} />
          </HStack>
        ) : (
          <Box mt="2">
            <SubmitButton label="Create" value="create" disabled={isPending} />
          </Box>
        )}
      </form>
    </Stack>
  );
};

export default UserInfoForm;
