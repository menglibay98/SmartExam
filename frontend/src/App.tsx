import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import QuizListPage from "./pages/QuizListPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateQuizPage from "./pages/CreateQuizPage";
import QuestionPage from "./pages/QuestionPage";
import StudentQuizListPage from "./pages/StudentQuizListPage";
import QuizPage from "./pages/QuizPage";
import MyResultsPage from "./pages/MyResultsPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTeachersPage from "./pages/ManageTeachersPage";
import TeacherResultsPage from "./pages/TeacherResultsPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/teacher/dashboard"
                    element={
                        <ProtectedRoute allowedRole="TEACHER">
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/quizzes"
                    element={
                        <ProtectedRoute allowedRole="TEACHER">
                            <QuizListPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRole="STUDENT">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                 <Route
                    path="/teacher/quizzes/create"
                    element={
                        <ProtectedRoute allowedRole="TEACHER">
                            <CreateQuizPage />
                        </ProtectedRoute>
                    }
                />
                 <Route
                   path="/teacher/quizzes/:quizId/questions"
                    element={
                        <ProtectedRoute allowedRole="TEACHER">
                            <QuestionPage />
                        </ProtectedRoute>
                    }
                />
                 <Route
                    path="/student/quizzes"
                    element={
                        <ProtectedRoute allowedRole="STUDENT">
                            <StudentQuizListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/quizzes/:quizId"
                    element={
                        <ProtectedRoute allowedRole="STUDENT">
                            <QuizPage />
                        </ProtectedRoute>
                    }
                />
                  <Route
                    path="/student/results"
                    element={
                        <ProtectedRoute allowedRole="STUDENT">
                            <MyResultsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/register"
                    element={<RegisterPage />}
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/teachers"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <ManageTeachersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/quizzes/:quizId/results"
                    element={
                        <ProtectedRoute allowedRole="TEACHER">
                            <TeacherResultsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;