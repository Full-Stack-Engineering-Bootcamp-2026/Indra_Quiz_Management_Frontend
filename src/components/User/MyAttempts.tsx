import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

type Attempt = {
  attemptPublicId: string;
  attemptNumber: number;
  submittedAt: string;

  quiz: {
    publicId: string;
    title: string;
  };
};

export default function MyAttempts() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const [loading, setLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const navigate = useNavigate();

  const fetchAttempts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/v1/quizzes/attempts/my-attempts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setAttempts(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        Loading Attempts...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-black px-6 py-5 text-white shadow-lg">
        <h1 className="text-3xl font-bold">My Attempts</h1>

        <p className="mt-2 text-sm text-gray-300">
          View all your submitted quiz attempts
        </p>
      </div>

      {attempts.length === 0 ? (
        <div className="flex h-[250px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white text-gray-500 shadow-sm">
          No attempts found
        </div>
      ) : (
        <div className="grid gap-4">
          {attempts.map((attempt, index) => (
            <Card
              key={attempt.attemptPublicId}
              className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {attempt.quiz.title}
                      </h2>

                      <div className="flex flex-wrap gap-2">
                        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          Attempt #{attempt.attemptNumber}
                        </div>

                        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          {new Date(attempt.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      navigate(`/user/attempts/${attempt.attemptPublicId}`)
                    }
                    className="rounded-xl bg-black text-white cursor-pointer px-5 hover:opacity-90"
                  >
                    View Answers
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
