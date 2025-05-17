export type Survey = {
    id: string;
    title: string;
    description: string;
    questions: SurveyQuestion[];
};

export type SurveyQuestion = {
    id: string;
    type: string;
    question: string;
    options: string[] | null;
};