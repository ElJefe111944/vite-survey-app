import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchSurvey } from "../lib/api";
import type { Survey, SurveyResponseItem } from "../lib/interface";

const Survey = () => {
    const { id } = useParams();

    const intialized = useRef<boolean>(false);

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [responses, setResponses] = useState<SurveyResponseItem[]>([]);
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

    const handleChange = (questionId: string, selected: string | string[]) => {
        setResponses((prev) => {
            const filtered = prev.filter((response) => response.question_id !== questionId);
            return [...filtered, { question_id: questionId, selected_option: selected.toString() }];
        })
    };



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
                                            onChange={() => handleChange(item.id, option)}
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
                                            onChange={(e) => {
                                               const selected = responses.find((response) => response.question_id === item.id)?.selected_option.split(",") || [];
                                               const updated = e.target.checked ? [...selected, option]
                                                : selected.filter((option) => option !== option);
                                                handleChange(item.id, updated)
                                            }}
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