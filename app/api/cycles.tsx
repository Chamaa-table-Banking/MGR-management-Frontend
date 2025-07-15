import instance from "../../Hook/axios/axios"

const url = "/api/v1/cycles"

class CyclesApi {

    async createCyle(data: any) {
        try {
            const response = await instance.post(`${url}/create`, data)
            return response.data
        } catch (error) {
            console.error("Cycle creation failed", error)
            throw error;
        }
    }
    async createChamaCycle(data: {
        chamaa_id: string;
        start_date: string;
        end_date: string;
        max_people: number;
        amount_per_member: number;
        interval_in_days: number;
    }) {
        try {
            const response = await instance.post('/api/v1/cycles/create', data);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    async getChamaCycles(id: string) {
        try {
            const response = await instance.get(`${url}/chamaa/${id}`)
            return response.data
        } catch (error) {
            console.error("Cycle creation failed", error)
            throw error;
        }
    }

}

const cycleApi = new CyclesApi()
export default cycleApi;