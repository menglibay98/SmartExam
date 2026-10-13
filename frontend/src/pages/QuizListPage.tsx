import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import {
    getAllQuizzes,
    deleteQuiz,
    type Quiz
} from "../api/quizApi";

import "./QuizListPage.css";

function QuizListPage() {
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadQuizzes = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllQuizzes();

            setQuizzes(data);
        } catch (error) {
            console.error(error);
            setError("Не удалось загрузить тесты.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuizzes();
    }, []);

    const handleDelete = async (quizId: number) => {
        const confirmed = window.confirm(
            "Вы уверены, что хотите удалить этот тест?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteQuiz(quizId);

            setQuizzes((currentQuizzes) =>
                currentQuizzes.filter(
                    (quiz) => quiz.id !== quizId
                )
            );
        } catch (error) {
            console.error(error);
            setError("Не удалось удалить тест.");
        }
    };

    return (
        <DashboardLayout>

            <div className="quiz-page-header">
                <div>
                    <h1>Управление тестами</h1>

                    <p>
                        Создавайте тесты и управляйте вопросами.
                    </p>
                </div>

                <button
                    className="create-quiz-button"
                    onClick={() =>
                        navigate("/teacher/quizzes/create")
                    }
                >
                    + Создать тест
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <p>Загрузка тестов...</p>
            ) : quizzes.length === 0 ? (
                <div className="empty-quizzes">
                    <h3>Тестов пока нет</h3>

                    <p>
                        Создайте первый тест для
                        проверки знаний студентов.
                    </p>

                    <button
                        className="create-quiz-button"
                        onClick={() =>
                            navigate("/teacher/quizzes/create")
                        }
                    >
                        + Создать тест
                    </button>
                </div>
            ) : (
                <div className="quiz-list">
                    {quizzes.map((quiz) => (
                        <div
                            className="quiz-card"
                            key={quiz.id}
                        >
                            <div className="quiz-info">
                                <h3>{quiz.title}</h3>

                                <p className="quiz-description">
                                    {quiz.description ||
                                        "Описание отсутствует"}
                                </p>

                                <div className="quiz-meta">
                                    <span className="quiz-badge">
                                        Тест №{quiz.id}
                                    </span>

                                    <span className="quiz-badge">
                                        {quiz.timeLimit
                                            ? `${quiz.timeLimit} мин.`
                                            : "Без ограничения времени"}
                                    </span>
                                </div>
                            </div>

                            <div className="quiz-actions">

                                <button
                                    className="manage-questions-button"
                                    onClick={() =>
                                        navigate(
                                            `/teacher/quizzes/${quiz.id}/questions`
                                        )
                                    }
                                >
                                    Управление вопросами
                                </button>

                                <button
                                    className="view-results-button"
                                    onClick={() =>
                                        navigate(
                                            `/teacher/quizzes/${quiz.id}/results`
                                        )
                                    }
                                >
                                    Результаты
                                </button>

                                <button
                                    className="delete-quiz-button"
                                    onClick={() =>
                                        handleDelete(quiz.id)
                                    }
                                >
                                    Удалить
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            )}

        </DashboardLayout>
    );
}

export default QuizListPage;