import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import type { RootState } from "@/store/store";

import { BookOpen } from "lucide-react";

type Quiz = {
  publicId: string;
  title: string;
  totalQuestions: number;
  createdAt: string;
};

export default function AdminHome() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">All Quizzes</h1>

          <p className="mt-2 text-gray-500">Manage all quizzes from here</p>
        </div>

        <div className="rounded-2xl bg-black px-6 py-4 text-white shadow-lg">
          <p className="text-sm text-gray-300">Total Quizzes</p>

          <h2 className="text-3xl font-bold">{quizzes.length}</h2>
        </div>
      </div>

      {loading ? (
        <div className="flex h-75 items-center justify-center">
          <p className="text-lg font-medium">Loading quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="flex h-75 items-center justify-center rounded-2xl border bg-white">
          <p className="text-lg font-medium text-gray-500">No quizzes found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.publicId}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {quiz.title}
                  </h2>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Total Questions</p>

                    <p className="text-lg font-semibold">
                      {quiz.totalQuestions}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Created Date</p>

                    <p className="text-sm font-medium">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-100 p-4 transition group-hover:bg-black">
                  <BookOpen className="h-6 w-6 transition group-hover:text-white" />
                </div>
              </div>

              <button
                onClick={() => navigate(`/admin/quiz/${quiz.publicId}`)}
                className="mt-8 w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                View Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
