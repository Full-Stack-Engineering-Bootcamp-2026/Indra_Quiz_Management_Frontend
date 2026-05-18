import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

import { CircleCheck, FileText, ListChecks } from "lucide-react";

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

export default function AllQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const getTypeColor = (answerType: string) => {
    switch (answerType) {
      case "single_select":
        return "bg-blue-100 text-blue-700";

      case "multi_select":
        return "bg-purple-100 text-purple-700";

      case "text":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "single_select":
        return <CircleCheck className="h-5 w-5" />;

      case "multi_select":
        return <ListChecks className="h-5 w-5" />;

      case "text":
        return <FileText className="h-5 w-5" />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">All Questions</h1>

          <p className="mt-2 text-gray-500">Manage all available questions</p>
        </div>

        <div className="rounded-2xl bg-black px-6 py-4 text-white shadow-lg">
          <p className="text-sm text-gray-300">Total Questions</p>

          <h2 className="text-3xl font-bold">{questions.length}</h2>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-lg font-medium">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-3xl border bg-white">
          <p className="text-lg text-gray-500">No questions found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {questions.map((question, index) => (
            <div
              key={question.publicId}
              className="rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold">
                    Q{index + 1}. {question.version.questionText}
                  </h2>

                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${getTypeColor(
                      question.version.answerType,
                    )}`}
                  >
                    {getIcon(question.version.answerType)}

                    {question.version.answerType}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center">
                  <p className="text-sm text-gray-500">Version</p>

                  <h3 className="text-lg font-bold">
                    v{question.version.versionNumber}
                  </h3>
                </div>
              </div>

              {question.options.length > 0 && (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {question.options.map((option) => (
                    <div
                      key={option.publicId}
                      className="rounded-2xl border bg-slate-50 px-4 py-3"
                    >
                      {option.optionText}
                    </div>
                  ))}
                </div>
              )}

              {question.options.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed bg-slate-50 p-4 text-gray-500">
                  Text Answer Question
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
