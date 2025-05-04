import { useResult } from "@hooks/useResult";

const ResultSecondRow = ({ type, round, player, category, rule, countIsOpen = 0 }) => {
  const { skillFields, scoreFields } = useResult(type);

  return (
    <tr
      style={
        (round !== "final" || (round === "final" && rule?.refresh)) && {
          borderBottom: "1px solid",
          height: "30px",
        }
      }
    >
      <td>{round !== "final" && player?.rank <= rule?.nextround + countIsOpen ? "Q" : ""}</td>
      <td style={{ textAlign: "left" }}>
        {(round !== "final" || (round === "final" && rule?.refresh)) &&
          player.team + (player.team2 ? "/" + player.team2 : "")}
      </td>
      <td>{player.label_2}</td>
      {skillFields?.map((field) => (
        <td key={field}>
          {field === "sum" && player.dns ? "DNS" : player[`${field}_2`]}
        </td>
      ))}
      {scoreFields?.map((field) => (
        <td key={field}>{player[`${field}_2`]?.toFixed(2)}</td>
      ))}
      <td></td>
    </tr>
  );
};

export default ResultSecondRow;
