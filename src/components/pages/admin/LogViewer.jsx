import { useApiRequest } from "@hooks/useApiRequest";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function LogViewer({category}) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10)); // 今日の日付
  const [logs, setLogs] = useState([]);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const userId = useSelector(state => state.user.info.id);

  useEffect(() => {
    fetchLogs();
  }, [date]);

  const fetchLogs = async () => {
    setLoading(true);
    const [year, month, day] = date.split('-');
    const {get} = useApiRequest(`/logs/${userId}/${category}/${year}/${month}/${day}`);
    const response = await get();
    setLogs(response.entries);
    setLoading(false);
  };

  return (
    <div>
      <label>
        日付:{" "}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label style={{ marginLeft: "1em" }}>
        表示件数:
        <select
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
        >
          <option value={10}>10件</option>
          <option value={50}>50件</option>
          <option value={100}>100件</option>
        </select>
      </label>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <table
          border="1"
          cellPadding="5"
          style={{ marginTop: "1em", width: "100%" }}
        >
          <thead>
            <tr>
              <th>時刻</th>
              <th>イベント</th>
              <th>ユーザーID</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log, i) => (
              <tr key={i}>
                <td>{log.timestamp}</td>
                <td>{log.event}</td>
                <td>{log.userId || "-"}</td>
                <td>{log.ip || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LogViewer;
