import { Stack } from "@chakra-ui/react";
import { useApiRequest } from "@hooks/useApiRequest";
import ThreadForm from "@parts/formpages/ThreadForm";
import { useEffect, useState } from "react";

const MessagePage = () => {
  const [threads, setThreads] = useState(null);

  const fetchAllMessages = async () => {
    const getAll = useApiRequest(`/threads`).get;
    const response = await getAll();

    if (response.status === "success") setThreads(response.data);
  };

  useEffect(() => {
    fetchAllMessages();
  }, []);

  return (
    <Stack w="95svw" h="100svh" p="5" overflow="auto">
      <ThreadForm />
      {!!threads &&
        Object.entries(threads)?.map(([threadId, contents]) => (
          <ThreadForm contents={contents} key={threadId} setThreads={setThreads}/>
        ))}
    </Stack>
  );
};

export default MessagePage;
