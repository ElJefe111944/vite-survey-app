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