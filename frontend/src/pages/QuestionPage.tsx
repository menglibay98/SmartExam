import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import {
    getQuestions,
    addQuestion,
    deleteQuestion,
    type Question
} from "../api/questionApi";

import "./QuestionPage.css";


function QuestionPage() {

    const navigate = useNavigate();

    const { quizId } = useParams();

    const currentQuizId = Number(quizId);


    const [questions, setQuestions] =
        useState<Question[]>([]);

    const [questionText, setQuestionText] =
        useState("");

    const [optionA, setOptionA] =
        useState("");

    const [optionB, setOptionB] =
        useState("");

    const [optionC, setOptionC] =
        useState("");

    const [optionD, setOptionD] =
        useState("");

    const [correctAnswer, setCorrectAnswer] =
        useState("A");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================
    // LOAD QUESTIONS
    // =========================

    const loadQuestions = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getQuestions(currentQuizId);

            setQuestions(data);

        } catch (error) {

            console.error(error);

            setError(
                "Не удалось загрузить вопросы."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        if (!Number.isNaN(currentQuizId)) {
            loadQuestions();
        }

    }, [currentQuizId]);


    // =========================
    // ADD QUESTION
    // =========================

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");

            await addQuestion(
                currentQuizId,
                {
                    questionText,
                    optionA,
                    optionB,
                    optionC,
                    optionD,
                    correctAnswer
                }
            );


            // Clear form

            setQuestionText("");
            setOptionA("");
            setOptionB("");
            setOptionC("");
            setOptionD("");
            setCorrectAnswer("A");


            // Reload questions

            await loadQuestions();

        } catch (error) {

            console.error(error);

            setError(
                "Не удалось добавить вопрос."
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================
    // DELETE QUESTION
    // =========================

    const handleDelete = async (
        questionId: number
    ) => {

        const confirmed = window.confirm(
            "Вы уверены, что хотите удалить этот вопрос?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await deleteQuestion(questionId);

            setQuestions(
                (currentQuestions) =>
                    currentQuestions.filter(
                        (question) =>
                            question.id !== questionId
                    )
            );

        } catch (error) {

            console.error(error);

            setError(
                "Не удалось удалить вопрос."
            );
        }
    };


    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="questions-header">

                <div>

                    <h1>
                        Управление вопросами
                    </h1>

                    <p>
                        Добавляйте и управляйте вопросами
                        для теста №{currentQuizId}.
                    </p>

                </div>


                <button
                    className="questions-back-button"
                    onClick={() =>
                        navigate("/teacher/quizzes")
                    }
                >
                    ← Вернуться к тестам
                </button>

            </div>


            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            <div className="questions-grid">


                {/* LEFT — ADD QUESTION */}

                <div className="question-panel">

                    <h2>
                        Добавить вопрос
                    </h2>


                    <form
                        className="question-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="question-form-group">

                            <label>
                                Вопрос
                            </label>

                            <textarea
                                placeholder="Введите текст вопроса..."
                                value={questionText}
                                onChange={(e) =>
                                    setQuestionText(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* OPTION A */}

                        <div className="question-form-group">

                            <label>
                                Варианты ответов
                            </label>

                            <div className="option-row">

                                <span className="option-letter">
                                    A
                                </span>

                                <input
                                    type="text"
                                    placeholder="Вариант A"
                                    value={optionA}
                                    onChange={(e) =>
                                        setOptionA(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* OPTION B */}

                        <div className="option-row">

                            <span className="option-letter">
                                B
                            </span>

                            <input
                                type="text"
                                placeholder="Вариант B"
                                value={optionB}
                                onChange={(e) =>
                                    setOptionB(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* OPTION C */}

                        <div className="option-row">

                            <span className="option-letter">
                                C
                            </span>

                            <input
                                type="text"
                                placeholder="Вариант C"
                                value={optionC}
                                onChange={(e) =>
                                    setOptionC(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* OPTION D */}

                        <div className="option-row">

                            <span className="option-letter">
                                D
                            </span>

                            <input
                                type="text"
                                placeholder="Вариант D"
                                value={optionD}
                                onChange={(e) =>
                                    setOptionD(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* CORRECT ANSWER */}

                        <div className="question-form-group">

                            <label>
                                Правильный ответ
                            </label>

                            <select
                                value={correctAnswer}
                                onChange={(e) =>
                                    setCorrectAnswer(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="A">
                                    A — Вариант A
                                </option>

                                <option value="B">
                                    B — Вариант B
                                </option>

                                <option value="C">
                                    C — Вариант C
                                </option>

                                <option value="D">
                                    D — Вариант D
                                </option>

                            </select>

                        </div>


                        <button
                            type="submit"
                            className="add-question-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Добавление..."
                                : "+ Добавить вопрос"}
                        </button>

                    </form>

                </div>


                {/* RIGHT — QUESTIONS */}

                <div className="question-panel">

                    <h2>
                        Вопросы{" "}
                        <span className="question-count">
                            ({questions.length})
                        </span>
                    </h2>


                    {loading ? (

                        <p>
                            Загрузка вопросов...
                        </p>

                    ) : questions.length === 0 ? (

                        <div className="empty-questions">

                            <p>
                                Вопросы пока не добавлены.
                            </p>

                        </div>

                    ) : (

                        <div className="question-list">

                            {questions.map(
                                (question, index) => (

                                    <div
                                        className="question-item"
                                        key={question.id}
                                    >

                                        <div className="question-item-header">

                                            <div>

                                                <p className="question-number">
                                                    ВОПРОС {index + 1}
                                                </p>

                                                <p className="question-text">
                                                    {question.questionText}
                                                </p>

                                            </div>


                                            <button
                                                className="delete-question-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        question.id
                                                    )
                                                }
                                            >
                                                Удалить
                                            </button>

                                        </div>


                                        <div className="question-options">

                                            <div className="question-option">
                                                <strong>A.</strong>{" "}
                                                {question.optionA}
                                            </div>

                                            <div className="question-option">
                                                <strong>B.</strong>{" "}
                                                {question.optionB}
                                            </div>

                                            <div className="question-option">
                                                <strong>C.</strong>{" "}
                                                {question.optionC}
                                            </div>

                                            <div className="question-option">
                                                <strong>D.</strong>{" "}
                                                {question.optionD}
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>
    );
}

export default QuestionPage;