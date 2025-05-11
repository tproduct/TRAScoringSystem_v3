import {
  Dialog,
  IconButton,
  Text,
  Clipboard,
  QrCode,
  HStack,
} from "@chakra-ui/react";
import { LuLink2 } from "react-icons/lu";

const LinkDialog = ({ linkType = "result", competitionId }) => {
  const linkLabels = {
    result: "観客用",
    monitor: "速報",
    judge: "審判用",
  }[linkType];

  return (
    <Dialog.Root size="lg">
      <Dialog.Trigger asChild>
        <IconButton bg="white" color="myBlue.800">
          <LuLink2 />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{linkLabels}ページへのリンク</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <HStack>
              <a
                href={
                  import.meta.env.VITE_BASE_URL +
                  "/" +
                  linkType +
                  "/" +
                  competitionId
                }
                target="_blank"
                style={{
                  wordBreak: "break-all",
                  whiteSpace: "normal",
                  width: "100%",
                }}
              >
                {import.meta.env.VITE_BASE_URL}/{linkType}/{competitionId}
              </a>
              <Clipboard.Root
                value={`${
                  import.meta.env.VITE_BASE_URL
                }/${linkType}/${competitionId}`}
              >
                <Clipboard.Trigger asChild>
                  <IconButton size="xs" bg="white" color="myBlue.800">
                    <Clipboard.Indicator />
                  </IconButton>
                </Clipboard.Trigger>
              </Clipboard.Root>
            </HStack>
            <QrCode.Root
              value={`${
                import.meta.env.VITE_BASE_URL
              }/${linkType}/${competitionId}`}
            >
              <QrCode.Frame>
                <QrCode.Pattern />
              </QrCode.Frame>
            </QrCode.Root>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default LinkDialog;
