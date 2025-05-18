import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import type { Survey, SurveyResultsOut } from "../lib/interface";
import { fetchSurvey, fetchSurveySummary } from "../lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const SurveySummary = () => {
    const { id } = useParams();

    const initialized = useRef<boolean>(false);

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [surveyResults, setSurveyResults] = useState<SurveyResultsOut[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 400);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 400);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


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
                let message = "Failed to load survey summary";
                if (error instanceof Error) {
                    if (error.message.includes("404")) {
                        message = "No survey summary was found.";
                    } else {
                        message = error.message;
                    }
                }
                setError(message);
                toast.error(message);
                console.error("Survey summary load error:", error);
            } finally {
                setIsLoading(false);
            };
        };

        loadSummary();
    }, [id]);



    return (
        <div>
            <Header />
            <div className="flex items-baseline bg-gray-100 w-full min-h-screen p-6 justify-center">
                {isLoading && <LoadingSpinner />}

                {error && (
                    <ErrorMessage error={error} />
                )}

                {!isLoading && !error && (
                    <div className="md:py-5 md:px-6 p-3 border-gray-300 border-[1px] rounded-2xl bg-white shadow-md w-full md:w-[60%]">
                        <div className="mx-4 shadow-[0_2px_3px_-2px_rgba(0,0,0,0.1)] pb-3">
                            <h1 className="font-bold text-center mb-1">{survey?.title} - Summary</h1>
                        </div>
                        <div>
                            {survey?.questions.map((question, idx) => {
                                const result = surveyResults[idx];

                                const data = question.options?.map((opt) => ({
                                    option: opt,
                                    votes: result.option_totals[opt] || 0
                                })) ?? [];

                                return (
                                    <div className={`my-3 rounded ${idx !== survey.questions.length - 1 ? "shadow-[0_2px_3px_-2px_rgba(0,0,0,0.1)]" : ""}`} key={question.id}>
                                        <h2 className="text-center my-3">{question.question}</h2>
                                        <p className="mb-3 text-sm">Total responses: {result?.total_votes}</p>
                                        <div className="flex justify-center pr-6">
                                        <ResponsiveContainer width="100%" height={200}>
                                            <BarChart data={data}>
                                                <XAxis dataKey="option" tick={{ fontSize: isMobile ? 7 : 10 }} />
                                                <YAxis allowDecimals={false} tick={{ fontSize: isMobile ? 7 : 10 }} />
                                                <Tooltip  contentStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} />
                                                <Bar dataKey="votes" fill="oklch(0.696 0.17 162.48)" radius={[3, 3, 3, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default SurveySummary;