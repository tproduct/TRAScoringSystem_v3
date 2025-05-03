import { HStack } from "@chakra-ui/react";

const CheckboxField = ({ label, name, defaultChecked, ref }) => {
  const uuid = self.crypto.randomUUID();
  return (
    <HStack w="100%">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        id={`check${uuid}`}
        ref={ref}
      />
      <label htmlFor={`check${uuid}`}>{label}</label>
    </HStack>
  );
};

export default CheckboxField;
