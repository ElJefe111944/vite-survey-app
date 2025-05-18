import { CgMenuGridO } from "react-icons/cg";
import { Link } from "react-router-dom";

const Header = () => {

    return (
        <div className="relative">
            <div className="mx-4 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1)] bg-white p-4 rounded">
                <Link to="/" className="flex justify-center items-center gap-1">
                    <h1 className="text-center text-2xl font-semibold">Survey <span className="">Grid</span></h1> <CgMenuGridO color="oklch(69.6% 0.17 162.48)" size={30} />
                </Link>
            </div>
        </div>
    )
};

export default Header;