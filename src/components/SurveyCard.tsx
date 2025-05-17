import { Link } from "react-router-dom";
import type { Survey } from "../lib/interface";


const SurveyCard = ({ id, title, description }: Survey) => {

    return (
            <div>
                <p>{id}</p>
                <p>{title}</p>
                <p>{description}</p>
            </div>
    )
};

export default SurveyCard;