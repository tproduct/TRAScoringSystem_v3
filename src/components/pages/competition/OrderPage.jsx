import { isConfigIncomplete, isNullObject } from "@libs/helper";
import OrderForm from "@parts/formpages/OrderForm";
import { useSelector } from "react-redux";
import Alert from "@parts/Alert";
import { Box, Flex, Text } from "@chakra-ui/react";
import BaseDrawer from "@parts/BaseDrawer";
import { order_desc } from "@descriptions/order_desc";
import StartListLinks from "../startlist/StartListLinks";

const OrderPage = () => {
  const categories = useSelector((state) => state.competition.categories);
  const rules = useSelector((state) => state.competition.rules);
  const routines = useSelector((state) => state.competition.routines);
  const players = useSelector((state) => state.competition.players);

  if (!categories) return <Alert message="カテゴリーを設定してください" />;
  if (isConfigIncomplete(categories, rules))
    return <Alert message="ルールを設定してください" />;
  if (isConfigIncomplete(categories, routines, rules))
    return <Alert message="得点設定をしてください" />;
  // if(isNullObject(routines)) return <Alert message="得点設定をしてください" />;

  if (isNullObject(players)) return <Alert message="選手登録をしてください" />;

  return (
    <Box>
      <Flex alignItems="center">
        <Text textStyle="title">試技順設定</Text>
        <BaseDrawer description={order_desc} />
      </Flex>
      <p>
        試技順を設定するカテゴリーのラウンドにチェックを入れて「確定」を押してください
      </p>
      <br />
      <Box h={{ base: "40svh", md: "40svh" }} overflow="auto">
        <OrderForm />
      </Box>
      <Box h={{ base: "40svh", md: "50svh" }} overflow="auto">
        <StartListLinks />
      </Box>
    </Box>
  );
};

export default OrderPage;
