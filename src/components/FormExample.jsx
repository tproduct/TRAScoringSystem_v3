import { useActionState, useEffect, useState } from "react";
import { Button, Field } from "@chakra-ui/react";
import InputField from "@parts/formparts/InputField";
import { useApiRequest } from "@hooks/useApiRequest";
import RadioField from "@parts/formparts/RadioField";
import CheckboxField from "@parts/formparts/CheckboxField";
import EditableField from "@parts/formparts/EditableField";

const FormExample = () => {
  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      const requestData = {
        name: formData.get("name"),
        email: formData.get("email"),
        type: formData.get("type"),
        check: !!formData.get("check"),
        text: formData.get("text"),
      };
      console.log("req", requestData);
      // const result = await updateUser(requestData);
      // console.log(result);

      return requestData;
    },
    { name: "", password: "", type: "TRA", check: false, text: "aaaa" }
  );
  console.log("state", state);

  const updateUser = async ({ name, email }) => {
    const userId = "user_67d6c8822850a";
    const data = {
      name,
      email,
    };
    const { patch } = useApiRequest(`/users/${userId}`);
    return await patch(data);
  };

  const items = [
    { label: "TRA", value: "TRA" },
    { label: "DMT", value: "DMT" },
    { label: "TUM", value: "TUM" },
  ];

  return (
    <form action={formAction}>
      <EditableField
        label="text"
        name="text"
        defaultValue={state.text}
        errorText=""
      />
      <CheckboxField
        label="Test"
        name="check"
        defaultChecked={state.check}
        errorText=""
      />
      
      <RadioField
        label="Type"
        name="type"
        defaultValue={state.type}
        errorText=""
        items={items}
      />
      <InputField
        label="Name"
        type="text"
        name="name"
        defaultValue={state.name}
        errorText=""
      />
      {/* <InputField label="Password" type="password" name="password" defaultValue={state.password} errorText="" /> */}
      <InputField
        label="Email"
        type="text"
        name="email"
        defaultValue={state.email}
        errorText=""
      />
      <Button type="submit" color="black" disabled={isPending}>
        submit
      </Button>
    </form>
  );
};

export default FormExample;
