import { Heading, HStack, Stack, Image, Text, Table } from "@chakra-ui/react";
import { useApiRequest } from "@hooks/useApiRequest";
import { useCompetition } from "@hooks/useCompetition";
import ResultTitle from "@parts/result/ResultTitle";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { typeLabels, genderLabels, roundLabels } from "@libs/constants";

const StartListPage = () => {
  const { competitionId, type, gender, categoryId, round } = useParams();
  const userId = useSelector((state) => state.user.info.id);
  const { competition, fetchCompetition } = useCompetition(competitionId);

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
    fetchCompetition();
  }, []);

  const fetchOrder = async () => {
    const getOrder = useApiRequest(
      `users/${userId}/competitions/${competitionId}/orders/${type}/${gender}/${categoryId}/${round}`
    ).get;

    const response = await getOrder();
    if (response.status === "success") setOrder(response.data);
  };

  console.log(order);

  return (
    <Stack p="2">
      <ResultTitle competitionInfo={competition?.info} />
      <Heading size="2xl">
        {`${typeLabels[type]}${genderLabels[gender]}${
          competition?.categories.find((category) => category.id === categoryId)
            ?.name
        }${roundLabels[round]}`}
        スタートリスト
      </Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Gr</Table.ColumnHeader>
            <Table.ColumnHeader>No</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Team</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </Stack>
  );
};

export default StartListPage;
