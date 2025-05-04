import { useResult } from "@hooks/useResult";

const ResultFirstRow = ({
  type,
  player,
  withPhonetic = false,
  rankOfOpens = null,
}) => {
  const { skillFields, scoreFields } = useResult(type);

  return (
    <tr style={{ height: "25px" }}>
      <td>
        {player.is_open
          ? "OP"
          : rankOfOpens
          ? player.rank -
            rankOfOpens.reduce((acc, rank) => {
              return rank < player.rank ? acc + 1 : acc;
            }, 0)
          : player.rank}
      </td>
      <td style={{ textAlign: "left" }}>
        {player.name + (player.name2 ? "/" + player.name2 : "")}
        {withPhonetic &&
          `(${
            player.phonetic + (player.phonetic2 ? "/" + player.phonetic2 : "")
          })`}
      </td>
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
