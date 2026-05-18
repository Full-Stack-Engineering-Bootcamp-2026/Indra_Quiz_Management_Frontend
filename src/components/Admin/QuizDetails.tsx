import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

type Option = {
  publicId: string;
  optionText: string;
};

type Question = {
  publicId: string;

  version: {
    publicId: string;
    versionNumber: number;
    questionText: string;
    answerType: string;
  };

  options: Option[];
};

type Quiz = {
  publicId: string;
  title: string;
  questions: Question[];
};

export default function QuizDetails() {
  const { quizId } = useParams();

  const token = useSelector((state: RootState) => state.auth.token);

  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchQuiz = async () => {
    try {
      setLoading(true);

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
        setQuiz(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading Quiz...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{quiz?.title}</h1>

        <p className="mt-2 text-gray-500">
          Total Questions : {quiz?.questions.length}
        </p>
      </div>

      <div className="space-y-6">
        {quiz?.questions.map((question, index) => (
          <div
            key={question.publicId}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Q{index + 1}. {question.version.questionText}
              </h2>

              <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium">
                {question.version.answerType}
              </span>
            </div>

            {question.options.length > 0 && (
              <div className="mt-5 space-y-3">
                {question.options.map((option) => (
                  <div
                    key={option.publicId}
                    className="rounded-xl border bg-slate-50 px-4 py-3"
                  >
                    {option.optionText}
                  </div>
                ))}
              </div>
            )}

            {question.options.length === 0 && (
              <div className="mt-5 rounded-xl border border-dashed p-4 text-gray-500">
                Text Answer Question
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
