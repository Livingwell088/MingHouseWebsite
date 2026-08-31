import { Outlet } from "react-router-dom";
import Appbar from "./components/Appbar";
import Footer from "./components/Footer";
import MingBot from "./components/MingBot";

const MainLayout = () => {
    return (
        <>
            <Appbar />
            <Outlet />
            <Footer />
            <MingBot />
        </>
    );
};

export default MainLayout;
