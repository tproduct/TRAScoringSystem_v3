import {
  Box,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "@hooks/useForm";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { useSelector } from "react-redux";
import MessageForm from "./MessageForm";
import MessageSubmitButton from "@parts/formparts/MessageSubmitButton";

const ThreadForm = ({ contents, fetchAllMessages }) => {
  const [errors, setErrors] = useState(null);
  const userId = useSelector((state) => state.user.info.id);

  const fields = contents
    ? ["title", "message"]
    : ["user_id", "title", "message"];

  const { createDefaultState, formAsyncAction } = useForm(
    fields,
    {
      post: `/users/${userId}/threads`,
      patch: `/users/${userId}/threads/${contents?.thread.id}`,
      delete: `/users/${userId}/threads/${contents?.thread.id}`,
    },
    null,
    setErrors,
    fetchAllMessages
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  const isMyThread = contents?.thread.user_id === userId;

  return contents ? (
    <Box layerStyle="boxSingle">
      <form action={formAction}>
        <Flex alignItems="center" justifyContent="space-between">
          {isMyThread ? (
            <input
              name="title"
              defaultValue={contents.thread.title}
              style={{ fontSize: "24px", fontWeight: "bold" }}
            />
          ) : (
            <Heading>{contents.thread.title}</Heading>
          )}
          <Text>{contents.thread.name}</Text>
          <Spacer />

          <Text>{contents.thread.created_at}投稿</Text>
          {contents.thread.created_at !== contents.thread.updated_at && (
              <Text>({contents.thread.updated_at}更新)</Text>
          )}
        </Flex>
        {isMyThread ? (
          <Textarea
            name="message"
            id="message"
            rows="5"
            cols="100"
            defaultValue={contents.thread.message}
          />
        ) : (
          <Box layerStyle="boxSingle">{contents.thread.message}</Box>
        )}

        {isMyThread && (
          <Flex justifyContent="end">
            <HStack gap="2">
              <MessageSubmitButton value="update" />
              <MessageSubmitButton value="delete" />
            </HStack>
          </Flex>
        )}
      </form>
      {contents.replies.map((reply) => (
        <MessageForm reply={reply} key={reply.id} threadId={contents.thread.id} fetchAllMessages={fetchAllMessages}/>
      ))}
      <MessageForm threadId={contents.thread.id} fetchAllMessages={fetchAllMessages}/>
    </Box>
  ) : (
    <form action={formAction}>
      <Stack layerStyle="boxSingle" gap="2">
        <input type="hidden" defaultValue={userId} name="user_id" />

        <InputField label="タイトル（５０文字以内）" name="title" />
        <Stack>
          <label htmlFor="message">本文（５００文字以内）</label>
          <Textarea name="message" id="message" rows="5" cols="100" />
        </Stack>
        <Flex justifyContent="end">
          <MessageSubmitButton value="create" />
        </Flex>
      </Stack>
    </form>
  );
};

export default ThreadForm;
