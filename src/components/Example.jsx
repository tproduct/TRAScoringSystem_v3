import { useEffect } from "react";
import { useApiRequest } from "@hooks/useApiRequest";

const Example = () => {
  useEffect(() => {
    // createUser();
    // fetchUser();
    // updateUser();
    // deleteUser();
    updateAllUser();
  },[]);

  const fetchUser = async () => {
    const userId = "user_67a156827ff8a";
    const getUser = useApiRequest(`/users/${userId}`).get;
    const result = await getUser(); 
    console.log(result);
  }

  const createUser = async () => {
    const data = {
      name: "name",
      password: "passWord0",
      email: "test35@test.com",
    }
    const { post } = useApiRequest("/users");
    const result = await post(data);
    console.log(result);
  }

  const updateUser = async () => {
    const userId = "user_67a156827ff8a";
    const data = {
      name: "name5678aaaaaa",
      email: "test3@test.com",
    }
    const { patch } = useApiRequest(`/users/${userId}`);
    const result = await patch(data);
    console.log(result);
  }

  const updateAllUser = async () => {
    const data = [{
      id: "user_67d6c8822850a",
      name: "name8",
      email: "test8@test.com",
    },{
      id: "user_67a15cf80f882",
      name: "name6a",
      email: "test6@test.com",
    }];
    const { patch } = useApiRequest(`/users`);
    const result = await patch(data);
    console.log(result);
  }

  const deleteUser = async () => {
    const userId = "user_67d6ca7c35414";
    const { del } = useApiRequest(`/users/${userId}`);
    const result = await del();
    console.log(result);
  }

  return (
    <div>test</div>
  );
};

export default Example;