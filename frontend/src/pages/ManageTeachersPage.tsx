import { useEffect, useState } from "react";

import DashboardLayout
    from "../components/DashboardLayout";

import {
    getTeachers,
    createTeacher,
    type Teacher
} from "../api/adminApi";

import "./ManageTeachersPage.css";


function ManageTeachersPage() {

    const [teachers, setTeachers] =
        useState<Teacher[]>([]);

    const [name, setName] =
        useState("");

    const [surname, setSurname] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    // =========================
    // LOAD TEACHERS
    // =========================

    const loadTeachers = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getTeachers();

            setTeachers(data);

        } catch (error) {

            console.error(error);

            setError(
                "Не удалось загрузить список преподавателей."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadTeachers();
    }, []);


    // =========================
    // CREATE TEACHER
    // =========================

    const handleCreateTeacher = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setError("");
            setSuccess("");

            await createTeacher({
                name,
                surname,
                email,
                password
            });

            setSuccess(
                "Преподаватель успешно создан."
            );

            setName("");
            setSurname("");
            setEmail("");
            setPassword("");

            await loadTeachers();

        } catch (error) {

            console.error(error);

            setError(
                "Не удалось создать преподавателя. Возможно, этот email уже используется."
            );

        }
    };


    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="teachers-header">

                <h1>
                    Управление преподавателями
                </h1>

                <p>
                    Создавайте учетные записи
                    преподавателей SmartExam.
                </p>

            </div>


            {/* CREATE TEACHER */}

            <div className="teacher-card">

                <h2>
                    Создать преподавателя
                </h2>


                <form
                    className="teacher-form"
                    onSubmit={handleCreateTeacher}
                >

                    <div className="form-group">

                        <label>
                            Имя
                        </label>

                        <input
                            type="text"
                            placeholder="Введите имя"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Фамилия
                        </label>

                        <input
                            type="text"
                            placeholder="Введите фамилию"
                            value={surname}
                            onChange={(e) =>
                                setSurname(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Электронная почта
                        </label>

                        <input
                            type="email"
                            placeholder="teacher@smartexam.kz"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Пароль
                        </label>

                        <input
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="teacher-form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            + Создать преподавателя
                        </button>

                    </div>

                </form>


                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

            </div>


            {/* TEACHERS LIST */}

            <div className="teacher-card">

                <h2>
                    Преподаватели ({teachers.length})
                </h2>


                {loading ? (

                    <p>
                        Загрузка преподавателей...
                    </p>

                ) : teachers.length === 0 ? (

                    <p>
                        Преподаватели не найдены.
                    </p>

                ) : (

                    <div className="table-container">

                        <table className="teachers-table">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Преподаватель
                                    </th>

                                    <th>
                                        Электронная почта
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {teachers.map(
                                    (teacher) => (

                                        <tr key={teacher.id}>

                                            <td>
                                                #{teacher.id}
                                            </td>

                                            <td
                                                className="teacher-name"
                                            >
                                                {teacher.name}{" "}
                                                {teacher.surname}
                                            </td>

                                            <td
                                                className="teacher-email"
                                            >
                                                {teacher.email}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </DashboardLayout>
    );
}

export default ManageTeachersPage;