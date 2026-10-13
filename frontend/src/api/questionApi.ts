import axios from "axios";


export interface Question {
    id: number;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
}

export interface CreateQuestionRequest {
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
}

export const getQuestions = async (
    quizId: number
): Promise<Question[]> => {

    const token = localStorage.getItem("token");

    const response = await axios.get<Question[]>(
        `http://localhost:8080/api/quizzes/${quizId}/questions`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};


export const addQuestion = async (
    quizId: number,
    data: CreateQuestionRequest
) => {

    const token = localStorage.getItem("token");

    const response = await axios.post(
        `http://localhost:8080/api/quizzes/${quizId}/questions`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};


export const deleteQuestion = async (
    questionId: number
) => {

    const token = localStorage.getItem("token");

    await axios.delete(
        `http://localhost:8080/api/questions/${questionId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};