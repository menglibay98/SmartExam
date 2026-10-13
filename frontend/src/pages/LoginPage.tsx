import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../api/authApi";

import "./LoginPage.css";


function LoginPage() {

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const navigate =
        useNavigate();


    const handleSubmit =
        async (e: React.FormEvent) => {

            e.preventDefault();

            try {

                setLoading(true);
                setError("");


                const response =
                    await login({
                        email,
                        password
                    });


                // Save authentication data

                localStorage.setItem(
                    "token",
                    response.token
                );

                localStorage.setItem(
                    "role",
                    response.role
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(response)
                );


                // Redirect by role

                if (
                    response.role === "ADMIN"
                ) {

                    navigate(
                        "/admin/dashboard"
                    );

                } else if (
                    response.role === "TEACHER"
                ) {

                    navigate(
                        "/teacher/dashboard"
                    );

                } else if (
                    response.role === "STUDENT"
                ) {

                    navigate(
                        "/student/dashboard"
                    );

                }


            } catch (error) {

                console.error(error);

                setError(
                    "Неверный email или пароль."
                );

            } finally {

                setLoading(false);

            }

        };


    return (

        <div className="auth-page">


            {/* LEFT SIDE */}

            <div className="auth-brand-section">

                <div className="auth-brand-content">

                    <div className="auth-logo">

                        <div className="auth-logo-icon">
                            S
                        </div>

                        <span>
                            SmartExam
                        </span>

                    </div>


                    <h1>
                        Умные тесты.
                        <br />
                        Эффективное обучение.
                    </h1>


                    <p>
                        Современная платформа для создания,
                        управления и прохождения
                        онлайн-тестов.
                    </p>

                </div>

            </div>


            {/* LOGIN SIDE */}

            <div className="auth-form-section">

                <div className="auth-form-container">


                    <div className="auth-mobile-logo">

                        <div className="auth-logo-icon">
                            S
                        </div>

                        <span>
                            SmartExam
                        </span>

                    </div>


                    <div className="auth-header">

                        <h2>
                            С возвращением!
                        </h2>

                        <p>
                            Войдите, чтобы продолжить работу
                            в SmartExam.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >


                        {/* EMAIL */}

                        <div className="auth-form-group">

                            <label htmlFor="email">
                                Электронная почта
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="name@example.com"
                                autoComplete="email"
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="auth-form-group">

                            <label htmlFor="password">
                                Пароль
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Введите пароль"
                                autoComplete="current-password"
                                required
                            />

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="auth-error">
                                {error}
                            </div>

                        )}


                        {/* LOGIN */}

                        <button
                            className="auth-submit-button"
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Вход..."
                                : "Войти"
                            }

                        </button>

                    </form>


                    <div className="auth-footer">

                        <span>
                            Нет аккаунта?
                        </span>

                        {" "}

                        <Link to="/register">
                            Создать аккаунт
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default LoginPage;