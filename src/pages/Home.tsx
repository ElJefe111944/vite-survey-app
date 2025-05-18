import { useEffect, useState, useRef } from "react";
import { fetchSurveys } from "../lib/api";
import type { Survey } from "../lib/interface";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import SurveyCard from "../components/SurveyCard";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";

const Home = () => {
    const initialized = useRef<boolean>(false);

    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSurveys = async () => {

            if (initialized.current) return;
            initialized.current = true;

            try {
                const data = await fetchSurveys();
                setSurveys(data);
            } catch (error) {
                let message = "Failed to load surveys";
                if (error instanceof Error) {
                    if (error.message.includes("404")) {
                        message = "No surveys were found.";
                    } else {
                        message = error.message;
                    }
                }
                setError(message);
                toast.error(message);
                console.error("Survey load error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSurveys();
    }, []);

    return (
        <div>
            <Header />
            <div className="flex items-baseline bg-gray-100 w-full min-h-screen">
                {isLoading && <LoadingSpinner />}

                {error && (
                    <ErrorMessage error={error} />
                )}

                {!isLoading && !error && (
                    <div className="mx-auto grid sm:grid-cols-1 md:grid-cols-2 p-6 gap-5 px-4">
                        {surveys.map((item) => (
                            <SurveyCard key={item.id} {...item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
};

export default Home;