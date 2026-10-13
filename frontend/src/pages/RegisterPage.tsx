import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/authApi";

import "./LoginPage.css";


function RegisterPage() {

    const navigate =
        useNavigate();


    const [name, setName] =
        useState("");

    const [surname, setSurname] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit =
        async (e: React.FormEvent) => {

            e.preventDefault();


            // Password validation

            if (password !== confirmPassword) {

                setError(
                    "Пароли не совпадают."
                );

                return;
            }


            if (password.length < 6) {

                setError(
                    "Пароль должен содержать не менее 6 символов."
                );

                return;
            }


            try {

                setLoading(true);
                setError("");


                const response =
                    await register({
                        name,
                        surname,
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


                // Public registration creates
                // STUDENT accounts

                navigate(
                    "/student/dashboard"
                );


            } catch (error) {

                console.error(error);

                setError(
                    "Не удалось зарегистрироваться. Возможно, этот email уже используется."
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
                        Начните обучение.
                        <br />
                        Проверьте свои знания.
                    </h1>


                    <p>
                        Создайте аккаунт SmartExam
                        и получите доступ к онлайн-тестам,
                        заданиям и своим результатам
                        в одном месте.
                    </p>

                </div>

            </div>


            {/* REGISTER SIDE */}

            <div className="auth-form-section">

                <div className="auth-form-container">


                    {/* MOBILE LOGO */}

                    <div className="auth-mobile-logo">

                        <div className="auth-logo-icon">
                            S
                        </div>

                        <span>
                            SmartExam
                        </span>

                    </div>


                    {/* HEADER */}

                    <div className="auth-header">

                        <h2>
                            Создание аккаунта
                        </h2>

                        <p>
                            Зарегистрируйте аккаунт студента,
                            чтобы начать работу.
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >


                        {/* NAME + SURNAME */}

                        <div className="auth-name-row">


                            <div className="auth-form-group">

                                <label htmlFor="name">
                                    Имя
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Введите имя"
                                    autoComplete="given-name"
                                    required
                                />

                            </div>


                            <div className="auth-form-group">

                                <label htmlFor="surname">
                                    Фамилия
                                </label>

                                <input
                                    id="surname"
                                    type="text"
                                    value={surname}
                                    onChange={(e) =>
                                        setSurname(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Введите фамилию"
                                    autoComplete="family-name"
                                    required
                                />

                            </div>

                        </div>


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
                                placeholder="Минимум 6 символов"
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="auth-form-group">

                            <label htmlFor="confirmPassword">
                                Подтвердите пароль
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Повторите пароль"
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="auth-error">
                                {error}
                            </div>

                        )}


                        {/* CREATE ACCOUNT */}

                        <button
                            className="auth-submit-button"
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Создание аккаунта..."
                                : "Создать аккаунт"
                            }

                        </button>

                    </form>


                    {/* LOGIN LINK */}

                    <div className="auth-footer">

                        <span>
                            Уже есть аккаунт?
                        </span>

                        {" "}

                        <Link to="/login">
                            Войти
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default RegisterPage;