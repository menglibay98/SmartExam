import axios from "axios";


const API_URL =
    "http://localhost:8080/api/quizzes";


// =========================
// TYPES
// =========================

export interface Quiz {

    id: number;

    title: string;

    description: string;

    timeLimit: number | null;
}


export interface CreateQuizRequest {

    title: string;

    description: string;

    timeLimit: number;
}


export interface AnswerRequest {

    questionId: number;

    answer: string;
}


export interface QuizResult {

    totalQuestions: number;

    correctAnswers: number;

    percentage: number;

    grade: string;
}

export interface QuizAttempt {
    attemptId: number;
    startedAt: string;
    expiresAt: string | null;
    completed: boolean;
}

export interface SavedAnswerResponse {
    questionId: number;
    answer: string;
}

// =========================
// GET ALL QUIZZES
// =========================

export const getAllQuizzes =
    async (): Promise<Quiz[]> => {

        const token =
            localStorage.getItem("token");

        const response =
            await axios.get<Quiz[]>(
                API_URL,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        return response.data;
    };


// =========================
// GET QUIZ BY ID
// =========================

export const getQuizById =
    async (
        quizId: number
    ): Promise<Quiz> => {

        const token =
            localStorage.getItem("token");

        const response =
            await axios.get<Quiz>(
                `${API_URL}/${quizId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        return response.data;
    };


// =========================
// CREATE QUIZ
// =========================

export const createQuiz =
    async (
        data: CreateQuizRequest
    ): Promise<Quiz> => {

        const token =
            localStorage.getItem("token");

        const response =
            await axios.post<Quiz>(
                API_URL,
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        return response.data;
    };


// =========================
// DELETE QUIZ
// =========================

export const deleteQuiz =
    async (
        quizId: number
    ): Promise<void> => {

        const token =
            localStorage.getItem("token");

        await axios.delete(
            `${API_URL}/${quizId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );
    };


// =========================
// SUBMIT QUIZ
// =========================

export const submitQuiz =
    async (
        quizId: number,
        answers: AnswerRequest[]
    ): Promise<QuizResult> => {

        const token =
            localStorage.getItem("token");

        const response =
            await axios.post<QuizResult>(
                `${API_URL}/${quizId}/submit`,
                {
                    answers
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        return response.data;
    };

    export const startQuiz = async (
    quizId: number
): Promise<QuizAttempt> => {

    const token = localStorage.getItem("token");

    const response = await axios.post<QuizAttempt>(
        `${API_URL}/${quizId}/start`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const saveAnswer = async (
    quizId: number,
    questionId: number,
    answer: string
): Promise<void> => {

    const token = localStorage.getItem("token");

    await axios.put(
        `${API_URL}/${quizId}/answers`,
        {
            questionId,
            answer
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

export const getSavedAnswers = async (
    quizId: number
): Promise<SavedAnswerResponse[]> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<SavedAnswerResponse[]>(
        `${API_URL}/${quizId}/answers`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};