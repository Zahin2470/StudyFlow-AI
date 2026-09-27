"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  "Not started": "#A9AFBC",
  "In progress": "#3454D1",
  Submitted: "#5B8266",
  Graded: "#5B8266",
};

export function StatusChart({ data }: { data: { name: string; value: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return <p className="py-8 text-center text-sm text-ink/50">Add assignments to see your progress here.</p>;
  }

  return (
    <div className="flex items-center gap-6">
      <div className="h-36 w-36 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={38} outerRadius={62} paddingAngle={2}>
              {data.map((d) => (
                <Cell key={d.name} fill={COLORS[d.name] ?? "#A9AFBC"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[d.name] ?? "#A9AFBC" }}
            />
            <span className="text-ink/70">{d.name}</span>
            <span className="font-medium text-ink">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
