import { useResult } from "@hooks/useResult";

const ResultFirstRow = ({ type, round, player, category, rule, routine }) => {
  const { skillFields, scoreFields } = useResult(type);

  return (
    <tr style={{ height: "25px" }}>
      <td>{player.rank}</td>
      <td style={{ textAlign: "left" }}>{player.name}</td>
      <td>{player.label_1}</td>
      {skillFields?.map((field) => (
        <td key={field}>{player[field]}</td>
      ))}
      {scoreFields?.map((field) => (
        <td key={field}>
          {field === "sum" && player.dns ? "DNS" : player[field]?.toFixed(2)}
        </td>
      ))}
      <td>
        {player.dns && player.dns_2
          ? "DNS"
          : player.total
          ? player.total?.toFixed(2)
          : player.best?.toFixed(2)}
      </td>
    </tr>
  );
};

export default ResultFirstRow;
