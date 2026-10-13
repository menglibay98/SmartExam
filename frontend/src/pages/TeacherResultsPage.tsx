import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getQuizResults,
    type TeacherQuizResult
} from "../api/resultApi";

import "./TeacherResultsPage.css";

function TeacherResultsPage() {

    const { quizId } = useParams();
    const navigate = useNavigate();

    const [results, setResults] =
        useState<TeacherQuizResult[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadResults = async () => {

            if (!quizId) {
                setError("Идентификатор теста не найден.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data =
                    await getQuizResults(
                        Number(quizId)
                    );

                setResults(data);

            } catch (error) {

                console.error(error);

                setError(
                    "Не удалось загрузить результаты теста."
                );

            } finally {
                setLoading(false);
            }
        };

        loadResults();

    }, [quizId]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="teacher-results-page">

                <div className="teacher-results-state">
                    Загрузка результатов...
                </div>

            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="teacher-results-page">

                <div className="teacher-results-state">

                    <h2>
                        Произошла ошибка
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="teacher-results-back-button"
                        onClick={() =>
                            navigate("/teacher/quizzes")
                        }
                    >
                        Вернуться к тестам
                    </button>

                </div>

            </div>
        );
    }


    // =========================
    // RESULTS
    // =========================

    return (
        <div className="teacher-results-page">

            <div className="teacher-results-header">

                <button
                    className="teacher-results-back"
                    onClick={() =>
                        navigate("/teacher/quizzes")
                    }
                >
                    ← Вернуться к тестам
                </button>

                <h1>
                    Результаты теста
                </h1>

                <p>
                    Просматривайте результаты
                    и успеваемость студентов.
                </p>

            </div>


            <div className="teacher-results-card">

                {results.length === 0 ? (

                    <div className="teacher-results-empty">

                        <h3>
                            Результатов пока нет
                        </h3>

                        <p>
                            Этот тест пока не прошёл
                            ни один студент.
                        </p>

                    </div>

                ) : (

                    <table className="teacher-results-table">

                        <thead>

                            <tr>
                                <th>Студент</th>
                                <th>Правильные ответы</th>
                                <th>Результат</th>
                                <th>Оценка</th>
                                <th>Дата прохождения</th>
                            </tr>

                        </thead>

                        <tbody>

                            {results.map((result) => (

                                <tr key={result.id}>

                                    <td className="student-name">
                                        {result.studentName}
                                    </td>

                                    <td className="result-score">
                                        {result.correctAnswers} /{" "}
                                        {result.totalQuestions}
                                    </td>

                                    <td>
                                        {result.percentage.toFixed(1)}%
                                    </td>

                                    <td>

                                        <span className="grade-badge">
                                            {result.grade}
                                        </span>

                                    </td>

                                    <td className="completed-date">

                                        {new Date(
                                            result.completedAt
                                        ).toLocaleString(
                                            "ru-RU"
                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default TeacherResultsPage;