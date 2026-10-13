import axios from "axios";

const API_URL = "http://localhost:8080/api/admin";

export interface Teacher {
    id: number;
    name: string;
    surname: string;
    email: string;
}

export interface CreateTeacherRequest {
    name: string;
    surname: string;
    email: string;
    password: string;
}

export interface AdminDashboardResponse {
    totalStudents: number;
    totalTeachers: number;
    totalQuizzes: number;
    totalAttempts: number;
}

export const getTeachers = async (): Promise<Teacher[]> => {

    const token = localStorage.getItem("token");

    const response = await axios.get<Teacher[]>(
        `${API_URL}/teachers`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};


export const createTeacher = async (
    data: CreateTeacherRequest
) => {

    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}/teachers`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const getAdminDashboard =
    async (): Promise<AdminDashboardResponse> => {

        const token = localStorage.getItem("token");

        const response =
            await axios.get<AdminDashboardResponse>(
                `${API_URL}/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        return response.data;
    };