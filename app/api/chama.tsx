import instance from "@/Hook/axios/axios";

const url = "/api/v1/chamaa"

class ChamaApi {

    async createChama(name: string, paybill: string, max_number_of_people: number, joining_mode: string, leaving_mode: string, number_of_cycles: number, current_members: number, chairperson_id: string) {
        try {
            const response = await instance.post(`${url}/create`, { name, paybill, max_number_of_people, joining_mode, leaving_mode, number_of_cycles, current_members, chairperson_id });
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }

    }
    async getAllChamas(data: { page: number, limit: number }) {
        try {
            const response = await instance.get(`${url}/getall`, { params: data });
            return response.data.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    async getChamaByName(data: any) {
        try {
            const response = await instance.post(`${url}/getbyname`, data);
            return response.data.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    }
    async getChamaByUser(data: { page: number, user_id: string }) {
        try {
            const response = await instance.post(`${url}/get/chamas/by/user`, data);
            return response.data.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    async joinChama(data: { chamaa_id: string, user_id: string }) {
        try {
            const response = await instance.post(`${url}/join`, data);
            return response.data.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}


const chamaApi = new ChamaApi();
export default chamaApi