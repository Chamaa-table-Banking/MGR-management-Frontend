import instance from "../../../Hook/axios/axios";

class AuthApi {
    async login(email: string, password: string) {
        try {
            const response = await instance.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async register(name: string, phone: string, password: string) {
        try {
            const response = await instance.post('/auth/register', { name, phone, password });
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
}

const auth = new AuthApi();

export default auth;