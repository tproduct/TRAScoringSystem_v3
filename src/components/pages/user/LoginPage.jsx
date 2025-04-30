import { Box, Button, Center, Flex, Heading, Stack } from "@chakra-ui/react";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { login } from "@store/userSlice";
import { useForm } from "@hooks/useForm";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const { createDefaultState, formAsyncAction } = useForm(
    ["email", "password"],
    { post: "/login" },
    login,
    setErrors,
    () => {
      navigate("/system/user/home/");
    }
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  return (
    <Center h="100svh">
      <Stack layerStyle="boxThird">
        <Heading>TRA ScoringSystem V3</Heading>
        <form action={formAction}>
          <Stack gap="2">
            <InputField
              type="text"
              name="email"
              label="Email"
              defaultValue={state.email}
              errorText=""
              required
            />
            <InputField
              type="password"
              name="password"
              label="Password"
              defaultValue={state.password}
              errorText=""
              required
            />
            <Button
              type="submit"
              bg="myBlue.800"
              color="white"
              name="button"
              value="post"
            >
              Login
            </Button>
          </Stack>
        </form>
        <Flex>
          アカウントをお持ちでない方は<Link to="/signup/">こちら</Link>
        </Flex>
      </Stack>
    </Center>
  );
};

export default LoginPage;
