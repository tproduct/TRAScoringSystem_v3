import { Button } from "@chakra-ui/react";
import { HiDownload } from "react-icons/hi";
import { typeLabels } from "@libs/constants";

const TemplateDownloadButton = ({type}) => {
  const label = typeLabels[type];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/src/files/${type}.csv`; // ダウンロードしたいファイルのパス
    link.download = `template_${type}.csv`;    // 保存時のファイル名
    link.click();
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm" border="1px solid">
      <HiDownload /> テンプレート
    </Button>
  );
};

export default TemplateDownloadButton;