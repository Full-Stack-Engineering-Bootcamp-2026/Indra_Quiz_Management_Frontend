import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import type { RootState } from "@/store/store";

type Quiz = {
  publicId: string;
  title: string;
};

type Question = {
  publicId: string;

  version: {
    questionText: string;
    answerType: string;
  };
};

export default function AddQuestionsToQuiz() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [selectedQuiz, setSelectedQuiz] = useState("");

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/quizzes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setQuizzes(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuizQuestions = async (quizId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/quizzes/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        const existingQuestionIds = data.data.questions.map(
          (question: Question) => question.publicId,
        );

        setSelectedQuestions(existingQuestionIds);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/questions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuizzes();

    fetchQuestions();
  }, []);

  const handleQuestionSelect = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedQuiz) {
      toast.error("Select a quiz");

      return;
    }

    if (selectedQuestions.length === 0) {
      toast.error("Select at least one question");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/api/v1/quizzes/${selectedQuiz}/questions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            questionPublicIds: selectedQuestions,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);

        setSelectedQuiz("");

        setSelectedQuestions([]);
      } else {
        toast.error(data.message || "Failed to add questions");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Add Questions To Quiz</h1>

        <p className="mt-2 text-gray-500">
          Select questions and assign them to a quiz
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <label className="mb-3 block text-sm font-medium">Select Quiz</label>

          <select
            value={selectedQuiz}
            onChange={(e) => {
              setSelectedQuiz(e.target.value);

              fetchQuizQuestions(e.target.value);
            }}
            className="h-12 w-full rounded-2xl border border-slate-300 px-4 outline-none focus:border-black"
          >
            <option value="">Choose Quiz</option>

            {quizzes.map((quiz) => (
              <option key={quiz.publicId} value={quiz.publicId}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Select Questions</h2>

            <div className="rounded-2xl bg-black px-5 py-3 text-white">
              {selectedQuestions.length} Selected
            </div>
          </div>

          <div className="grid gap-5">
            {questions.map((question) => (
              <div
                key={question.publicId}
                className={`cursor-pointer rounded-3xl border p-6 transition ${
                  selectedQuestions.includes(question.publicId)
                    ? "border-black bg-slate-100"
                    : "bg-white hover:shadow-lg"
                }`}
                onClick={() => handleQuestionSelect(question.publicId)}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question.publicId)}
                    readOnly
                    className="mt-1 h-5 w-5"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {question.version.questionText}
                    </h3>

                    <div className="mt-3 inline-block rounded-full bg-slate-200 px-4 py-2 text-sm font-medium">
                      {question.version.answerType}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-2xl bg-black text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Adding Questions..." : "Add Questions To Quiz"}
        </button>
      </form>
    </div>
  );
}
