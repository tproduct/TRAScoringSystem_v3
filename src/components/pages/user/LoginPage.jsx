import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  Switch,
} from "@chakra-ui/react";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { login } from "@store/userSlice";
import { useForm } from "@hooks/useForm";
import { Link, useNavigate, useParams } from "react-router-dom";

const LoginPage = () => {
  const {competitionId} = useParams();
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const fields = competitionId ? ["competitionId", "password"] : ["email", "password"];
  const endpoint = competitionId ? { post: "/login/judge" } : { post: "/login" };

  const { createDefaultState, formAsyncAction } = useForm(
    fields,
    endpoint,
    login,
    setErrors,
    () => {
      competitionId ? navigate(`/judge/${competitionId}/`) : navigate("/system/user/home/");
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
      <Stack layerStyle="boxHalf" p="5">
        <Heading>TRA ScoringSystem V3</Heading>
        <form action={formAction}>
          <Stack gap="2">
            <InputField
              type="text"
              name={competitionId ? "competitionId" : "email"}
              label={competitionId ? "大会ID" : "Email"}
              defaultValue={competitionId ? competitionId : ""}
              errorText=""
              required
            />
            <InputField
              type="password"
              name="password"
              label="Password"
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
