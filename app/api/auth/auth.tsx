import instance from "../../../Hook/axios/axios";
const url = "/api/v1/user/"
class AuthApi {
    async login(username: string, password: string) {
        try {
            console.log(instance)
            const response = await instance.post(`${url}login`, { username, password });
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async register(username: string, email: string, password: string, phone: string) {
        try {
            const response = await instance.post(`${url}register`, { username, email, password, phone });
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
}

const auth = new AuthApi();

export default auth;