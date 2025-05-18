import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchSurvey, submitSurvey } from "../lib/api";
import type { Survey, SurveyResponseItem } from "../lib/interface";
import LoadingSpinner from "../components/LoadingSpinner";

const SurveyPage = () => {
    const { id } = useParams();

    const initialized = useRef<boolean>(false);
    const navigate = useNavigate();

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [responses, setResponses] = useState<SurveyResponseItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {

        const loadSurvey = async () => {

            if (!id || initialized.current) return;
            initialized.current = true;

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

        if (validationErrors[questionId]) {
            setValidationErrors((prev) => {
                const updated = { ...prev };
                delete updated[questionId];
                return updated;
            })
        };
    };

    const handleSubmit = async () => {

        if (!id || !survey) return;

        const errors: Record<string, string> = {};

        // check at least one multiple choice option is selected
        survey.questions.forEach((question) => {
            const response = responses.find((response) => response.question_id === question.id);
            const isEmpty = !response || !response.selected_option || response.selected_option.trim() === "";

            if (question.type === "multiple_choice" && isEmpty || question.type === "single_choice" && isEmpty) {
                errors[question.id] = "Please select at least one option."
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await submitSurvey(id, { responses });
            navigate(`/survey/${id}/summary`);
        } catch (error) {
            console.error(error, "error submitting survey");
        }
    };

    if (isLoading) return <LoadingSpinner />;
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
                        handleSubmit();
                    }}>
                        {survey.questions.map((item) => (
                            <div key={item.id}>
                                <label>{item.question}</label>
                                {item.type === "multiple_choice" || item.type === "single_choice" && validationErrors[item.id] && (
                                    <p className="text-red-500">
                                        {validationErrors[item.id]}
                                    </p>
                                )}
                                {/* single choice */}
                                {item.type === "single_choice" && item.options?.map((option) => (
                                    <div key={option}>
                                        <input
                                            type="radio"
                                            name={item.id}
                                            value={option}
                                            onChange={() => handleChange(item.id, option)}
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
                                                    : selected.filter((opt) => opt !== option);
                                                handleChange(item.id, updated)
                                            }}
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

export default SurveyPage;