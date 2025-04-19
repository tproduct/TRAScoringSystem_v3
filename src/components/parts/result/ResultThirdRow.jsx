import { useResult } from "@hooks/useResult";

const ResultThirdRow = ({ type, round, player, category, rule }) => {
  const { skillFields, scoreFields } = useResult(type);

  return (
    <tr style={{ borderBottom: "1px solid", height: "30px" }}>
      <td></td>
      <td style={{ textAlign: "left" }}>{player.team}</td>
      <td>{player.label_3}</td>
      {skillFields?.map((field) => (
        <td key={field}>
          {field === "sum" && player.dns ? "DNS" : player[`${field}_f`]}
        </td>
      ))}
      {scoreFields?.map((field) => (
        <td key={field}>{player[`${field}_f`]?.toFixed(2)}</td>
      ))}
      <td></td>
    </tr>
  );
};

export default ResultThirdRow;
