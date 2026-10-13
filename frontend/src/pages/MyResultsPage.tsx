import { useEffect, useState } from "react";

import DashboardLayout from "../components/DashboardLayout";

import {
    getMyResults,
    type StudentResult
} from "../api/resultApi";

import "./MyResultsPage.css";


function MyResultsPage() {

    const [results, setResults] =
        useState<StudentResult[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadResults = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getMyResults();

                setResults(data);

            } catch (error) {

                console.error(error);

                setError(
                    "Не удалось загрузить результаты."
                );

            } finally {

                setLoading(false);

            }
        };

        loadResults();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <DashboardLayout>

                <p className="results-loading">
                    Загрузка результатов...
                </p>

            </DashboardLayout>

        );
    }


    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="results-header">

                <div>

                    <h1>
                        Мои результаты
                    </h1>

                    <p>
                        Просматривайте результаты,
                        баллы и оценки за пройденные тесты.
                    </p>

                </div>


                <div className="results-count">

                    <span>
                        Пройдено
                    </span>

                    <strong>
                        {results.length}
                    </strong>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="results-error">
                    {error}
                </div>

            )}


            {/* EMPTY */}

            {!error && results.length === 0 ? (

                <div className="results-empty">

                    <div className="results-empty-icon">
                        Р
                    </div>

                    <h3>
                        Результатов пока нет
                    </h3>

                    <p>
                        Пройдите свой первый тест,
                        и результат появится здесь.
                    </p>

                </div>

            ) : !error && (

                /* RESULTS TABLE */

                <div className="results-card">

                    <div className="results-table-container">

                        <table className="results-table">

                            <thead>

                                <tr>

                                    <th>Тест</th>

                                    <th>Правильные ответы</th>

                                    <th>Количество вопросов</th>

                                    <th>Результат</th>

                                    <th>Оценка</th>

                                    <th>Дата прохождения</th>

                                </tr>

                            </thead>


                            <tbody>

                                {results.map((result) => (

                                    <tr key={result.id}>

                                        <td className="result-quiz-name">

                                            {result.quizTitle}

                                        </td>


                                        <td>

                                            {result.correctAnswers}

                                        </td>


                                        <td>

                                            {result.totalQuestions}

                                        </td>


                                        <td>

                                            <span className="result-percentage">

                                                {result.percentage.toFixed(1)}%

                                            </span>

                                        </td>


                                        <td>

                                            <span
                                                className={`grade-badge grade-${result.grade.toLowerCase()}`}
                                            >

                                                {result.grade}

                                            </span>

                                        </td>


                                        <td className="result-date">

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

                    </div>

                </div>

            )}

        </DashboardLayout>

    );
}

export default MyResultsPage;