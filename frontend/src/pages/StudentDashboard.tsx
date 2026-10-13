import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import "./StudentDashboard.css";


function StudentDashboard() {

    const navigate = useNavigate();

    const userString =
        localStorage.getItem("user");

    const user = userString
        ? JSON.parse(userString)
        : null;


    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="student-dashboard-header">

                <h1>
                    Панель студента
                </h1>

                <p>
                    Добро пожаловать,{" "}
                    <strong>
                        {user?.name} {user?.surname}
                    </strong>
                </p>

            </div>


            {/* QUICK ACTIONS */}

            <div className="student-section">

                <h2>
                    Быстрые действия
                </h2>

                <div className="student-action-grid">


                    {/* AVAILABLE QUIZZES */}

                    <div
                        className="student-action-card"
                        onClick={() =>
                            navigate("/student/quizzes")
                        }
                    >

                        <div className="student-action-icon">
                            Т
                        </div>

                        <div className="student-action-content">

                            <h3>
                                Доступные тесты
                            </h3>

                            <p>
                                Просмотрите доступные тесты
                                и начните прохождение.
                            </p>

                        </div>

                        <span className="student-action-arrow">
                            →
                        </span>

                    </div>


                    {/* MY RESULTS */}

                    <div
                        className="student-action-card"
                        onClick={() =>
                            navigate("/student/results")
                        }
                    >

                        <div className="student-action-icon">
                            Р
                        </div>

                        <div className="student-action-content">

                            <h3>
                                Мои результаты
                            </h3>

                            <p>
                                Просмотрите пройденные тесты,
                                баллы и оценки.
                            </p>

                        </div>

                        <span className="student-action-arrow">
                            →
                        </span>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
}

export default StudentDashboard;