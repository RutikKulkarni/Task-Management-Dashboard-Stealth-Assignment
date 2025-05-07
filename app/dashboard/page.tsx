import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import TaskBoard from "@/components/task/board";
import DashboardHeader from "@/components/dashboard-header";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader user={session.user} />
      <main className="flex-1 container mx-auto p-4">
        <TaskBoard userId={session.user.id} />
      </main>
    </div>
  );
}
