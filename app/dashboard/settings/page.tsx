import { requireUser } from "@/lib/session";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";
import { DeleteAccountForm } from "./DeleteAccountForm";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink/60">
          Manage your profile, password, and account.
        </p>
      </div>

      <Section title="Profile" description="Your name, age, position and club.">
        <ProfileForm user={user} />
      </Section>

      <Section title="Password" description="Update the password you sign in with.">
        <PasswordForm />
      </Section>

      <Section
        title="Danger Zone"
        description="Permanently delete your account and all of your data."
        danger
      >
        <DeleteAccountForm />
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  children,
  danger = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        danger ? "border-red-200 bg-red-50/40" : "border-cream-300 bg-cream-100"
      }`}
    >
      <h2 className={`text-lg font-bold ${danger ? "text-red-700" : "text-ink"}`}>
        {title}
      </h2>
      <p className={`mt-1 text-sm ${danger ? "text-red-700/60" : "text-ink/50"}`}>
        {description}
      </p>
      <div className="mt-5">{children}</div>
    </div>
  );
}
