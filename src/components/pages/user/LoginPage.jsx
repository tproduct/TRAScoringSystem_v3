import { Stack } from "@chakra-ui/react";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState } from "react";

const LoginPage = () => {
  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      const requestData = {
        email: formData.get("email"),
        password: formData.get("password"),
      };
      // const result = await updateUser(requestData);
      console.log(requestData)
      return requestData;
    },
    { email: "", password: "" }
  );

  return (
    <Stack w="100%">
      <form action={formAction}>
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
        <SubmitButton label="Login"/>
      </form>
    </Stack>
  );
};

export default LoginPage;
