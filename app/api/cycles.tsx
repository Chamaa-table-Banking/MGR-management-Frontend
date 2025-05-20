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
}

const cycleApi = new CyclesApi()
export default cycleApi;