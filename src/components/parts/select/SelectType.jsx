import CustomSelect from "@parts/CustomSelect";

const SelectType = ({ handler }) => {
  const selectTypeItems = {
    title: "競技",
    key: "type",
    items: [
      { label: "個人", value: "individual" },
      { label: "シンクロ", value: "syncronized" },
    ],
  };

  return (
    <CustomSelect
      contents={selectTypeItems}
      width="100px"
      handler={handler}
      defaultValue="individual"
    />
  );
};

export default SelectType;
