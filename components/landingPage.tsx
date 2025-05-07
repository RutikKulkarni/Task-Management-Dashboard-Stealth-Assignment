import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { FaTasks } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-16 flex items-end justify-end">
        <div className="flex items-center gap-3">
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Task Management Dashboard
          </h1>
          <p className="max-w-lg mx-auto text-lg text-gray-600 dark:text-gray-300">
            Stealth's Company Assignment
          </p>
          <div className="space-x-4">
            <Link href="/register">
              <Button size="lg">Sign Up</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
