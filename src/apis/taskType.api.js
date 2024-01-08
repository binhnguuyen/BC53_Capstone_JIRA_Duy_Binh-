import fetcher from "./fetcher";

// Link:
// https://jiranew.cybersoft.edu.vn/api/TaskType/getAll
export const getTaskType = async () => {
    try {
        const response = await fetcher.get("/TaskType/getAll");
        return response.data.content;
    } catch (error) {
        throw "Lỗi get Status API";
    }
};