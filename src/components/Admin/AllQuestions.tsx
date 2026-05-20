import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import { Pencil, Trash2, Plus, Save, X, FileQuestion } from "lucide-react";

import type { RootState } from "@/store/store";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

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

  const [editingId, setEditingId] = useState("");

  const [editQuestion, setEditQuestion] = useState("");

  const [editAnswerType, setEditAnswerType] = useState("");

  const [editOptions, setEditOptions] = useState<string[]>([]);

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

  const startEditing = (question: Question) => {
    setEditingId(question.publicId);

    setEditQuestion(question.version.questionText);

    setEditAnswerType(question.version.answerType);

    setEditOptions(question.options.map((option) => option.optionText));
  };

  const handleDelete = async (questionId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${questionId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);

        fetchQuestions();
      } else {
        toast.error(data.message || "Unable to delete question");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  const handleUpdate = async () => {
    try {
      const payload =
        editAnswerType === "text"
          ? {
              questionText: editQuestion,
              answerType: editAnswerType,
            }
          : {
              questionText: editQuestion,
              answerType: editAnswerType,
              options: editOptions,
            };

      const response = await fetch(
        `http://localhost:3000/api/v1/questions/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);

        setEditingId("");

        fetchQuestions();
      }
    } catch (error) {
      console.log(error);

      toast.error("Update failed");
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...editOptions];

    updatedOptions[index] = value;

    setEditOptions(updatedOptions);
  };

  const addOption = () => {
    setEditOptions([...editOptions, ""]);
  };

  const removeOption = (index: number) => {
    setEditOptions(editOptions.filter((_, i) => i !== index));
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "single_select":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "multi_select":
        return "bg-purple-100 text-purple-700 border-purple-200";

      case "text":
        return "bg-green-100 text-green-700 border-green-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-black px-6 py-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-300">Question Management</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              All Questions
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage, edit and delete quiz questions
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
            <p className="text-sm text-gray-300">Total Questions</p>

            <h2 className="mt-1 text-3xl font-bold">{questions.length}</h2>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="space-y-3 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />

            <p className="text-sm text-gray-500">Loading questions...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card
              key={question.publicId}
              className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm transition hover:shadow-md"
            >
              <CardContent className="p-5">
                {editingId === question.publicId ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold">Edit Question</h2>

                        <p className="text-sm text-gray-500">
                          Update question details
                        </p>
                      </div>
                    </div>

                    <Textarea
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      className="min-h-[120px] rounded-2xl border-gray-300"
                    />

                    <select
                      value={editAnswerType}
                      onChange={(e) => setEditAnswerType(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-black"
                    >
                      <option value="single_select">Single Select</option>

                      <option value="multi_select">Multi Select</option>

                      <option value="text">Text</option>
                    </select>

                    {editAnswerType !== "text" && (
                      <div className="space-y-3">
                        {editOptions.map((option, index) => (
                          <div key={index} className="flex gap-3">
                            <Input
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                              }
                              className="h-11 rounded-xl"
                            />

                            <Button
                              variant="outline"
                              type="button"
                              onClick={() => removeOption(index)}
                              className="rounded-xl"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          onClick={addOption}
                          variant="outline"
                          className="rounded-xl"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Option
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={handleUpdate}
                        className="rounded-xl bg-black text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setEditingId("")}
                        className="rounded-xl"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                          {index + 1}
                        </div>

                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeStyle(
                                question.version.answerType,
                              )}`}
                            >
                              {question.version.answerType.replace("_", " ")}
                            </div>

                            <div className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                              Version {question.version.versionNumber}
                            </div>
                          </div>

                          <h2 className="text-lg font-semibold leading-relaxed text-gray-900">
                            {question.version.questionText}
                          </h2>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => startEditing(question)}
                          className="rounded-xl cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(question.publicId)}
                          className="rounded-xl cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {question.options.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {question.options.map((option) => (
                          <div
                            key={option.publicId}
                            className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-black"
                          >
                            {option.optionText}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                        <FileQuestion className="h-5 w-5" />
                        Text Answer Question
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
