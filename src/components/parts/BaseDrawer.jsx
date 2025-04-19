import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  IconButton,
  Heading,
  Box,
} from "@chakra-ui/react";
import { BsQuestionCircle } from "react-icons/bs";

const BaseDrawer = ({ description }) => {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <IconButton variant="outline" size="sm" bg="white">
          <BsQuestionCircle />
        </IconButton>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{description.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              {description.contents.map((content, index) => (
                <Box mt="1" key={index}>
                  <Heading size="md">{content.subtitle}</Heading>
                  <p key={index}>{content.text}</p>
                </Box>
              ))}
            </Drawer.Body>
            <Drawer.Footer>
              <Button layerStyle="button">Cancel</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default BaseDrawer;
