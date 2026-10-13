import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
    getQuestions,
    type Question
} from "../api/questionApi";
import {
    getQuizById,
    startQuiz,
    submitQuiz,
    saveAnswer,
    getSavedAnswers,
    type Quiz,
    type QuizResult
} from "../api/quizApi";
import "./QuizPage.css";
function QuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const id = Number(quizId);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [result, setResult] = useState<QuizResult | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const autoSubmitted = useRef(false);
    const answersRef = useRef<Record<number, string>>({});
    const saveQueue = useRef<Map<number, Promise<void>>>(new Map());
    const pendingSaves = useRef<Map<number, Promise<void>>>(new Map());
    const failedSaves = useRef<Set<number>>(new Set());
    const waitForSaves = async () => {
        const saves = Array.from(pendingSaves.current.values());
        await Promise.allSettled(saves);
        if (failedSaves.current.size > 0) {
            throw new Error("Some answers were not saved");
        }
    };
    // =========================
    // LOAD QUIZ
    // =========================
    useEffect(() => {
        const loadQuiz = async () => {
            try {
                setLoading(true);
                setError("");
                setAlreadyCompleted(false);
                const attemptData = await startQuiz(id);
                const [
                    questionsData,
                    quizData,
                    savedAnswersData
                ] = await Promise.all([
                    getQuestions(id),
                    getQuizById(id),
                    getSavedAnswers(id)
                ]);
                const validQuestionIds = new Set(
                    questionsData.map(question => question.id)
                );
                const restoredAnswers: Record<number, string> = {};
                for (const saved of savedAnswersData) {
                    if (
                        validQuestionIds.has(saved.questionId) &&
                        ["A", "B", "C", "D"].includes(saved.answer)
                    ) {
                        restoredAnswers[saved.questionId] = saved.answer;
                    }
                }
                answersRef.current = restoredAnswers;
                setAnswers(restoredAnswers);
                setQuestions(questionsData);
                setQuiz(quizData);
                if (attemptData.expiresAt) {
                    const expiresAt =
                        new Date(
                            attemptData.expiresAt
                        ).getTime();
                    const now =
                        new Date().getTime();
                    const remainingSeconds =
                        Math.max(
                            0,
                            Math.floor(
                                (expiresAt - now) / 1000
                            )
                        );
                    setTimeLeft(
                        remainingSeconds
                    );
                } else {
                    setTimeLeft(null);
                }
            } catch (error: any) {
                console.error(error);
                const message =
                    error?.response?.data?.message ||
                    error?.response?.data ||
                    "";
                if (
                    String(message)
                        .toLowerCase()
                        .includes("already completed")
                ) {
                    setAlreadyCompleted(true);
                } else {
                    setError(
                        "Не удалось загрузить тест."
                    );
                }
            } finally {
                setLoading(false);
            }
        };
        if (!Number.isNaN(id)) {
            loadQuiz();
        }
    }, [id]);
    // =========================
    // TIMER
    // =========================
    useEffect(() => {
        if (
            timeLeft === null ||
            timeLeft <= 0 ||
            result ||
            alreadyCompleted
        ) {
            return;
        }
        const timer = window.setTimeout(() => {
            setTimeLeft(previous => {
                if (
                    previous === null ||
                    previous <= 1
                ) {
                    return 0;
                }
                return previous - 1;
            });
        }, 1000);
        return () => {
            window.clearTimeout(timer);
        };
    }, [
        timeLeft,
        result,
        alreadyCompleted
    ]);
    // =========================
    // AUTO SUBMIT
    // =========================
    useEffect(() => {
        if (
            timeLeft !== 0 ||
            result ||
            alreadyCompleted ||
            questions.length === 0 ||
            autoSubmitted.current
        ) {
            return;
        }
        const autoSubmit = async () => {
            autoSubmitted.current = true;
            try {
                setSubmitting(true);
                setError(
                    "Время истекло. Тест отправляется автоматически..."
                );
                await waitForSaves();
               const answerList =
                    questions.map(question => ({
                        questionId: question.id,
                        answer:
                            answersRef.current[
                                question.id
                            ] || ""
                    }));
                const response =
                    await submitQuiz(
                        id,
                        answerList
                    );
                setError("");
                setResult(response);
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            } catch (error) {
                console.error(error);
                setError(
                    "Не удалось завершить тест. Проверьте, что ответы сохранены, и обновите страницу при необходимости."
                );
                autoSubmitted.current = false;
            } finally {
                setSubmitting(false);
            }
        };
        autoSubmit();
    }, [
        timeLeft,
        result,
        alreadyCompleted,
        questions,
        id
    ]);
    // =========================
    // FORMAT TIME
    // =========================
    const formatTime = (
        seconds: number
    ) => {
        const minutes =
            Math.floor(
                seconds / 60
            );
        const remainingSeconds =
            seconds % 60;
        return (
            `${String(minutes)
                .padStart(2, "0")}:` +
            `${String(remainingSeconds)
                .padStart(2, "0")}`
        );
    };
    // =========================
    // SELECT ANSWER
    // =========================
    const handleAnswer = (questionId: number, answer: string) => {
        if (timeLeft === 0 || submitting) return;
        const updatedAnswers = {
            ...answersRef.current,
            [questionId]: answer
        };
        answersRef.current = updatedAnswers;
        setAnswers(updatedAnswers);
        setError("");
        // Serialise updates for the same question to avoid stale overwrites.
        const previous = saveQueue.current.get(questionId) ?? Promise.resolve();
        const request = previous
            .catch(() => {})
            .then(() => saveAnswer(id, questionId, answer));
        saveQueue.current.set(questionId, request);
        pendingSaves.current.set(questionId, request);
        request.then(() => {
            if (pendingSaves.current.get(questionId) === request) {
                failedSaves.current.delete(questionId);
            }
        }).catch(err => {
            console.error("Ошибка сохранения ответа:", err);
            if (pendingSaves.current.get(questionId) === request) {
                failedSaves.current.add(questionId);
                setError("Не удалось сохранить ответ. Выберите вариант повторно до окончания времени.");
            }
        }).finally(() => {
            if (pendingSaves.current.get(questionId) === request) {
                pendingSaves.current.delete(questionId);
            }
        });
    };
    // =========================
    // MANUAL SUBMIT
    // =========================
    const handleSubmit = async () => {
        if (
            timeLeft === 0 ||
            submitting
        ) {
            return;
        }
        if (
            Object.keys(answers).length !==
            questions.length
        ) {
            setError(
                "Пожалуйста, ответьте на все вопросы перед завершением теста."
            );
            return;
        }
        try {
            setSubmitting(true);
            setError("");
            await waitForSaves();
           const answerList =
                questions.map(question => ({
                    questionId:
                        question.id,
                    answer:
                        answers[
                            question.id
                        ]
                }));
            const response =
                await submitQuiz(
                    id,
                    answerList
                );
            setResult(response);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } catch (error) {
            console.error(error);
            setError(
                "Не удалось завершить тест. Проверьте сохранение ответов и повторите попытку."
            );
        } finally {
            setSubmitting(false);
        }
    };
    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <DashboardLayout>
                <p className="quiz-loading">
                    Загрузка теста...
                </p>
            </DashboardLayout>
        );
    }
    // =========================
    // ALREADY COMPLETED
    // =========================
    if (alreadyCompleted) {
        return (
            <DashboardLayout>
                <div className="quiz-result-container">
                    <div className="quiz-result-card">
                        <div className="result-success-icon">
                            ✓
                        </div>
                        <p className="result-label">
                            ТЕСТ УЖЕ ПРОЙДЕН
                        </p>
                        <h1>
                            Тест завершён
                        </h1>
                        <p className="result-description">
                            Вы уже прошли этот тест.
                            Повторное прохождение невозможно.
                        </p>
                        <div className="result-actions">
                            <button
                                className="result-primary-button"
                                onClick={() =>
                                    navigate(
                                        "/student/results"
                                    )
                                }
                            >
                                Мои результаты
                            </button>
                            <button
                                className="result-secondary-button"
                                onClick={() =>
                                    navigate(
                                        "/student/quizzes"
                                    )
                                }
                            >
                                Вернуться к тестам
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }
    // =========================
    // RESULT PAGE
    // =========================
    if (result) {
        return (
            <DashboardLayout>
                <div className="quiz-result-container">
                    <div className="quiz-result-card">
                        <div className="result-success-icon">
                            ✓
                        </div>
                        <p className="result-label">
                            ТЕСТ ЗАВЕРШЁН
                        </p>
                        <h1>
                            Ваш результат
                        </h1>
                        <div className="result-grade">
                            {result.grade}
                        </div>
                        <p className="result-score">
                            {result.percentage
                                .toFixed(1)}%
                        </p>
                        <p className="result-description">
                            Правильных ответов:{" "}
                            <strong>
                                {
                                    result.correctAnswers
                                }
                            </strong>
                            {" из "}
                            <strong>
                                {
                                    result.totalQuestions
                                }
                            </strong>
                        </p>
                        <div className="result-actions">
                            <button
                                className="result-primary-button"
                                onClick={() =>
                                    navigate(
                                        "/student/results"
                                    )
                                }
                            >
                                Мои результаты
                            </button>
                            <button
                                className="result-secondary-button"
                                onClick={() =>
                                    navigate(
                                        "/student/quizzes"
                                    )
                                }
                            >
                                Вернуться к тестам
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }
    // =========================
    // QUIZ PAGE
    // =========================
    return (
        <DashboardLayout>
            {/* HEADER */}
            <div className="quiz-taking-header">
                <div>
                    <h1>
                        {quiz?.title || "Тест"}
                    </h1>
                    <p>
                        Выберите один вариант ответа
                        на каждый вопрос.
                    </p>
                </div>
                <div className="quiz-header-info">
                    {/* TIMER */}
                    {timeLeft !== null && (
                        <div
                            className={
                                timeLeft <= 300
                                    ? "quiz-timer danger"
                                    : "quiz-timer"
                            }
                        >
                            <span>
                                Оставшееся время
                            </span>
                            <strong>
                                {
                                    formatTime(
                                        timeLeft
                                    )
                                }
                            </strong>
                        </div>
                    )}
                    {/* PROGRESS */}
                    <div className="quiz-progress">
                        <span>
                            Отвечено
                        </span>
                        <strong>
                            {
                                Object.keys(
                                    answers
                                ).length
                            }
                            {" / "}
                            {
                                questions.length
                            }
                        </strong>
                    </div>
                </div>
            </div>
            {/* ERROR / MESSAGE */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {/* QUESTIONS */}
            {questions.length === 0 ? (
                <div className="quiz-empty">
                    <h3>
                        Вопросы отсутствуют
                    </h3>
                    <p>
                        В этом тесте пока нет вопросов.
                    </p>
                </div>
            ) : (
                <div className="quiz-questions-list">
                    {questions.map(
                        (
                            question,
                            index
                        ) => (
                            <div
                                className="quiz-question-card"
                                key={
                                    question.id
                                }
                            >
                                <p className="quiz-question-number">
                                    ВОПРОС{" "}
                                    {index + 1}
                                    {" ИЗ "}
                                    {
                                        questions.length
                                    }
                                </p>
                                <h2>
                                    {
                                        question.questionText
                                    }
                                </h2>
                                <div className="quiz-answer-list">
                                    {/* A */}
                                    <label
                                        className={
                                            answers[
                                                question.id
                                            ] === "A"
                                                ? "quiz-answer selected"
                                                : "quiz-answer"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name={
                                                `question-${question.id}`
                                            }
                                            checked={
                                                answers[
                                                    question.id
                                                ] === "A"
                                            }
                                            disabled={
                                                timeLeft === 0 ||
                                                submitting
                                            }
                                            onChange={() =>
                                                handleAnswer(
                                                    question.id,
                                                    "A"
                                                )
                                            }
                                        />
                                        <span className="quiz-answer-letter">
                                            A
                                        </span>
                                        <span>
                                            {
                                                question.optionA
                                            }
                                        </span>
                                    </label>
                                    {/* B */}
                                    <label
                                        className={
                                            answers[
                                                question.id
                                            ] === "B"
                                                ? "quiz-answer selected"
                                                : "quiz-answer"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name={
                                                `question-${question.id}`
                                            }
                                            checked={
                                                answers[
                                                    question.id
                                                ] === "B"
                                            }
                                            disabled={
                                                timeLeft === 0 ||
                                                submitting
                                            }
                                            onChange={() =>
                                                handleAnswer(
                                                    question.id,
                                                    "B"
                                                )
                                            }
                                        />
                                        <span className="quiz-answer-letter">
                                            B
                                        </span>
                                        <span>
                                            {
                                                question.optionB
                                            }
                                        </span>
                                    </label>
                                    {/* C */}
                                    <label
                                        className={
                                            answers[
                                                question.id
                                            ] === "C"
                                                ? "quiz-answer selected"
                                                : "quiz-answer"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name={
                                                `question-${question.id}`
                                            }
                                            checked={
                                                answers[
                                                    question.id
                                                ] === "C"
                                            }
                                            disabled={
                                                timeLeft === 0 ||
                                                submitting
                                            }
                                            onChange={() =>
                                                handleAnswer(
                                                    question.id,
                                                    "C"
                                                )
                                            }
                                        />
                                        <span className="quiz-answer-letter">
                                            C
                                        </span>
                                        <span>
                                            {
                                                question.optionC
                                            }
                                        </span>
                                    </label>
                                    {/* D */}
                                    <label
                                        className={
                                            answers[
                                                question.id
                                            ] === "D"
                                                ? "quiz-answer selected"
                                                : "quiz-answer"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name={
                                                `question-${question.id}`
                                            }
                                            checked={
                                                answers[
                                                    question.id
                                                ] === "D"
                                            }
                                            disabled={
                                                timeLeft === 0 ||
                                                submitting
                                            }
                                            onChange={() =>
                                                handleAnswer(
                                                    question.id,
                                                    "D"
                                                )
                                            }
                                        />
                                        <span className="quiz-answer-letter">
                                            D
                                        </span>
                                        <span>
                                            {
                                                question.optionD
                                            }
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
            {/* SUBMIT */}
            {questions.length > 0 && (
                <div className="quiz-submit-section">
                    <div>
                        <p>
                            Отвечено:{" "}
                            {
                                Object.keys(
                                    answers
                                ).length
                            }
                            {" из "}
                            {
                                questions.length
                            }
                        </p>
                    </div>
                    <div className="quiz-submit-actions">
                        <button
                            className="quiz-back-button"
                            disabled={
                                submitting
                            }
                            onClick={() =>
                                navigate(
                                    "/student/quizzes"
                                )
                            }
                        >
                            Назад
                        </button>
                        <button
                            className="quiz-submit-button"
                            onClick={
                                handleSubmit
                            }
                            disabled={
                                submitting ||
                                timeLeft === 0
                            }
                        >
                            {
                                submitting
                                    ? "Отправка..."
                                    : timeLeft === 0
                                        ? "Время истекло"
                                        : "Завершить тест"
                            }
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
export default QuizPage;