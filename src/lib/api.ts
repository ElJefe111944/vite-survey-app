import axios from "axios";
import { handleApiError } from "./errors";
import type { Survey, SaveResponseAck, SurveyResponsesOut, SurveyResultsOut } from "./interface";

const API_BASE = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        Authorization: API_KEY,
    }
});

// Intercept errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(handleApiError(error))
);

// API Functions

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
    const res = await api.post(`/surveys/${id}/responses`, payload);
    return res.data;
};

export async function fetchSurveySummary(id: string, questionId: string): Promise<SurveyResultsOut>{
    const res = await api.get(`/surveys/${id}/responses`, {
        params: { question_id: questionId }
    });
    return res.data;
};