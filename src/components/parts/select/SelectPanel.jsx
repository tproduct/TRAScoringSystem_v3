import CustomSelect from "@parts/CustomSelect";
import { useSelector } from "react-redux";

const SelectPanel = ({ handler }) => {
  const panels = useSelector((state) => state.competition.info.panels);
  const panelLabels = ["A", "B", "C"]
  const items = Array(Number(panels)).fill(0).map((value, index) => ({ label: panelLabels[index], value: panelLabels[index] }));
  const selectPanelItems = {
    title: "パネル",
    key: "panel",
    items
  };

  return (
    <CustomSelect
      contents={selectPanelItems}
      width="100px"
      handler={handler}
      defaultValue="A"
    />
  );
};

export default SelectPanel;
