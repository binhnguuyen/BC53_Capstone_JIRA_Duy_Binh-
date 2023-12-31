import { Query } from "@tanstack/react-query";
import fetcher from "./fetcher";

// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/getAllProject
export const getAllProject = async () => {
    try {
      const response = await fetcher.get("/Project/getAllProject");
      return response.data.content;
    } catch (error) {}
  };