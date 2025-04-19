import CustomSelect from "@parts/CustomSelect";

const SelectGender = ({ handler, defaultValue = "men", name, width="100px" }) => {
  const selectGenderItems = {
    title: "性別",
    key: "gender",
    items: [
      { label: "男子", value: "men" },
      { label: "女子", value: "women" },
      { label: "混合", value: "mix" },
    ],
  };

  return (
    <CustomSelect
      contents={selectGenderItems}
      width={width}
      handler={handler}
      defaultValue={defaultValue}
      name={name}
    />
  );
};

export default SelectGender;
