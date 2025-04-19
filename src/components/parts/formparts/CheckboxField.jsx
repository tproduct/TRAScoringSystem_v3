import { Center, Field, Flex, HStack } from "@chakra-ui/react";

const CheckboxField = ({ label, name, defaultChecked, ref }) => {
  const uuid = self.crypto.randomUUID();
  return (
    <Center>
      <HStack>
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          id={`check${uuid}`}
          ref={ref}
        />
        <label htmlFor={`check${uuid}`}>{label}</label>
      </HStack>
    </Center>
  );
};

export default CheckboxField;
