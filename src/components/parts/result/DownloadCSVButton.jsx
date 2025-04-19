import { Button } from "@chakra-ui/react";
import { useCSVHandler } from "@hooks/useCSVHandler";
import { HiDownload } from "react-icons/hi";

const DownloadCSVButton = ({ tableRef, fileName }) => {
  const { downloadCSV } = useCSVHandler();

  return (
    <Button
      onClick={() => {
        downloadCSV(tableRef.current, fileName);
      }}
      className="no-print"
      color="myBlue.800"
      variant="outline"
    >
      <HiDownload />
      Download CSV
    </Button>
  );
};

export default DownloadCSVButton;
