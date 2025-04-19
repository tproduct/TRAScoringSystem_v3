import { Heading, HStack, Image, Stack } from "@chakra-ui/react";

const ResultTitle = ({ competitionInfo }) => {
  const dateFrom = competitionInfo
    ? competitionInfo.date_from.split("-")
    : ["yyyy", "mm", "dd"];
  const dateTo = competitionInfo
    ? competitionInfo.date_to.split("-")
    : ["yyyy", "mm", "dd"];

  return (
    <HStack mb="2">
      <Image src="/src/images/logo.png" w="70px" />
      <Stack ml="10">
        <Heading size="2xl">{competitionInfo?.name}</Heading>
        <Heading size="lg">{`${dateFrom[0]}/${dateFrom[1]}/${dateFrom[2]}${
          dateFrom[2] === dateTo[2] ? "" : `-${dateTo[1]}/${dateTo[2]}`
        }`}</Heading>
      </Stack>
    </HStack>
  );
};

export default ResultTitle;
