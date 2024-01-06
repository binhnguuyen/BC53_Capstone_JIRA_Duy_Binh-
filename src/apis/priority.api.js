import fetcher from "./fetcher";

// Link:
// https://jiranew.cybersoft.edu.vn/api/Priority/getAll
export const getAllPriority = async () => {
    try {
        const response = await fetcher.get("/Priority/getAll");
        return response.data.content;
    } catch (error) {
        throw "Lỗi get Priority API";
    }
};