import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import {
    getTeacherDashboard,
    type DashboardResponse
} from "../api/dashboardApi";

import "./TeacherDashboard.css";


function TeacherDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const userString =
        localStorage.getItem("user");

    const user = userString
        ? JSON.parse(userString)
        : null;


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getTeacherDashboard();

                setDashboard(data);

            } catch (error) {

                console.error(error);

                setError(
                    "Не удалось загрузить панель преподавателя."
                );

            } finally {

                setLoading(false);

            }
        };

        loadDashboard();

    }, []);


    return (
        <DashboardLayout>

            {/* HEADER */}

            <div className="teacher-dashboard-header">

                <h1>
                    Панель преподавателя
                </h1>

                <p>
                    Добро пожаловать,{" "}
                    <strong>
                        {user?.name} {user?.surname}
                    </strong>
                </p>

            </div>


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {loading ? (

                <p>
                    Загрузка панели...
                </p>

            ) : dashboard && (

                <>

                    {/* STATISTICS */}

                    <div className="teacher-stats-grid">

                        <div className="teacher-stat-card">

                            <p className="teacher-stat-title">
                                Всего студентов
                            </p>

                            <p className="teacher-stat-value">
                                {dashboard.totalStudents}
                            </p>

                        </div>


                        <div className="teacher-stat-card">

                            <p className="teacher-stat-title">
                                Всего тестов
                            </p>

                            <p className="teacher-stat-value">
                                {dashboard.totalQuizzes}
                            </p>

                        </div>


                        <div className="teacher-stat-card">

                            <p className="teacher-stat-title">
                                Всего попыток
                            </p>

                            <p className="teacher-stat-value">
                                {dashboard.totalAttempts}
                            </p>

                        </div>


                        <div className="teacher-stat-card">

                            <p className="teacher-stat-title">
                                Средний результат
                            </p>

                            <p className="teacher-stat-value">
                                {dashboard.averageScore.toFixed(1)}%
                            </p>

                        </div>

                    </div>


                    {/* QUIZ MANAGEMENT */}

                    <div className="teacher-section">

                        <h2 className="teacher-section-title">
                            Управление тестами
                        </h2>

                        <div
                            className="teacher-action-card"
                            onClick={() =>
                                navigate("/teacher/quizzes")
                            }
                        >

                            <div>

                                <h3>
                                    Управление тестами
                                </h3>

                                <p>
                                    Создавайте тесты, добавляйте
                                    вопросы и управляйте заданиями.
                                </p>

                            </div>

                            <div className="teacher-action-arrow">
                                →
                            </div>

                        </div>

                    </div>


                    {/* RECENT RESULTS */}

                    <div className="results-card">

                        <h2>
                            Последние результаты
                        </h2>


                        {dashboard.recentResults.length === 0 ? (

                            <p>
                                Результатов тестирования пока нет.
                            </p>

                        ) : (

                            <div className="results-table-container">

                                <table className="results-table">

                                    <thead>

                                        <tr>
                                            <th>Студент</th>
                                            <th>Тест</th>
                                            <th>Результат</th>
                                            <th>Оценка</th>
                                            <th>Дата</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {dashboard.recentResults.map(
                                            (result, index) => (

                                                <tr key={index}>

                                                    <td className="student-name">
                                                        {result.studentName}
                                                    </td>

                                                    <td>
                                                        {result.quizTitle}
                                                    </td>

                                                    <td>
                                                        {result.percentage.toFixed(1)}%
                                                    </td>

                                                    <td>

                                                        <span className="grade-badge">
                                                            {result.grade}
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {new Date(
                                                            result.completedAt
                                                        ).toLocaleString(
                                                            "ru-RU"
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </>

            )}

        </DashboardLayout>
    );
}

export default TeacherDashboard;