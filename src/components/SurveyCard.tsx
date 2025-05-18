import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Survey } from "../lib/interface";


const SurveyCard = ({ id, title, description }: Survey) => {

    return (
        <Link to={`/survey/${id}`}>
            <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.3, delay: 0.3 }}             
            className="transition-transform duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg text-center md:py-5 md:px-6 p-3 border-gray-300 border-[1px] rounded-2xl bg-white shadow-md">
                <p className="font-bold">{title}</p>
                <p className="text-sm md:text-base">{description}</p>
            </motion.div>
        </Link>
    )
};

export default SurveyCard;