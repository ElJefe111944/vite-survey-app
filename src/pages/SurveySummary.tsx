import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Survey, SurveyResultsOut } from "../lib/interface";
import { fetchSurvey, fetchSurveySummary } from "../lib/api";

const SurveySummary = () => {
    const { id } = useParams();

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [surveyResults, setSurveyResults] = useState<SurveyResultsOut[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSummary = async () => {

            if (!id) return;

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
        <div>Survey Summary</div>
    )
};

export default SurveySummary;