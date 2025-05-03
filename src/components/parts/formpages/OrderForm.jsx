import { Center, Flex, Stack, Table } from "@chakra-ui/react";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useState } from "react";
import { useForm } from "@hooks/useForm";
import CheckboxField from "@parts/formparts/CheckboxField";
import { useSelector } from "react-redux";
import { flattenArray } from "@libs/helper";
import { setOrders } from "@store/competitionSlice";
import { roundLabels } from "@libs/constants";

const OrderForm = () => {
  const [errors, setErrors] = useState([]);
  const userId = useSelector((state) => state.user.info.id);
  const competitionId = useSelector((state) => state.competition.info.id);
  const categories = useSelector((state) => state.competition.categories);
  const rules = useSelector((state) => state.competition.rules);

  const formNames = flattenArray(
    categories.map((category) => {
      return Object.keys(rules).map((round) => `${category.id}-${round}`);
    })
  );

  const { createDefaultState, formAsyncAction } = useForm(
    formNames,
    {
      post: `/users/${userId}/competitions/${competitionId}/orders`,
    },
    setOrders,
    setErrors
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      return await formAsyncAction(prev, formData);
    },
    createDefaultState()
  );

  return (
    <Stack w="100%">
      <form action={formAction}>
        <Table.Root variant="outline">
          <Table.Body>
            {categories.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell textAlign="center">{category.name}</Table.Cell>
                {Object.keys(rules).map((round) => (
                  <Table.Cell key={category + round} textAlign="center">
                    {rules[round]?.find(
                      (rule) => rule.category_id === category.id
                    ) ? (
                        <CheckboxField name={`${category.id}-${round}`} label={roundLabels[round]}/>
                    ) : (
                      ""
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Flex justifyContent="end" m="5">
          <SubmitButton label="確定" value="sync" />
        </Flex>
      </form>
    </Stack>
  );
};

export default OrderForm;
