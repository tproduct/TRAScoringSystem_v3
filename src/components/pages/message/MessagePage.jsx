import { Stack } from "@chakra-ui/react";
import { useApiRequest } from "@hooks/useApiRequest";
import ThreadForm from "@parts/formpages/ThreadForm";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MessagePage = () => {
  const [threads, setThreads] = useState(null);
  const userId = useSelector(state => state.user.info.id);

  const fetchAllMessages = async () => {
    const getAll = useApiRequest(`/users/${userId}/threads`).get;
    const response = await getAll();

    if (response.status === "success") setThreads(response.data);
  };

  useEffect(() => {
    fetchAllMessages();
  }, []);

  return (
    <Stack w="100%" h="100svh" p="5" overflow="auto">
      <ThreadForm fetchAllMessages={fetchAllMessages}/>
      {!!threads &&
        Object.entries(threads)?.map(([threadId, contents]) => (
          <ThreadForm contents={contents} key={threadId} fetchAllMessages={fetchAllMessages}/>
        ))}
    </Stack>
  );
};

export default MessagePage;
