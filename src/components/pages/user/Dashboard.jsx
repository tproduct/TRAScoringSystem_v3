import {
  GridItem,
  SimpleGrid,
  Text,
  Box,
  Flex,
  Spacer,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { useApiRequest } from "@hooks/useApiRequest";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiDatabase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { setCompetition, resetCompetition } from "@store/competitionSlice";
import AddButton from "@parts/AddButton";
import { LuMonitor } from "react-icons/lu";

import { PiGearSixBold } from "react-icons/pi";
import { FaRegNewspaper } from "react-icons/fa";

const Dashboard = () => {
  const [competitions, setCompetitions] = useState(null);
  const [threads, setThreads] = useState(null);
  const [notices, setNotices] = useState(null);
  const user = useSelector((state) => state.user);
  const userId = useSelector((state) => state.user.info.id);
  const getCompetitions = useApiRequest(`users/${userId}/competitions`).get;
  const getThreads = useApiRequest(`users/${userId}/threads`).get;
  const getNotices = useApiRequest("notices").get;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(user)

  useEffect(() => {
    fetchCompetitionIds();
    fetchThreads();
    fetchNotices();
  }, []);

  const fetchCompetitionIds = async () => {
    const response = await getCompetitions();
    console.log(response)
    if (response.status === "success") setCompetitions(response.data);
  };

  const fetchThreads = async () => {
    const response = await getThreads();
    if (response.status === "success") setThreads(response.data);
  };

  const fetchNotices = async () => {
    const response = await getNotices();
    if (response.status === "success") setNotices(response.data);
  };

  const fetchCompetition = async (competitionId) => {
    const getCompetition = useApiRequest(`/competitions/${competitionId}`).get;

    const response = await getCompetition();
    if (response.status === "success") return response.data;
  };

  const handleIconClick = async (competitionId, type) => {
    const competition = await fetchCompetition(competitionId);
    dispatch(setCompetition(competition));
    navigate(`/system/${type}/`);
    setCompetitions(null);
  };

  const handleAdd = () => {
    dispatch(resetCompetition());
    navigate("/system/competition/");
    setCompetitions(null);
  };

  const noticeColor = {
    info: "black",
    warning: "green",
    alert: "red"
  }

  return (
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      rows={{ base: 3, md: 3 }}
      gap="6"
      h="100svh"
      w="90svw"
    >
      <GridItem colSpan={1} rowSpan={{ base: 1, md: 3 }}>
        <SimpleGrid gap="20px">
          <GridItem>
            <Text>Notice</Text>
            <Stack layerStyle="userHomeContainer">
              {!!notices && notices.map(notice => (
                <Text key={notice.id} color={noticeColor[notice.type]}>{notice.message}</Text>
              ))}
            </Stack>
          </GridItem>
          <GridItem>
            <a href="/system/message/">Open Messages</a>

            <Stack layerStyle="userHomeContainer" gap="1" p="2">
              {!!threads && Object.entries(threads).map(([key, contents], index) => {
                return (
                  index < 10 && (
                    <Text key={contents.thread.id}>
                      {contents.thread.title}
                    </Text>
                  )
                );
              })}
            </Stack>
          </GridItem>
        </SimpleGrid>
      </GridItem>
      <GridItem colSpan={{ base: 1, md: 2 }} rowSpan={{ base: 1, md: 3 }}>
        <Text>Your Competitions</Text>
        <Box layerStyle="userHomeContainer">
          {competitions?.map((competition) => (
            <Flex key={competition.id} justifyContent="flex-start">
              <Text
                _hover={{ color: "myBlue.400", cursor: "pointer" }}
                fontSize="16px"
                mt="2"
                onClick={() => {
                  handleIconClick(competition.id, "competition");
                }}
              >
                {competition.name}
              </Text>
              <Spacer />
              <IconButton
                bg="white"
                color="myBlue.800"
                onClick={() => {
                  handleIconClick(competition.id, "competition");
                }}
              >
                <PiGearSixBold />
              </IconButton>

              <IconButton
                bg="white"
                color="myBlue.800"
                onClick={() => {
                  handleIconClick(competition.id, "score");
                }}
              >
                <FiDatabase />
              </IconButton>

              <IconButton
                bg="white"
                color="myBlue.800"
                onClick={() => {
                  handleIconClick(competition.id, "result");
                }}
              >
                <FaRegNewspaper />
              </IconButton>

              <IconButton
                bg="white"
                color="myBlue.800"
                onClick={() => {
                  handleIconClick(competition.id, "monitor");
                }}
              >
                <LuMonitor />
              </IconButton>
            </Flex>
          ))}
          <AddButton
            label="Competition"
            handler={handleAdd}
            layerStyle="boxSingle"
          />
        </Box>
      </GridItem>
    </SimpleGrid>
  );
};

export default Dashboard;
