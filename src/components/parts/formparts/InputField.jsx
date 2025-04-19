import { Input, Field } from "@chakra-ui/react";

const InputField = ({ label, type, name, defaultValue, errorText, required=false }) => {
  return (
    <Field.Root required={required} invalid={!!errorText} mt="2">
      <Field.Label>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
      <Input type={type} name={name} defaultValue={defaultValue} />
      <Field.ErrorText>{errorText}</Field.ErrorText>
    </Field.Root>
  );
};

export default InputField;
