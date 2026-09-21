import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AuthShell } from "@/components/AuthShell";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }
  if (user.onboarded) {
    redirect("/dashboard/overview");
  }

  return (
    <AuthShell
      title="A few quick questions"
      subtitle="Tell us a bit about how you play — this powers your profile."
    >
      <OnboardingForm />
    </AuthShell>
  );
}
