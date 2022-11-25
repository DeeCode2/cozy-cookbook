import { useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { UserAuth } from "../config/AuthContext.js";

function Navbar() {
    //user auth
    //get user auth and logout functions from config
    const {user, logout} = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (e) {
            console.log(e.message);
        };
    };

    //function to make navbar responsive

    //navbar ui

    return (
        <nav>
            <ul>
                <li><NavLink to="/recipes">Recipes</NavLink></li>
                <li><NavLink to="/shoppinglists">Shopping Lists</NavLink></li>
                <li><NavLink to="/create">Create</NavLink></li>
                <li><button onClick={handleLogout}>Log Out</button></li>
            </ul>

            
            {/*
            menu icon for mobile nav
            <div className="burger" onClick={navSlide}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </div>
            */}
        </nav>
    )
}

export default Navbar;