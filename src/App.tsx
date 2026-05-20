import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./components/Admin/AdminHome";
import CreateQuestion from "./components/Admin/CreateQuestion";
import CreateQuiz from "./components/Admin/CreateQuiz";
import AddQuestionsToQuiz from "./components/Admin/AddQuestionsToQuiz";
import QuizDetails from "./components/Admin/QuizDetails";
import AllQuestions from "./components/Admin/AllQuestions";
import Home from "./components/User/Home";
import UserLayout from "./layouts/UserLayout";
import QuizPage from "./components/User/QuizPage";
import AttemptDetails from "./components/User/AttemptDetails";
import MyAttempts from "./components/User/MyAttempts";
import RegisterPage from "./components/Registration";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
export default function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LoginPage />} />

        <Route path="/registraion" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />

          <Route path="quiz/:quizId" element={<QuizDetails />} />

          <Route path="allQuestions" element={<AllQuestions />} />

          <Route path="create-question" element={<CreateQuestion />} />

          <Route path="create-quiz" element={<CreateQuiz />} />

          <Route path="add-question-quiz" element={<AddQuestionsToQuiz />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRole="user" />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Home />} />

          <Route path="quiz/:quizId" element={<QuizPage />} />

          <Route path="attempts" element={<MyAttempts />} />

          <Route path="attempts/:attemptId" element={<AttemptDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}
