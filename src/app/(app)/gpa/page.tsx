import { auth } from "@/server/auth";
import { GradeService } from "@/server/services/grade.service";
import { GpaClient } from "@/components/app/gpa/gpa-client";

export default async function GpaPage() {
  const session = await auth();
  const userId = session!.user.id;

  const { semesters, cumulativeGpa } = await GradeService.getGpaBreakdown(userId);

  return (
    <GpaClient semesters={JSON.parse(JSON.stringify(semesters))} cumulativeGpa={cumulativeGpa} />
  );
}
