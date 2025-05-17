import { Link } from "react-router-dom";
import type { Survey } from "../lib/interface";


const SurveyCard = ({ id, title, description }: Survey) => {

    return (
        <Link to={`/survey/${id}`}>
            <div className="text-center">
                <p>{title}</p>
                <p>{description}</p>
            </div>
        </Link>
    )
};

export default SurveyCard;