import { Box, Button, HStack } from "@chakra-ui/react";

const Keyboard = ({ keys, handler }) => {
  return (
    <HStack gap="2" layerStyle="boxSingle">
      {Object.entries(keys).map(([key, value]) => (
        <Button
          onClick={() => {
            handler(value);
          }}
          key={key}
          layerStyle="keyButton"
        >
          {key}
        </Button>
      ))}
    </HStack>
  );
};

export default Keyboard;