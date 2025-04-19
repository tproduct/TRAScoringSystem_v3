import CustomSelect from "@parts/CustomSelect";

const SelectJudge = ({ numE, handler }) => {
  const items = Array(numE).fill(0).reduce((acc, val, index) => {
    return [
      ...acc,
      { label: `E${index+1}`, value: `e${index+1}` }
    ]
  }, [
    { label: "Diff", value: "diff" },
    { label: "Time", value: "time" },
    { label: "HD", value: "hd" },
  ])

  const selectJudgeItems = {
    title: "審判選択",
    items,
  };

  return (
    <CustomSelect
      contents={selectJudgeItems}
      width="100px"
      handler={handler}
      defaultValue="diff"
    />
  );
};

export default SelectJudge;
