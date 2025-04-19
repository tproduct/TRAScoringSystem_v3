import { Field, RadioGroup } from "@chakra-ui/react";
import { useState } from "react";

const RadioField = ({ label, name, defaultValue, errorText, items, required=false }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <Field.Root required={required} invalid={false} mt="2">
      <Field.Label>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
      <RadioGroup.Root
        name={name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      >
        {items.map((item, index) => (
          <RadioGroup.Item key={item.value} value={item.value} ml={index ? "4" : "1"}>
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
      <Field.ErrorText>{errorText}</Field.ErrorText>
    </Field.Root>
  );
};

export default RadioField;
