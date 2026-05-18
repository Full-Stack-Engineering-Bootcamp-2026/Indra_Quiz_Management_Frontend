import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import { z } from "zod";

import type { RootState } from "@/store/store";

const questionSchema = z.object({
  questionText: z.string().trim().min(1, "Question is required"),

  answerType: z.enum(["single_select", "multi_select", "text"]),
});

export default function CreateQuestion() {
  const [questionText, setQuestionText] = useState("");

  const [answerType, setAnswerType] = useState("");

  const [options, setOptions] = useState([""]);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);

    setOptions(updatedOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];

    updatedOptions[index] = value;

    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = questionSchema.safeParse({
      questionText,
      answerType,
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);

      return;
    }

    if (
      answerType !== "text" &&
      options.some((option) => option.trim() === "")
    ) {
      setError("All options are required");

      return;
    }

    try {
      setLoading(true);

      setError("");

      const payload =
        answerType === "text"
          ? {
              questionText,
              answerType,
            }
          : {
              questionText,
              answerType,
              options,
            };

      const response = await fetch("http://localhost:3000/api/v1/questions", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);

        navigate("/admin/allQuestions");
      } else {
        toast.error(data.message || "Failed to create question");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Create Question</h1>

          <p className="mt-2 text-gray-500">Add new question for quizzes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="mb-2 block text-sm font-medium">Question</label>

            <textarea
              placeholder="Enter question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="min-h-[120px] w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Answer Type
            </label>

            <select
              value={answerType}
              onChange={(e) => setAnswerType(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-300 px-4 outline-none focus:border-black"
            >
              <option value="">Select Answer Type</option>

              <option value="single_select">Single Select</option>

              <option value="multi_select">Multi Select</option>

              <option value="text">Text</option>
            </select>
          </div>

          {answerType !== "text" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Options</label>

                <button
                  type="button"
                  onClick={addOption}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
                >
                  + Add Option
                </button>
              </div>

              <div className="space-y-4">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="h-12 flex-1 rounded-2xl border border-slate-300 px-4 outline-none focus:border-black"
                    />

                    {options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="rounded-2xl bg-red-500 px-4 text-white"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-black text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating Question..." : "Create Question"}
          </button>
        </form>
      </div>
    </div>
  );
}
