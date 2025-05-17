import axios from "axios";
import type { Survey, SaveResponseAck, SurveyResponsesOut } from "./interface";

const API_BASE = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        Authorization: API_KEY,
    }
});

export async function fetchSurveys(): Promise<Survey[]> {
    const res = await api.get("/surveys");
    return res.data;
};

export async function fetchSurvey(id: string): Promise<Survey> {
    const res = await api.get(`/surveys/${id}`);
    return res.data;
};

export async function submitSurvey(
    id: string,
    payload: SurveyResponsesOut
): Promise<SaveResponseAck> {
    const res = await api.post(`/surveys/${id}/response`, payload);
    return res.data;
};