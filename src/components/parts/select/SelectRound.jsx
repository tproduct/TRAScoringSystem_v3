import CustomSelect from "@parts/CustomSelect";

const SelectRound = ({ rounds, defaultValue = "qualify", handler }) => {
  const items = [{ label: "決勝", value: "final" }];
  if( Number(rounds) > 2 ) items.unshift({ label: "予選2", value: "semifinal" });
  if( Number(rounds) > 1 ) items.unshift({ label: "予選1", value: "qualify" });
  
  const selectRoundItems = {
    title: "ラウンド",
    key: "round",
    items
  };

  return (
    <CustomSelect
      contents={selectRoundItems}
      width="100px"
      handler={handler}
      defaultValue={defaultValue}
    />
  );
};

export default SelectRound;
