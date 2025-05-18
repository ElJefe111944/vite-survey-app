import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchSurvey, submitSurvey } from "../lib/api";
import type { Survey, SurveyResponseItem } from "../lib/interface";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";

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
                let message = "Failed to load survey";
                if (error instanceof Error) {
                    if (error.message.includes("404")) {
                        message = "No survey was found.";
                    } else {
                        message = error.message;
                    }
                }
                setError(message);
                toast.error(message);
                console.error("Survey load error:", error);
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
            toast.success("Your survey was submitted.");
            navigate(`/survey/${id}/summary`);
        } catch (error) {
            console.error(error, "error submitting survey");
            toast.error("Something went wrong. Please try again.");

        }
    };

    return (
        <div>
            <Header />
            <div className="flex items-baseline bg-gray-100 w-full min-h-screen p-6 justify-center">
                {isLoading && <LoadingSpinner />}

                {error && (
                    <ErrorMessage error={error} />
                )}
                {survey && (
                    <motion.div  
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }} 
                    className="md:py-5 md:px-6 p-3 border-gray-300 border-[1px] rounded-2xl bg-white shadow-md w-full md:w-[60%]">
                        <div className="mx-4 shadow-[0_2px_3px_-2px_rgba(0,0,0,0.1)] pb-3">
                            <p className="font-bold text-center mb-1">{survey.title}</p>
                            <p className="text-sm md:text-base text-center">{survey.description}</p>
                        </div>
                        <div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}>
                                {survey.questions.map((item) => (
                                    <div className="mx-4 shadow-[0_2px_3px_-2px_rgba(0,0,0,0.1)] pb-3 pt-3" key={item.id}>
                                        <label className="block w-full text-left md:text-center text-sm md:text-base">{item.question}</label>
                                        {item.type === "multiple_choice" || item.type === "single_choice" && validationErrors[item.id] && (
                                            <p className="text-red-500 font-semibold md:text-center">
                                                {validationErrors[item.id]}
                                            </p>
                                        )}
                                        <div className="flex md:justify-center gap-4 md:items-center flex-col md:flex-row mt-3 mx-auto">
                                            {/* single choice */}
                                            {item.type === "single_choice" && item.options?.map((option) => (
                                                <div className="flex gap-1 text-sm mt-1" key={option}>
                                                    <input
                                                        className="text-sm"
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
                                                <div className="flex gap-1 text-sm mt-1" key={option}>
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
                                    </div>
                                ))}
                                <div className="mt-2 py-2 flex justify-center">
                                    <button className="hover:bg-emerald-300 transition-colors duration-300 cursor-pointer bg-emerald-400 py-2 rounded-full px-5 text-sm " type="submit">
                                        Submit Survey
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
};

export default SurveyPage;