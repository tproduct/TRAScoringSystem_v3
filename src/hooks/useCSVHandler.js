export const useCSVHandler = () => {
  const createDataFromCSV = async (e) => {
    const data = await createObjFromCSV(e);
    if (!data) {
      alert("データのフィールド数とヘッダーが一致しません");
      return [];
    } else {
      return data;
    }
  };

  const createObjFromCSV = async (e) => {
    const csv = await readCSVFile(e);

    const csvArray = csv.split("\n");
    const header = csvArray[0].split(",");
    const data = csvArray.slice(1).map((row) => row.split(","));

    //ヘッダーとデータの列数が異なる場合
    if (!data.reduce((acc, row) => acc && header.length === row.length, true))
      return false;

    return data.map((row) => {
      return row.reduce((acc, item, index) => {
        return {
          ...acc,
          [header[index].trim().toLowerCase()]: isNaN(item)
            ? item
            : Number(item),
        };
      }, {});
    });
  };

  const readCSVFile = async (e) => {
    const files = e.files;
    //ファイルが存在しない場合
    if (!files || files.length === 0) return;

    const file = files[0];
    //CSVでない場合
    if (file.type !== "text/csv") return;

    const reader = new FileReader();
    reader.readAsText(file);
    await new Promise((resolve) => (reader.onload = () => resolve()));

    return reader.result;
  };

  const downloadCSV = (table, fileName) => {
    const rows = Array.from(table.querySelectorAll("tr"));

    const csvData = rows
      .map((row) => {
        const cells = Array.from(row.querySelectorAll("th, td"));
        return cells.map((cell) => `"${cell.textContent}"`).join(",");
      })
      .join("\n");

    const bom = "\uFEFF"; // UTF-8 BOM
    const blob = new Blob([bom + csvData], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `result_${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return { createDataFromCSV, downloadCSV };
};
