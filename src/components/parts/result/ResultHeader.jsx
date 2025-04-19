import { toUpperCase } from "@libs/helper";
import { useResult } from "@hooks/useResult";

const ResultHeader = ({ type = "TRA", is_total = true }) => {
  const { skillFields, scoreFields, headerWidth } = useResult(type);

  return (
    <thead>
      <tr style={{ borderBottom: "1px solid" }}>
        <th style={{ width: headerWidth.rank }}>Rank</th>
        <th style={{ width: headerWidth.name }}>Name</th>
        <th style={{ width: headerWidth.rtn }}>Rtn</th>
        {skillFields.map((field) => (
          <th key={field} style={{width: headerWidth.skill}}>
            {toUpperCase(field)}
          </th>
        ))}
        {scoreFields.map((field) => (
          <th key={field} style={{width: headerWidth.score}}>
            {toUpperCase(field)}
          </th>
        ))}
        <th style={{ width: "70px" }}>{is_total ? "Total" : "Best"}</th>
      </tr>
    </thead>
  );
};

export default ResultHeader;
