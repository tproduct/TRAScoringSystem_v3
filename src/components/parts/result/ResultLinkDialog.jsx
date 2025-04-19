import { Dialog, IconButton, Text, Clipboard, QrCode, HStack } from "@chakra-ui/react";
import { LuLink2 } from "react-icons/lu";

const ResultLinkDialog = ({competitionId}) => {
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
            <Dialog.Title>観客用ページへのリンク</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <HStack>
              <Text>
                https://tproduct.net/trascoringsystem_v3/result/
                {competitionId}
              </Text>
              <Clipboard.Root
                value={`https://tproduct.net/trascoringsystem_v3/result/${competitionId}`}
              >
                <Clipboard.Trigger asChild>
                  <IconButton size="xs" bg="white" color="myBlue.800">
                    <Clipboard.Indicator />
                  </IconButton>
                </Clipboard.Trigger>
              </Clipboard.Root>
            </HStack>
            <QrCode.Root
              value={`https://tproduct.net/trascoringsystem_v3/result/${competitionId}`}
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

export default ResultLinkDialog;