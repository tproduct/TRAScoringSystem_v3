import { Box, Flex, Text } from "@chakra-ui/react";
import BaseDrawer from "@parts/BaseDrawer";
import CategoryForm from "@parts/formpages/CategoryForm";
import { category_desc } from "@descriptions/category_desc";
import Alert from "@parts/Alert";
import { useSelector } from "react-redux";

const CategoryPage = () => {
  const competitionInfo = useSelector((state) => state.competition.info);

  if (!competitionInfo ) return <Alert message="大会情報を設定してください" />;
  return (
    <Box>
      <Flex alignItems="center">
        <Text textStyle="title">カテゴリー設定</Text>
        <BaseDrawer description={category_desc} />
      </Flex>
      <CategoryForm />
    </Box>
  );
};

export default CategoryPage;
