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
import { useApiRequest } from "@hooks/useApiRequest";
import { useForm } from "@hooks/useForm";
import InputField from "@parts/formparts/InputField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { useSelector } from "react-redux";

const ThreadForm = ({ contents, setThreads }) => {
  const [errors, setErrors] = useState(null);
  const userId = useSelector((state) => state.user.info.id);

  const { createDefaultState, formAsyncAction } = useForm(
    ["title", "message"],
    { post: `/threads`, patch: `/threads/${contents?.thread.id}`, delete: `/threads/${contents?.thread.id}` },
    null,
    setErrors
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  const handleSubmit = async () => {
    await fetchAllMessages();
  }

  const fetchAllMessages = async () => {
      const getAll = useApiRequest(`/threads`).get;
      const response = await getAll();
  
      if (response.status === "success") setThreads(response.data);
    };

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
            <Heading size="2xl">{contents.thread.title}</Heading>
          )}
          <Spacer />
          <Text>{contents.thread.name}</Text>
          /投稿:
          <Text>{contents.thread.created_at}</Text>
          {contents.thread.created_at !== contents.thread.updated_at && (
            <>
              更新:
              <Text>{contents.thread.updated_at}</Text>
            </>
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
        {contents.replies.map((reply) => (
          <Box key={reply.id} p="2">
            <Text>{reply.name}</Text>
            <p>{reply.message}</p>
          </Box>
        ))}
        {isMyThread && (
          <Flex justifyContent="end">
            <HStack gap="2">
              <SubmitButton label="Update" value="update"/>
              <SubmitButton label="Delete" value="delete"/>
            </HStack>
          </Flex>
        )}
      </form>
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
          <SubmitButton label="POST" value="create" />
        </Flex>
      </Stack>
    </form>
  );
};

export default ThreadForm;
