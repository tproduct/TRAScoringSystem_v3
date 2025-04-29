import CustomSelect from "@parts/CustomSelect";
import { useSelector } from "react-redux";

const SelectPanel = ({ panels = 2, handler, color, bg }) => {
  const panelLabels = ["A", "B", "C"];
  const items = Array(Number(panels)).fill(0).map((value, index) => ({ label: "panel" + panelLabels[index], value: panelLabels[index] }));
  const selectPanelItems = {
    title: "パネル",
    key: "panel",
    items
  };

  return (
    <CustomSelect
      contents={selectPanelItems}
      width="120px"
      handler={handler}
      defaultValue="A"
      bg={bg}
      color={color}
    />
  );
};

export default SelectPanel;
