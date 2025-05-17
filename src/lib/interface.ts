export interface Survey {
    id: string;
    title: string;
    description: string;
    questions: SurveyQuestion[];
};

export interface SurveyQuestion {
    id: string;
    type: string;
    question: string;
    options: string[] | null;
};

export interface SurveyResponseItem {
    question_id: string;
    selected_option: string;
}

export interface SaveResponseAck {
    status: string;
    id: number;
};

export interface SurveyResponsesOut {
    responses: SurveyResponseItem[];
}

