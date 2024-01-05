import { Query } from "@tanstack/react-query";
import fetcher from "./fetcher";

// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/getAllProject
export const getAllProject = async () => {
  try {
    const response = await fetcher.get("/Project/getAllProject");
    return response.data.content;
  } catch (error) {
    throw "Lỗi get API";
  }
};

// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/getProjectDetail
export const getProjectDetail = async (projectId) => {
  try {
    const response = await fetcher.get("/Project/getProjectDetail", {
      params: {
        id: projectId,
      },
    });
    return response.data.content;
  } catch (error) {
    throw "Lỗi get API";
  }
};


// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/createProject
export const creatProject = async (payload) => {
  try {
    const response = await fetcher.post("/Project/createProject", payload);
    return response.data.content;
  } catch (error) {
    throw "Lỗi post API";
  }
};

// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/createProjectAuthorize
export const creatProjectAuthorize = async (payload) => {
  try {
    const response = await fetcher.post("/Project/createProjectAuthorize", payload);
    return response.data.content;
  } catch (error) {
    throw "Lỗi post API";
  }
};

// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/updateProject
export const editProject = async (payload) => {
  try {
    const response = await fetcher.put("/Project/updateProject", payload,
      {
        params: {
          projectId: payload.id,
        },
      }
    );
    return response.data.content;
  } catch (error) {
    throw "Lỗi put API";
  }
};


// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/deleteProject
export const deleteProject = async (projectId) => {
  console.log('projectId: ', projectId);
  try {
    const response = await fetcher.delete("/Project/deleteProject",
      {
        params: {
          projectId: projectId,
        },
      }
    )
    console.log(response.data.content);
    return response.data.content;
  } catch (error) {
    throw "Lỗi delete API";
  }
};


// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/assignUserProject
export const assignUserProject = async (payload) => {
  try {
    const response = await fetcher.post("/Project/assignUserProject", payload);
    return response.data.content;
  } catch (error) {
    throw "Lỗi assign USER API";
  }
};