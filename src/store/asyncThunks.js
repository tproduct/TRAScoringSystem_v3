import { createAsyncThunk } from "@reduxjs/toolkit";
import { useApiRequest } from "@hooks/useApiRequest";

export const handleAsyncActions = (builder, asynkThunk) => {
  builder
    .addCase(asynkThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(asynkThunk.fulfilled, (state, action) => {
      state.loading = false;
      if(action.payload.key.includes("/")){
        const keys = action.payload.key.split("/");
        state[keys[0]][keys[1]] = action.payload.data;
      }else{
        state[action.payload.key] = action.payload.data;
      }
    })
    .addCase(asynkThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};

export const fetchCompetitionData = createAsyncThunk(
  "data/fetchCompetitionData",
  async ({ endpoint, params, key }) => {
    const { get } = useApiRequest(endpoint);
    const response = await get(params);
    return { key, data: response };
  }
);

export const createCompetitionData = createAsyncThunk(
  "data/createCompetitionData",
  async ({ endpoint, configs, additionalKey, key }) => {
    const { handlePost, handlePostAll } = useSubmitHandler(endpoint);
    const response =
      Array.isArray(configs)
        ? await handlePostAll(configs, null, null, additionalKey)
        : await handlePost(configs, null, null, additionalKey);
    return { key, data: response };
  }
);

export const updateCompetitionData = createAsyncThunk(
  "data/updateCompetitionData",
  async ({ endpoint, configs, additionalKey, key }) => {
    const { handlePatch, handlePatchAll } = useSubmitHandler(endpoint);
    const response =
      Array.isArray(configs)
        ? await handlePatchAll(configs, null, null, additionalKey)
        : await handlePatch(configs, null, null);
    return { key, data: response };
  }
);

export const deleteCompetitionData = createAsyncThunk(
  "data/deleteCompetitionData",
  async ({ endpoint, configs, key }) => {
    const { handleDelete } = useSubmitHandler(endpoint);
    const response = await handleDelete(configs, null, null);
    return { key, data: null };
  }
);
