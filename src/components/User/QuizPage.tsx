import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import type { RootState } from "@/store/store";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";

type Option = {
  publicId: string;
  optionText: string;
};

type Question = {
  publicId: string;

  version: {
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

type Answer = {
  questionPublicId: string;

  selectedOptionPublicIds?: string[];

  answerText?: string;
};

const answerSchema = z.array(
  z.object({
    questionPublicId: z.string(),

    selectedOptionPublicIds: z.array(z.string()).optional(),

    answerText: z.string().min(1).optional(),
  }),
);

export default function QuizPage() {
  const { quizId } = useParams();

  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);

  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [answers, setAnswers] = useState<Answer[]>([]);

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

  const handleSingleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter(
        (answer) => answer.questionPublicId !== questionId,
      );

      return [
        ...filtered,
        {
          questionPublicId: questionId,
          selectedOptionPublicIds: [optionId],
        },
      ];
    });
  };

  const handleMultiSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const existing = prev.find(
        (answer) => answer.questionPublicId === questionId,
      );

      if (!existing) {
        return [
          ...prev,
          {
            questionPublicId: questionId,
            selectedOptionPublicIds: [optionId],
          },
        ];
      }

      const alreadySelected =
        existing.selectedOptionPublicIds?.includes(optionId);

      const updatedOptions = alreadySelected
        ? existing.selectedOptionPublicIds?.filter((id) => id !== optionId)
        : [...(existing.selectedOptionPublicIds || []), optionId];

      return prev.map((answer) =>
        answer.questionPublicId === questionId
          ? {
              ...answer,
              selectedOptionPublicIds: updatedOptions,
            }
          : answer,
      );
    });
  };

  const handleTextAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter(
        (answer) => answer.questionPublicId !== questionId,
      );

      return [
        ...filtered,
        {
          questionPublicId: questionId,
          answerText: value,
        },
      ];
    });
  };

  const isSelected = (questionId: string, optionId: string) => {
    return answers
      .find((answer) => answer.questionPublicId === questionId)
      ?.selectedOptionPublicIds?.includes(optionId);
  };

  const handleSubmitQuiz = async () => {
    const validation = answerSchema.safeParse(answers);

    if (!validation.success) {
      toast.error("Please answer all required text questions");

      return;
    }

    const hasEmptyTextAnswer = answers.some(
      (answer) =>
        answer.answerText !== undefined && answer.answerText.trim().length < 1,
    );

    if (hasEmptyTextAnswer) {
      toast.error("Text answers are required");

      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/quizzes/${quizId}/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            answers,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);

        navigate("/user");
      } else {
        toast.error(data.message || "Failed to submit quiz");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        Loading Quiz...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div className="rounded-3xl bg-black px-6 py-5 text-white shadow-lg">
        <h1 className="text-3xl font-bold">{quiz?.title}</h1>

        <p className="mt-2 text-sm text-gray-300">
          Total Questions : {quiz?.questions.length}
        </p>
      </div>

      <div className="space-y-4">
        {quiz?.questions.map((question, index) => (
          <Card
            key={question.publicId}
            className="rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md"
          >
            <CardContent className="p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  {index + 1}
                </div>

                <div className="w-full">
                  <h2 className="text-base font-semibold leading-relaxed text-gray-900">
                    {question.version.questionText}
                  </h2>

                  <p className="mt-1 text-xs capitalize text-gray-500">
                    {question.version.answerType.replace("_", " ")}
                  </p>
                </div>
              </div>

              {question.version.answerType === "single_select" && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label
                      key={option.publicId}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${
                        isSelected(question.publicId, option.publicId)
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={isSelected(question.publicId, option.publicId)}
                        onChange={() =>
                          handleSingleSelect(question.publicId, option.publicId)
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm">{option.optionText}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.version.answerType === "multi_select" && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label
                      key={option.publicId}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${
                        isSelected(question.publicId, option.publicId)
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected(question.publicId, option.publicId)}
                        onChange={() =>
                          handleMultiSelect(question.publicId, option.publicId)
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm">{option.optionText}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.version.answerType === "text" && (
                <Textarea
                  placeholder="Write your answer..."
                  className="min-h-[100px] rounded-xl border-gray-300 text-sm focus-visible:ring-1 focus-visible:ring-black"
                  onChange={(e) =>
                    handleTextAnswer(question.publicId, e.target.value)
                  }
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmitQuiz}
          className="h-12 rounded-2xl bg-black px-8 text-white hover:opacity-90"
        >
          Submit Quiz
        </Button>
      </div>
    </div>
  );
}
