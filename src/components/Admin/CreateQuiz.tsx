import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import { z } from "zod";

import type { RootState } from "@/store/store";

const quizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
});

export default function CreateQuiz() {
  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = quizSchema.safeParse({
      title,
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);

      return;
    }
    try {
      setLoading(true);

      setError("");

      const response = await fetch("http://localhost:3000/api/v1/quizzes", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);

        navigate("/admin");
      } else {
        toast.error(data.message || "Failed to create quiz");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Create Quiz</h1>

          <p className="mt-2 text-gray-500">Create a new quiz for users</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Quiz Title</label>

            <input
              type="text"
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-300 px-4 outline-none transition focus:border-black"
            />

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-black text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating Quiz..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
}
