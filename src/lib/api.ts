import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        Authorization: API_KEY,
    }
});

export async function fetchSurveys(){
    const res = await api.get("/surveys");
    return res.data;
};

export async function fetchSurvey(id: string){
    const res = await api.get(`/surveys/${id}`);
    return res.data;
};