import { auth } from "@/server/auth";
import { CourseService } from "@/server/services/course.service";
import { AiService } from "@/server/services/ai.service";
import { PageHeader } from "@/components/app/page-header";
import { ChatPanel } from "@/components/app/assistant/chat-panel";
import { StudyPlanPanel } from "@/components/app/assistant/study-plan-panel";

export default async function AssistantPage() {
  const session = await auth();
  const userId = session!.user.id;
  const courses = await CourseService.list(userId);

  return (
    <>
      <PageHeader
        title="AI Assistant"
        subtitle="Grounded in your real courses and deadlines — not generic advice."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <ChatPanel aiAvailable={AiService.available} />
        <StudyPlanPanel aiAvailable={AiService.available} courses={courses} />
      </div>
    </>
  );
}
