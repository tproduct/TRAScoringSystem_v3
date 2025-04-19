import CustomSelect from "@parts/CustomSelect";
import { useSelector } from "react-redux";

const SelectCategory = ({ handler }) => {
  const { categories } = useSelector((state) => state.competition);
  const items = categories.map(({ id, name }) => ({ label: name, value: id }));

  const selectCategoryItems = {
    title: "カテゴリー",
    key: "category",
    items
  };

  return (
    <CustomSelect
      contents={selectCategoryItems}
      width="100px"
      handler={handler}
      defaultValue={categories[0].id}
    />
  );
};

export default SelectCategory;
