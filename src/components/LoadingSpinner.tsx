import { GridLoader } from "react-spinners";

const LoadingSpinner = () => {

    return (
            <div className="w-full h-full flex justify-center items-center bg-white fixed top-0 bottom-0 right-0 left-0">
                <GridLoader color="oklch(69.6% 0.17 162.48)" />
            </div>
    )
};

export default LoadingSpinner;