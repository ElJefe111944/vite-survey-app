import { useEffect, useState, useRef } from "react";
import { fetchSurveys } from "../lib/api";
import type { Survey } from "../lib/interface";

const Home = () => {
    const intialized = useRef<boolean>(false);

    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSurveys = async () => {

            if (intialized.current) return;
            intialized.current = true;

            try {
                const data = await fetchSurveys();
                setSurveys(data);
            } catch (error) {
                setError("Failed to load surveys");
                console.error("Failed to load surveys: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSurveys();
    }, []);

    return (
        <h1 className="text-center">HomePage</h1>
    )
};

export default Home;