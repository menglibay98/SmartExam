import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import { createQuiz } from "../api/quizApi";

import "./CreateQuizPage.css";


function CreateQuizPage() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [timeLimit, setTimeLimit] = useState(30);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        try {

            setLoading(true);
            setError("");

            const quiz = await createQuiz({
                title,
                description,
                timeLimit
            });

            navigate(
                `/teacher/quizzes/${quiz.id}/questions`
            );

        } catch (error) {

            console.error(error);

            setError("Не удалось создать тест.");

        } finally {

            setLoading(false);
        }
    };


    return (

        <DashboardLayout>

            <div className="create-quiz-header">

                <h1>Создание теста</h1>

                <p>
                    Создайте новый тест для студентов.
                </p>

            </div>


            <div className="create-quiz-card">

                <h2>Информация о тесте</h2>


                <form
                    className="quiz-form"
                    onSubmit={handleSubmit}
                >

                    {/* TITLE */}

                    <div className="quiz-form-group">

                        <label htmlFor="title">
                            Название теста
                        </label>

                        <input
                            id="title"
                            type="text"
                            placeholder="Например: Тест по Java OOP"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="quiz-form-group">

                        <label htmlFor="description">
                            Описание
                        </label>

                        <textarea
                            id="description"
                            placeholder="Введите описание теста..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                    </div>


                    {/* TIME LIMIT */}

                    <div className="quiz-form-group">

                        <label htmlFor="timeLimit">
                            Время на выполнение
                        </label>

                        <input
                            id="timeLimit"
                            type="number"
                            min="1"
                            value={timeLimit}
                            onChange={(e) =>
                                setTimeLimit(
                                    Number(e.target.value)
                                )
                            }
                            required
                        />

                        <p className="quiz-form-hint">
                            Время выполнения указывается в минутах.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}


                    {/* BUTTONS */}

                    <div className="quiz-form-actions">

                        <button
                            type="submit"
                            className="save-quiz-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Создание..."
                                : "Создать тест"}
                        </button>


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/teacher/quizzes")
                            }
                        >
                            Отмена
                        </button>

                    </div>

                </form>

            </div>

        </DashboardLayout>
    );
}

export default CreateQuizPage;