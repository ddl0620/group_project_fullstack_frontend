import API_INSTANCE from "@/services/api_instance.js";

export const fetchAllEvent = async ({page, limit, isAcs}) => {
    const sort = isAcs ? "asc" : "desc";
    // http://localhost:5001/api/v1/event/all-event?page=1&limit=10&sortBy=desc
    const response = await API_INSTANCE.get(`/api/v1/event/all-event?page=${page}&limit=${limit}&sortBy=${sort}`);
    // console.log('response get All event', response.data.data.events);
    return response.data.data.events;
};