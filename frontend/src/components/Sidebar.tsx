import { NavLink } from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {

    const role =
        localStorage.getItem("role");

    const getLinkClass = ({
        isActive
    }: {
        isActive: boolean;
    }) => {
        return isActive
            ? "sidebar-link active"
            : "sidebar-link";
    };

    return (
        <aside className="sidebar">

            <div className="sidebar-title">
                МЕНЮ
            </div>

            <nav className="sidebar-nav">

                {role === "ADMIN" && (
                    <>
                        <NavLink
                            to="/admin/dashboard"
                            className={getLinkClass}
                        >
                            Панель управления
                        </NavLink>

                        <NavLink
                            to="/admin/teachers"
                            className={getLinkClass}
                        >
                            Преподаватели
                        </NavLink>
                    </>
                )}

                {role === "TEACHER" && (
                    <>
                        <NavLink
                            to="/teacher/dashboard"
                            className={getLinkClass}
                        >
                            Панель управления
                        </NavLink>

                        <NavLink
                            to="/teacher/quizzes"
                            className={getLinkClass}
                        >
                            Тесты
                        </NavLink>
                    </>
                )}

                {role === "STUDENT" && (
                    <>
                        <NavLink
                            to="/student/dashboard"
                            className={getLinkClass}
                        >
                            Панель управления
                        </NavLink>

                        <NavLink
                            to="/student/quizzes"
                            className={getLinkClass}
                        >
                            Доступные тесты
                        </NavLink>

                        <NavLink
                            to="/student/results"
                            className={getLinkClass}
                        >
                            Мои результаты
                        </NavLink>
                    </>
                )}

            </nav>

        </aside>
    );
}

export default Sidebar;