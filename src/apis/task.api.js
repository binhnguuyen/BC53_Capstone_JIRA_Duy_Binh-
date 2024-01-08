import fetcher from "./fetcher";


// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/createTask
export const createTask = async (payload) => {
    try {
        const response = await fetcher.post("/Project/createTask", payload);
        return response.data.content;
    } catch (error) {
        throw "Lỗi post task API";
    }
};