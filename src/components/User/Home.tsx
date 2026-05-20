import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

import { BookOpen, Sparkles } from "lucide-react";

type Quiz = {
  publicId: string;
  title: string;
  totalQuestions: number;
  createdAt: string;
};

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [loading, setLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const user = useSelector((state: RootState) => state.auth.user);

  const navigate = useNavigate();

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
    <div className="space-y-10">
      <div className="rounded-2xl bg-black px-6 py-5 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Welcome Back </p>

            <h1 className="mt-1 text-2xl font-bold">Hello, {user?.name}!</h1>

            <p className="mt-2 text-sm text-gray-300">
              Continue solving quizzes and track your progress.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Available Quizzes
          </h2>

          <p className="mt-2 text-slate-500">Choose a quiz and start solving</p>
        </div>

        <div className="rounded-2xl border bg-white px-6 py-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Quizzes</p>

          <h3 className="text-3xl font-black">{quizzes.length}</h3>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="space-y-3 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-black" />

            <p className="text-lg font-medium">Loading quizzes...</p>
          </div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-[32px] border bg-white shadow-sm">
          <BookOpen className="h-16 w-16 text-slate-300" />

          <p className="mt-5 text-xl font-semibold text-slate-700">
            No quizzes available
          </p>

          <p className="mt-2 text-slate-500">Please check again later</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.publicId}
              className="group relative overflow-hidden rounded-[34px] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-slate-100 blur-3xl transition group-hover:bg-slate-200" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-white shadow-lg">
                      <BookOpen className="h-8 w-8" />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Questions
                      </p>

                      <h3 className="mt-1 text-2xl font-black text-black">
                        {quiz.totalQuestions}
                      </h3>
                    </div>
                  </div>

                  <div>
                    <h2 className="line-clamp-2 text-3xl font-black leading-tight tracking-tight text-slate-900">
                      {quiz.title}
                    </h2>

                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Created on {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    onClick={() => navigate(`/user/quiz/${quiz.publicId}`)}
                    className="group/button relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-black text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-slate-800 to-black opacity-0 transition-opacity duration-300 group-hover/button:opacity-100" />

                    <span className="relative z-10 flex items-center gap-3">
                      Start Quiz
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
