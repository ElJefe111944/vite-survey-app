import { useEffect, useState } from "react";
import { fetchSurveys } from "../lib/api";

const Home = () => {

    const [surveys, setSurveys] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSurveys = async () => {
            console.log("Loading surveys")
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