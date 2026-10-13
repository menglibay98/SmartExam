import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout
    from "../components/DashboardLayout";

import {
    getAdminDashboard,
    type AdminDashboardResponse
} from "../api/adminApi";

import "./AdminDashboard.css";


function AdminDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] =
        useState<AdminDashboardResponse | null>(null);

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
                    await getAdminDashboard();

                setDashboard(data);

            } catch (error) {

                console.error(error);

                setError(
                    "Не удалось загрузить статистику."
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

            <div className="admin-header">

                <h1>
                    Панель администратора
                </h1>

                <p>
                    Добро пожаловать,{" "}
                    <strong>
                        {user?.name} {user?.surname}
                    </strong>
                </p>

            </div>


            {/* ERROR */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* STATISTICS */}

            {loading ? (

                <p>
                    Загрузка статистики...
                </p>

            ) : dashboard && (

                <div className="stats-grid">

                    <div className="stat-card">

                        <p className="stat-title">
                            Всего студентов
                        </p>

                        <p className="stat-value">
                            {dashboard.totalStudents}
                        </p>

                    </div>


                    <div className="stat-card">

                        <p className="stat-title">
                            Всего преподавателей
                        </p>

                        <p className="stat-value">
                            {dashboard.totalTeachers}
                        </p>

                    </div>


                    <div className="stat-card">

                        <p className="stat-title">
                            Всего тестов
                        </p>

                        <p className="stat-value">
                            {dashboard.totalQuizzes}
                        </p>

                    </div>


                    <div className="stat-card">

                        <p className="stat-title">
                            Всего попыток
                        </p>

                        <p className="stat-value">
                            {dashboard.totalAttempts}
                        </p>

                    </div>

                </div>

            )}


            {/* MANAGEMENT */}

            <div className="management-section">

                <h2>
                    Управление
                </h2>

                <div
                    className="management-card"
                    onClick={() =>
                        navigate("/admin/teachers")
                    }
                >

                    <div>

                        <h3>
                            Управление преподавателями
                        </h3>

                        <p>
                            Создавайте учетные записи
                            и управляйте преподавателями.
                        </p>

                    </div>

                    <div className="management-arrow">
                        →
                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default AdminDashboard;