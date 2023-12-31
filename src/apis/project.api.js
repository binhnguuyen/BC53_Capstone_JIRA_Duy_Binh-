import { Query } from "@tanstack/react-query";
import fetcher from "./fetcher";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/getAllProject

export const getAllProject = createAsyncThunk(
  "project/getAllProject",
  async (params) => {
    console.log('params: ', params);
    try {
      const response = await fetcher.get("/Project/getAllProject",
        {
          params: {
            page: params.page || 1,
            limit: 10,
          },
        });
      return response.data.content;
    } catch (error) { }
  }
);
