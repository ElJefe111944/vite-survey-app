import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchSurvey } from "../lib/api";
import type { Survey } from "../lib/interface";

const Survey = () => {
    const { id } = useParams();

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const loadSurvey = async () => {

            if(!id) return;

            try {
                const data = await fetchSurvey(id);
                setSurvey(data);
            } catch (error) {
                setError("Failed to load surveys");
                console.error("Failed to load surveys: ", error);
            } finally {
                setIsLoading(false);
            };
        };

        loadSurvey();
    }, [id]);

    if (isLoading) return <p>Loading survey...</p>
    if (error || !survey) return <p>{error || "Survey not found"}</p>

    return (
        <div>
            <p>{survey.title}</p>
            <p>{survey.description}</p>
        </div>
    )
};

export default Survey;