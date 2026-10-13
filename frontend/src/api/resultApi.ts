import axios from "axios";

const API_URL = "http://localhost:8080/api";

export interface StudentResult {
    id: number;
    quizTitle: string;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    grade: string;
    completedAt: string;
}

export interface TeacherQuizResult {
    id: number;
    studentName: string;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    grade: string;
    completedAt: string;
}

export const getMyResults = async (): Promise<StudentResult[]> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<StudentResult[]>(
        `${API_URL}/results/my`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const getQuizResults = async (
    quizId: number
): Promise<TeacherQuizResult[]> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<TeacherQuizResult[]>(
        `${API_URL}/results/quiz/${quizId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};