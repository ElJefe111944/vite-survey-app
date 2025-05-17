import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import type { Survey, SurveyResultsOut } from "../lib/interface";
import { fetchSurvey, fetchSurveySummary } from "../lib/api";

import { 
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

const SurveySummary = () => {
    const { id } = useParams();

    const initialized = useRef<boolean>(false);

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [surveyResults, setSurveyResults] = useState<SurveyResultsOut[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSummary = async () => {

            if (!id || initialized.current) return;
            initialized.current = true;

            try {
                const surveyData = await fetchSurvey(id);
                setSurvey(surveyData);

                const summaries = await Promise.all(
                    surveyData.questions.map((question) => fetchSurveySummary(id, question.id))
                );
                setSurveyResults(summaries);

            } catch (error) {
                setError("Failed to load surveys");
                console.error("Failed to load surveys: ", error);
            } finally {
                setIsLoading(false);
            };
        };

        loadSummary();
    }, [id]);

    if (isLoading) return <p>Loading survey...</p>
    if (error) return <p>{error || "Error fetching results"}</p>
    if (!survey || !surveyResults) return <p>{"Survey Results not found"}</p>

    return (
        <div>
            <div>
                <h1>{survey.title} - Summary</h1>
            </div>
            <div>
                {survey.questions.map((question, idx) => {
                    const result = surveyResults[idx];

                    const data = question.options?.map((opt) => ({
                        option: opt,
                        votes: result.option_totals[opt] || 0
                    })) ?? [];

                    return (
                        <div key={question.id}>
                            <h2>{question.question}</h2>
                            <p>Total responses: {result?.total_votes}</p>

                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={data}>
                                <XAxis dataKey="option" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="votes" fill="#3b82f6" radius={[4,4,4,0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default SurveySummary;