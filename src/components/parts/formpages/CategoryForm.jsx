import { Box, Flex, Float, HStack, Stack, Text } from "@chakra-ui/react";
import InputField from "@parts/formparts/InputField";
import RadioField from "@parts/formparts/RadioField";
import SubmitButton from "@parts/formparts/SubmitButton";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "@hooks/useForm";
import CheckboxField from "@parts/formparts/CheckboxField";
import { useSelector } from "react-redux";
import { setCategories as setStoredCategories } from "@store/competitionSlice";
import AddButton from "@parts/AddButton";
import DeleteButton from "@parts/DeleteButton";
import BoxWithDeleteButton from "@parts/BoxWithDeleteButton";

const CategoryForm = () => {
  const [errors, setErrors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [willUpdate, setWillUpdate] = useState(false);
  const userId = useSelector((state) => state.user.info.id);
  const competitionId = useSelector((state) => state.competition.info.id);
  const registeredCategories = useSelector(
    (state) => state.competition.categories
  );

  const { createDefaultState, formAsyncAction, createRequestData } = useForm(
    ["id", "competition_id", "name", "rounds", "has_mix", "is_random"],
    {
      post: `/users/${userId}/competitions/${competitionId}/categories`,
      delete: `/users/${userId}/competitions/${competitionId}/categories`,
    },
    setStoredCategories,
    setErrors
  );

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      if (
        formData.get("button") === "delete" &&
        !window.confirm("削除すると元に戻せません。削除しますか？")
      ) {
        return prev;
      }
      setWillUpdate(false);
      return await formAsyncAction(prev, formData, categories);
    },
    createDefaultState(categories)
  );

  const items = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
  ];

  useEffect(() => {
    setCategories(registeredCategories ?? []);
  }, []);

  const handleDelete = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
    setWillUpdate(true);
  };

  const handleAdd = () => {
    setWillUpdate(true);
    setCategories((prev) => {
      return [...prev, { id: null, name: "", rounds: "1", has_mix: null }];
    });
  };

  return (
    <Stack w="100%" h={{base:"75svh", md:"80svh"}} overflow="auto">
      <Text color="red">{errors?.message}</Text>
      <Text color="red">{willUpdate ? "まだ更新されていません" : ""}</Text>

      <form action={formAction}>
        <Box display="flex" flexWrap="wrap" gap="1">
          {categories?.map((category, index) => (
            <BoxWithDeleteButton
              key={`${category.id}${index}`}
              layerStyle="boxThird"
              handler={() => {
                if(categories.length > 1) handleDelete(category.id);
              }}
            >
              <input
                type="hidden"
                name={`id${index}`}
                defaultValue={category.id}
              />
              <input
                type="hidden"
                name={`competition_id${index}`}
                defaultValue={competitionId}
              />
              <InputField
                type="text"
                name={`name${index}`}
                label="カテゴリー名"
                defaultValue={
                  state[index]?.name
                    ? state[index].name
                    : categories[index].name
                }
                errorText={errors ? errors[index]?.name : ""}
                required
              />
              <RadioField
                name={`rounds${index}`}
                label="ラウンド数"
                items={items}
                defaultValue={
                  state[index]?.rounds
                    ? state[index].rounds
                    : categories[index].rounds
                }
                errorText={errors ? errors[index]?.rounds : ""}
                required
              />
              <Flex mt="2">
                <CheckboxField
                  name={`has_mix${index}`}
                  label="男女混合"
                  defaultChecked={
                    state[index]?.has_mix
                      ? !!state[index].has_mix
                      : !!categories[index].has_mix
                  }
                />
              </Flex>
              <Flex mt="2">
                <CheckboxField
                  name={`is_random${index}`}
                  label="試技順抽選"
                  defaultChecked={
                    state[index]?.is_random
                      ? !!state[index].is_random
                      : !!categories[index].is_random
                  }
                />
              </Flex>
            </BoxWithDeleteButton>
          ))}

          <AddButton
            label="Category"
            handler={handleAdd}
            layerStyle="boxThird"
          />
        </Box>
        <Flex justifyContent="end" p="2">
          <HStack gap="2">
            <SubmitButton label="Update" value="sync" disabled={isPending} />
            <SubmitButton label="Delete" value="delete" disabled={isPending} />
          </HStack>
        </Flex>
      </form>
    </Stack>
  );
};

export default CategoryForm;
