import {
  GridItem,
  SimpleGrid,
  Text,
  Box,
  Flex,
  Spacer,
  IconButton,
  Stack,
  Heading,
  Image,
  HStack,
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
import BaseDrawer from "@parts/BaseDrawer";
import { dashboard_desc } from "@descriptions/dashboard_desc";
import LinkDialog from "@parts/LinkDialog";

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

  useEffect(() => {
    fetchCompetitionIds();
    fetchThreads();
    fetchNotices();
  }, []);

  const fetchCompetitionIds = async () => {
    const response = await getCompetitions();
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
    alert: "red",
  };

  return (
    <Stack overflow="auto" w="100%" p="2">
      <HStack gap="2" flexWrap="wrap">
        <Image src="/src/images/logo.png" w="30px" />
        <Heading size="3xl">TRA ScoringSystem ver3.0.0-beta-5</Heading>
        <BaseDrawer description={dashboard_desc} />
        {user?.info.role === "admin" && (
          <Text
            onClick={() => {
              navigate("/admin/");
            }}
            color="blue"
            style={{ cursor: "pointer" }}
          >
            管理ページへ
          </Text>
        )}
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" h="auto" w="100%">
        <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 3 }} m="1">
          <SimpleGrid gap="20px">
            <GridItem>
              <Text>Notice</Text>
              <Stack layerStyle="userHomeContainer">
                {notices?.length ? (
                  notices.map((notice) => (
                    <Text key={notice.id} color={noticeColor[notice.type]}>
                      {notice.message}
                    </Text>
                  ))
                ) : (
                  <Text>お知らせはありません</Text>
                )}
              </Stack>
            </GridItem>
            <GridItem>
              <Text
                onClick={() => {
                  navigate("/system/message/");
                }}
                color="blue"
                style={{ cursor: "pointer" }}
              >
                Open Messages
              </Text>

              <Stack layerStyle="userHomeContainer" gap="1" p="2">
                {!!threads &&
                  Object.entries(threads).map(([key, contents], index) => {
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
        <GridItem colSpan={{ base: 1, md: 2 }} rowSpan={{ base: 1, md: 3 }} m="1">
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
                <LinkDialog linkType="judge" competitionId={competition.id} />
              </Flex>
            ))}
            <br />
            <AddButton
              label="Competition"
              handler={handleAdd}
              layerStyle="boxSingle"
            />
          </Box>
        </GridItem>
      </SimpleGrid>
    </Stack>
  );
};

export default Dashboard;
