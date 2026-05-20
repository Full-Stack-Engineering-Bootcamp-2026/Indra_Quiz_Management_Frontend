import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "../ui/button";

type Option = {
  publicId: string;
  optionText: string;
};

type Answer = {
  questionPublicId: string;

  questionText: string;

  versionNumber: number;

  answerType: string;

  answerText: string | null;

  options: Option[];

  selectedOptions: Option[];
};

type AttemptDetailsType = {
  attemptPublicId: string;

  attemptNumber: number;

  submittedAt: string;

  quiz: {
    publicId: string;

    title: string;
  };

  answers: Answer[];
};

export default function AttemptDetails() {
  const { attemptId } = useParams();

  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);

  const [attempt, setAttempt] = useState<AttemptDetailsType | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchAttempt = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/api/v1/quizzes/attempts/${attemptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setAttempt(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempt();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        Loading Attempt...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-3xl bg-black px-6 py-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">
              Attempt #{attempt?.attemptNumber}
            </p>

            <h1 className="text-3xl font-bold tracking-tight">
              {attempt?.quiz.title}
            </h1>

            <p className="text-sm text-gray-400">
              Submitted on{" "}
              {attempt?.submittedAt &&
                new Date(attempt.submittedAt).toLocaleString()}
            </p>
          </div>

          <Button
            onClick={() => navigate(`/user/quiz/${attempt?.quiz.publicId}`)}
            className="rounded-2xl bg-white px-5 text-black hover:bg-gray-200"
          >
            Reattempt Quiz
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {attempt?.answers.map((answer, index) => (
          <Card
            key={answer.questionPublicId}
            className="rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md"
          >
            <CardContent className="space-y-5 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                  {index + 1}
                </div>

                <div className="w-full space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {answer.answerType.replace("_", " ")}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      Version {answer.versionNumber}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold leading-relaxed text-gray-900">
                    {answer.questionText}
                  </h2>
                </div>
              </div>

              {answer.answerType === "text" ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                  {answer.answerText || "No answer submitted"}
                </div>
              ) : (
                <div className="space-y-2">
                  {answer.options.map((option) => {
                    const isSelected = answer.selectedOptions.some(
                      (selectedOption) =>
                        selectedOption.publicId === option.publicId,
                    );

                    return (
                      <div
                        key={option.publicId}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.optionText}</span>

                          {isSelected && (
                            <span className="text-xs font-semibold">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
