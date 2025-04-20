import { Box, Flex, Stack, Textarea } from "@chakra-ui/react";
import { useForm } from "@hooks/useForm";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { useSelector } from "react-redux";

const MessageForm = () => {
  const [errors, setErrors] = useState(null);
  const userId = useSelector(state => state.user.info.id)

  const { createDefaultState, formAsyncAction } = useForm(
    ["user_id","title", "message"],
    { post: `/messages` },
    null,
    setErrors
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  return (
    <form action={formAction}>
      <Stack layerStyle="boxSingle" gap="2">
        <input type="hidden" defaultValue={userId} name="user_id" />

        <InputField label="タイトル（５０文字以内）" name="title" />
        <Stack>
          <label htmlFor="message">本文（５００文字以内）</label>
          <Textarea name="message" id="message" rows="5" cols="100" />
        </Stack>
        <Flex justifyContent="end">
          <SubmitButton label="POST" value="create" />
        </Flex>
      </Stack>
    </form>
  );
};

export default MessageForm;
