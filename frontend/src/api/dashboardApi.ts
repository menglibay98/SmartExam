import axios from "axios";

const API_URL = "http://localhost:8080/api/dashboard";


// =========================
// RECENT RESULT
// =========================

export interface RecentResultResponse {
    studentName: string;
    quizTitle: string;
    percentage: number;
    grade: string;
    completedAt: string;
}


// =========================
// TEACHER DASHBOARD
// =========================

export interface DashboardResponse {
    totalStudents: number;
    totalQuizzes: number;
    totalAttempts: number;
    averageScore: number;
    recentResults: RecentResultResponse[];
}


// =========================
// GET TEACHER DASHBOARD
// =========================

export const getTeacherDashboard =
    async (): Promise<DashboardResponse> => {

        const token =
            localStorage.getItem("token");

        const response =
            await axios.get<DashboardResponse>(
                `${API_URL}/teacher`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        return response.data;
    };