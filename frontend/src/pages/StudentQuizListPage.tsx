import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import {
    getAllQuizzes,
    type Quiz
} from "../api/quizApi";

import "./StudentQuizListPage.css";


function StudentQuizListPage() {

    const navigate = useNavigate();

    const [quizzes, setQuizzes] =
        useState<Quiz[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadQuizzes = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getAllQuizzes();

                setQuizzes(data);

            } catch (error) {

                console.error(error);

                setError(
                    "Не удалось загрузить тесты."
                );

            } finally {

                setLoading(false);

            }
        };

        loadQuizzes();

    }, []);


    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="student-quizzes-header">

                <div>

                    <h1>
                        Доступные тесты
                    </h1>

                    <p>
                        Выберите тест и начните прохождение,
                        когда будете готовы.
                    </p>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* CONTENT */}

            {loading ? (

                <p className="student-quizzes-loading">
                    Загрузка тестов...
                </p>

            ) : quizzes.length === 0 ? (

                <div className="student-quizzes-empty">

                    <h3>
                        Нет доступных тестов
                    </h3>

                    <p>
                        В настоящее время доступные
                        тесты отсутствуют.
                    </p>

                </div>

            ) : (

                <div className="student-quiz-grid">

                    {quizzes.map((quiz) => (

                        <div
                            className="student-quiz-card"
                            key={quiz.id}
                        >

                            <div className="student-quiz-card-content">

                                <div className="student-quiz-badge">
                                    ТЕСТ
                                </div>


                                <h2>
                                    {quiz.title}
                                </h2>


                                <p className="student-quiz-description">

                                    {quiz.description ||
                                        "Описание отсутствует."}

                                </p>


                                <div className="student-quiz-meta">

                                    <span>
                                        Тест №{quiz.id}
                                    </span>

                                    <span>
                                        {quiz.timeLimit
                                            ? `${quiz.timeLimit} мин.`
                                            : "Без ограничения времени"}
                                    </span>

                                </div>

                            </div>


                            <button
                                className="start-quiz-button"
                                onClick={() =>
                                    navigate(
                                        `/student/quizzes/${quiz.id}`
                                    )
                                }
                            >
                                Начать тест
                                <span>→</span>
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </DashboardLayout>

    );
}

export default StudentQuizListPage;