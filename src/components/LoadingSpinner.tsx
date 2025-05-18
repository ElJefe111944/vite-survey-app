import { GridLoader } from "react-spinners";

const LoadingSpinner = () => {

    return (
            <div className="w-full h-full absolute flex justify-center items-center">
                <GridLoader color="black" />
            </div>
    )
};

export default LoadingSpinner;