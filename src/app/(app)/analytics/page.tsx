import { auth } from "@/server/auth";
import { weeklyStudyMinutes, gpaTrend, assignmentCompletionByCourse } from "@/server/services/analytics.service";
import { AnalyticsClient } from "@/components/app/analytics/analytics-client";

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [weeklyMinutes, gpa, completion] = await Promise.all([
    weeklyStudyMinutes(userId),
    gpaTrend(userId),
    assignmentCompletionByCourse(userId),
  ]);

  return <AnalyticsClient weeklyMinutes={weeklyMinutes} gpaTrend={gpa} completion={completion} />;
}
