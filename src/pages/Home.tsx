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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const surveysPerPage = 20;

    const indexOfLast = currentPage * surveysPerPage;
    const indexOfFirst = indexOfLast - surveysPerPage;
    const currentSurveys = surveys.slice(indexOfFirst, indexOfLast);

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
                    <div className="flex flex-col mx-auto items-center">
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 p-6 gap-5 px-4">
                            {currentSurveys.map((item) => (
                                <SurveyCard key={item.id} {...item} />
                            ))}
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(surveys.length / surveysPerPage) }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-emerald-400 text-white' : 'bg-gray-200'} cursor-pointer`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Home;