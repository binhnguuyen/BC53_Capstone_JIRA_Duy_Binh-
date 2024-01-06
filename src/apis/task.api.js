import fetcher from "./fetcher";

// Link:
// https://jiranew.cybersoft.edu.vn/api/Status/getAll
export const getAllStatus = async () => {
    try {
        const response = await fetcher.get("/Status/getAll");
        return response.data.content;
    } catch (error) {
        throw "Lỗi get Status API";
    }
};