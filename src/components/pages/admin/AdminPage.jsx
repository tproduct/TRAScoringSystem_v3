import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useApiRequest } from "@hooks/useApiRequest";
import LinkDialog from "@parts/LinkDialog";
import { useEffect, useState } from "react";
import { FaRegNewspaper } from "react-icons/fa";
import { FiDatabase } from "react-icons/fi";
import { LuMonitor } from "react-icons/lu";
import { PiGearSixBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCompetition } from "@store/competitionSlice";

const AdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [users, setUsers] = useState(null);
  const [competitions, setCompetitions] = useState(null);
  const user = useSelector((state) => state.user.info);
  if (user?.role !== "admin") return null;

  useEffect(() => {
    fetchAllUsers();
    fetchAllCompetitionIds();
  }, []);

  const fetchAllUsers = async () => {
    const { get } = useApiRequest(`/users/${user?.id}`);
    const response = await get();
    setUsers(response);
  };

  const fetchAllCompetitionIds = async () => {
    const { get } = useApiRequest(`/competitions/bulk/${user?.id}`);
    const response = await get();
    setCompetitions(response);
  };

  const handleIconClick = async (competitionId, type) => {
    const competition = await fetchCompetition(competitionId);
    dispatch(setCompetition(competition));
    navigate(`/system/${type}/`);
    setCompetitions(null);
  };

  const fetchCompetition = async (competitionId) => {
    const getCompetition = useApiRequest(`/competitions/${competitionId}`).get;

    const response = await getCompetition();
    if (response.status === "success") return response.data;
  };

  return (
    <Stack h="100svh" p="3">
      <Text
        onClick={() => {
          navigate("/system/user/home/");
        }}
        color="blue"
        style={{ cursor: "pointer" }}
      >
        HOME
      </Text>

      <HStack gap="1">
      <Box layerStyle="userHomeContainer" h="90svh" overflow="auto">
        <Heading>ログイン状況</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>User</Table.ColumnHeader>
              <Table.ColumnHeader>Last_login_at</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users?.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.last_login_at}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      <Box layerStyle="userHomeContainer" h="90svh" overflow="auto">
        <Heading>大会状況</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>大会名</Table.ColumnHeader>
              <Table.ColumnHeader>実施日</Table.ColumnHeader>
              <Table.ColumnHeader>ユーザー</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {competitions?.map((competition) => (
              <Table.Row key={competition.id}>
                <Table.Cell>
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
                </Table.Cell>
                <Table.Cell>{competition.date_from}</Table.Cell>
                <Table.Cell>
                  {users?.find((user) => user.id === competition.user_id)?.name}
                </Table.Cell>
                <Table.Cell>
                  <Flex justifyContent="flex-start">
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
                    <LinkDialog
                      linkType="judge"
                      competitionId={competition.id}
                    />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      </HStack>

    </Stack>
  );
};

export default AdminPage;
