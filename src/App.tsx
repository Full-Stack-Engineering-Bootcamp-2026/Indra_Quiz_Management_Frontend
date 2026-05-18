import { Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";

import AdminLayout from "./layouts/AdminLayout";

import AdminHome from "./components/Admin/AdminHome";
import CreateQuestion from "./components/Admin/CreateQuestion";
import CreateQuiz from "./components/Admin/CreateQuiz";
import AddQuestionsToQuiz from "./components/Admin/AddQuestionsToQuiz";
import QuizDetails from "./components/Admin/QuizDetails";
import AllQuestions from "./components/Admin/AllQuestions";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* <Route path="/user" element={<UserPage />} /> */}

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="quiz/:quizId" element={<QuizDetails />} />
         <Route path="allQuestions" element={<AllQuestions />} />


        <Route path="create-question" element={<CreateQuestion />} />

        <Route path="create-quiz" element={<CreateQuiz />} />

        <Route path="add-question-quiz" element={<AddQuestionsToQuiz />} />
      </Route>
    </Routes>
  );
}
