import { useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const userString =
        localStorage.getItem("user");

    const user = userString
        ? JSON.parse(userString)
        : null;

    const getRoleName = (role: string) => {

        switch (role) {
            case "ADMIN":
                return "Администратор";

            case "TEACHER":
                return "Преподаватель";

            case "STUDENT":
                return "Студент";

            default:
                return role;
        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <header className="navbar">

            <div className="navbar-logo">

                <div className="navbar-logo-icon">
                    S
                </div>

                <h2>
                    SmartExam
                </h2>

            </div>

            {user && (

                <div className="navbar-user">

                    <div className="navbar-user-info">

                        <span className="navbar-name">
                            {user.name} {user.surname}
                        </span>

                        <span className="navbar-role">
                            {getRoleName(user.role)}
                        </span>

                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Выйти
                    </button>

                </div>

            )}

        </header>
    );
}

export default Navbar;