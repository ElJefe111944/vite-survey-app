import { GridLoader } from "react-spinners";

const LoadingSpinner = () => {

    return (
            <div className="w-full h-full absolute flex justify-center items-center bg-white">
                <GridLoader color="oklch(69.6% 0.17 162.48)" />
            </div>
    )
};

export default LoadingSpinner;