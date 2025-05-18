import {
  Box,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "@hooks/useForm";
import MessageSubmitButton from "@parts/formparts/MessageSubmitButton";
import { useActionState, useState } from "react";
import { useSelector } from "react-redux";
import EditButton from "@parts/formparts/EditButton";

const MessageForm = ({ threadId, reply, fetchAllMessages }) => {
  const [errors, setErrors] = useState(null);
  const [isEditting, setIsEditting] = useState(false);
  const userId = useSelector((state) => state.user.info.id);

  const fields = reply ? ["message"] : ["thread_id", "user_id", "message"];

  const { createDefaultState, formAsyncAction } = useForm(
    fields,
    {
      post: `/users/${userId}/threads/${threadId}/messages`,
      patch: `/users/${userId}/threads/${threadId}/messages/${reply?.id}`,
      delete: `/users/${userId}/threads/${threadId}/messages/${reply?.id}`,
    },
    null,
    setErrors,
    () => {
      setIsEditting(false);
      fetchAllMessages();
    }
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  const isMyMessage = userId === reply?.user_id;

  return reply ? (
    <form action={formAction}>
      <Stack gap="2" mt="2" borderBottom="1px solid" p="2">
        <HStack>
          <Text>{reply.name}</Text>
          <Text>{reply.created_at}</Text>
          {reply.created_at !== reply.updated_at && (
            <Text>({reply.updated_at}更新)</Text>
          )}
        </HStack>
        {isMyMessage ? (
          <HStack>
            {isEditting ? (
              <Input name="message" defaultValue={reply.message} />
            ) : (
              <Text>{reply.message}</Text>
            )}
            <EditButton isEditting={isEditting} setIsEditting={setIsEditting} />
            {isEditting && <MessageSubmitButton value="update" />}
            <MessageSubmitButton value="delete" />
          </HStack>
        ) : (
          <Text>{reply.message}</Text>
        )}
      </Stack>
    </form>
  ) : (
    <form action={formAction}>
      <Stack gap="2" mt="2" p="2">
        <input type="hidden" defaultValue={userId} name="user_id" />
        <input type="hidden" defaultValue={threadId} name="thread_id" />
        <HStack>
          <Input placeholder="返信" name="message" />
          <MessageSubmitButton value="create" />
        </HStack>
      </Stack>
    </form>
  );
};

export default MessageForm;
