import { useEffect, useState, useRef } from "react";
import { fetchSurveys } from "../lib/api";
import type { Survey } from "../lib/interface";
import { CgMenuGridO } from "react-icons/cg";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import SurveyCard from "../components/SurveyCard";
import ErrorMessage from "../components/ErrorMessage";

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
            <div>
                <h1 className="text-center">Surveys</h1> <CgMenuGridO />
            </div>
            <div>
                {isLoading && <LoadingSpinner />}

                {error && (
                    <ErrorMessage error={error} />
                )}

                {!isLoading && !error && (
                    <div>
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