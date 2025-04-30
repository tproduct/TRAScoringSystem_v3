import { useDispatch } from "react-redux";
import { useApiRequest } from "./useApiRequest";
import { toaster } from "@ui/toaster";

export const useForm = (
  fields,
  endpoints,
  action,
  setErrors,
  middleWare = null
) => {
  const dispatch = useDispatch();

  const createDefaultState = (baseArray = null) => {
    return createRequestData(null, baseArray);
  };

  const createRequestData = (formData, baseArray = null, index = null) => {
    if (baseArray) {
      return baseArray.map((item, i) => {
        return createRequestData(formData, null, i);
      });
    }

    return fields.reduce((acc, key) => {
      const field = index !== null ? `${key}${index}` : key;
      const fieldData =
        formData && formData.get(field) !== ""
          ? {
              [key]: formData
                ? formData.get(field) === "on"
                  ? true
                  : formData.get(field)
                : "",
            }
          : {};
      return {
        ...acc,
        ...fieldData,
      };
    }, {});
  };

  const formAsyncAction = async (prev, formData, baseArray = null) => {
    const method = formData.get("button").split("/")[0];
    const id = formData.get("button").split("/")[1];

    switch (method) {
      case "update":
        return await updateData(prev, formData, baseArray);
      case "create":
        return await postData(prev, formData, baseArray);
      case "post":
        return await postData(prev, formData, baseArray);
      case "sync":
        return await syncData(prev, formData, baseArray);
      case "delete":
        return id ? await deleteData(prev, id) : await deleteData();
    }
  };

  const handleResponse = (response, prev, requestData = null) => {
    console.log(response);

    if (response.status !== "success") {
      setErrors(response.errors);
      return prev;
    } else {
      setErrors(null);
      !!action && dispatch(action(response.data));
      !!middleWare && middleWare();
      toaster.create({
        title: "成功",
        description: "送信しました",
        type: "success",
      });
      return requestData ?? createRequestData();
    }
  };

  const postData = async (prev, formData, baseArray) => {
    const requestData = createRequestData(formData, baseArray);
    const { post } = useApiRequest(endpoints.post);
    const response = await post(requestData);
    console.log(requestData)
    return handleResponse(response, prev, requestData);
  };

  const syncData = async (prev, formData, baseArray) => {
    return postData(prev, formData, baseArray);
  };

  const updateData = async (prev, formData, baseArray) => {
    const requestData = createRequestData(formData, baseArray);
    const { patch } = useApiRequest(endpoints.patch);
    const response = await patch(requestData);
    return handleResponse(response, prev, requestData);
  };

  const deleteData = async (prev, id) => {
    const { del } = useApiRequest(
      id ? `${endpoints.delete}/${id}` : endpoints.delete
    );
    const response = await del();

    return handleResponse(response, prev);
  };

  return { createDefaultState, formAsyncAction, createRequestData };
};
