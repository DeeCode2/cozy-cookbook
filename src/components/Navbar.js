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
                {/* <li><NavLink to="/shoppinglists">Shopping Lists</NavLink></li> */}
                <li><NavLink to="/create">Create</NavLink></li>
                <li><button onClick={handleLogout} className="btn yellow-btn">Log Out</button></li>
            </ul>
        </nav>
    )
}

export default Navbar;