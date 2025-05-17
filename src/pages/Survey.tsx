import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchSurvey } from "../lib/api";
import type { Survey } from "../lib/interface";

const Survey = () => {
    const { id } = useParams();

    const intialized = useRef<boolean>(false);

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const loadSurvey = async () => {

            if (!id || intialized.current) return;
            intialized.current = true;

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
            <div>
                <div>
                    <p>{survey.title}</p>
                    <p>{survey.description}</p>
                </div>
                <div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        {survey.questions.map((item) => (
                            <div key={item.id}>
                                <label>{item.question}</label>
                                {/* single choice */}
                                {item.type === "single_choice" && item.options?.map((option) => (
                                    <div key={option}>
                                        <input
                                            type="radio"
                                            name={item.id}
                                            value={option}
                                            onChange={() => { }}
                                            required
                                        />
                                        {option}
                                    </div>
                                ))}
                                {/* multiple choice */}
                                {item.type === "multiple_choice" && item.options?.map((option) => (
                                    <div key={option}>
                                        <input
                                            type="checkbox"
                                            name={`${item.id}-${option}`}
                                            value={option}
                                            onChange={() => { }}
                                            required
                                        />
                                        {option}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div>
                            <button type="submit">
                                Submit Survey
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Survey;