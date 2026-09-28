"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/app/page-header";

type Props = {
  weeklyMinutes: { week: string; minutes: number }[];
  gpaTrend: { semester: string; gpa: number | null }[];
  completion: { course: string; completionRate: number }[];
};

export function AnalyticsClient({ weeklyMinutes, gpaTrend, completion }: Props) {
  const hasAnyData =
    weeklyMinutes.some((w) => w.minutes > 0) || gpaTrend.length > 0 || completion.length > 0;

  return (
    <>
      <PageHeader title="Analytics" subtitle="Real trends from your study sessions, grades, and assignments." />

      {!hasAnyData ? (
        <p className="py-16 text-center text-sm text-ink/50">
          Log some study sessions and grades first — these charts fill in as you use StudyFlow.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-flat p-5 lg:col-span-2">
            <h2 className="mb-4 font-display text-base font-semibold text-ink">Weekly Study Time (minutes)</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyMinutes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E6EA" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#A9AFBC" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#A9AFBC" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#3454D1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {gpaTrend.length > 0 && (
            <div className="card-flat p-5">
              <h2 className="mb-4 font-display text-base font-semibold text-ink">GPA Trend</h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gpaTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E6EA" vertical={false} />
                    <XAxis dataKey="semester" tick={{ fontSize: 11, fill: "#A9AFBC" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 4]} tick={{ fontSize: 11, fill: "#A9AFBC" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="gpa" stroke="#5B8266" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {completion.length > 0 && (
            <div className="card-flat p-5">
              <h2 className="mb-4 font-display text-base font-semibold text-ink">Assignment Completion by Course</h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completion} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E6EA" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#A9AFBC" }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="course" type="category" tick={{ fontSize: 11, fill: "#A9AFBC" }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip />
                    <Bar dataKey="completionRate" fill="#E8A33D" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
