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

// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/getTaskDetail
export const getTaskDetail = async (taskId) => {
    try {
        const response = await fetcher.get("/Project/getTaskDetail",
            {
                params: {
                    taskId: taskId,
                },
            }
        );
        return response.data.content;
    } catch (error) {
        throw "Lỗi post task API";
    }
};


// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/updateTask
export const updateTask = async (payload) => {
    try {
        const response = await fetcher.post("/Project/updateTask", payload);
        return response.data.content;
    } catch (error) {
        throw "Lỗi update task API";
    }
};


// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/removeTask
export const removeTask = async (taskId) => {
    try {
        const response = await fetcher.delete("/Project/removeTask",
            {
                params: {
                    taskId: taskId,
                },
            }
        );
        return response.data.content;
    } catch (error) {
        throw "Lỗi remove task API";
    }
};



// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/assignUserTask
export const assignUserTask = async (payload) => {
    try {
        const response = await fetcher.post("/Project/assignUserTask", payload);
        return response.data.content;
    } catch (error) {
        throw "Lỗi assign User Task";
    }
};


// Link:
// https://jiranew.cybersoft.edu.vn/api/Project/removeUserFromTask
export const removeUserFromTask = async (payload) => {
    try {
        const response = await fetcher.post("/Project/removeUserFromTask", payload);
        return response.data.content;
    } catch (error) {
        throw "Lỗi remove User Task";
    }
};