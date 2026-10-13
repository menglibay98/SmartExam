import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";


export interface LoginRequest {
    email: string;
    password: string;
}


export interface RegisterRequest {
    name: string;
    surname: string;
    email: string;
    password: string;
}


export interface AuthResponse {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
    token: string;
}


// =========================
// LOGIN
// =========================

export const login = async (
    data: LoginRequest
): Promise<AuthResponse> => {

    const response = await axios.post<AuthResponse>(
        `${API_URL}/login`,
        data
    );

    return response.data;
};


// =========================
// REGISTER
// =========================

export const register = async (
    data: RegisterRequest
): Promise<AuthResponse> => {

    const response = await axios.post<AuthResponse>(
        `${API_URL}/register`,
        data
    );

    return response.data;
};