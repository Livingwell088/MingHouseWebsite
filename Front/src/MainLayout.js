import { Outlet } from "react-router-dom";
import Appbar from "./components/Appbar";
import Footer from "./components/Footer";

const MainLayout = () => {
    return (
        <>
            <Appbar />
            <Outlet />
            <Footer />
        </>
    );
};

export default MainLayout;