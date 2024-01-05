import fetcher from "./fetcher";

/***
 * TODO: Login API
 * * @param payload: {email: ..., password: ...}
 */ 
export const loginApi = async (payload) => {
    try {
        const response = await fetcher.post("/Users/signin", payload)
        // console.log("login response: ", response)
        return response.data.content;
    }
    catch(error) {
        // console.log("login error: ", error.response.data)
        throw error.response.data
    }
}

/***
 * TODO: Register API
 * * @param payload: {email: ..., password: ..., name: ..., phoneNumber: ...}
 */ 
export const registerApi = async (payload) => {
    try {
        const response = await fetcher.post("/Users/signup", payload)
        console.log("register response: ", response)
        return response.data.content;
    }
    catch(error) {
        console.log("register error: ", error.response.data)
        throw error.response.data
    }
}


/***
 * TODO: getUser 
 * * @param None
 */ 
export const getUser = async () => {
    try {
        const response = await fetcher.get("/Users/getUser")
        return response.data.content;
    }
    catch(error) {
        throw error.response.data
    }
}