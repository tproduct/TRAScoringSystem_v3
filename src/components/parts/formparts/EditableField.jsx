import { Editable, Field } from "@chakra-ui/react";

const EditableField = ({ name, defaultValue, errorText }) => {
  return (
    <Field.Root invalid={!!errorText}>
      <Editable.Root defaultValue={defaultValue} name={name}>
        <Editable.Preview />
        <Editable.Input />
      </Editable.Root>
      <Field.ErrorText>{errorText}</Field.ErrorText>
    </Field.Root>
  );
};

export default EditableField;
