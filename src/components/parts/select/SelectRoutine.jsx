import CustomSelect from "@parts/CustomSelect";

const SelectRoutine = ({ routines, handler }) => {
  const items = [];

  for (let i = 0; i < Number(routines); i++) {
    items.push({ label: i + 1 + "本目", value: i + 1 });
  }

  const selectRoutineItems = {
    title: "試技",
    key: "routine",
    items
  };

  return (
    <CustomSelect
      contents={selectRoutineItems}
      width="100px"
      handler={handler}
      defaultValue={1}
    />
  );
};

export default SelectRoutine;
