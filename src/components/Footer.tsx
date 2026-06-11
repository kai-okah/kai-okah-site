import { profile } from "@/data/profile";

// Full name appears here as well (BRIEF R14), and the site links to its
// own source — the repo is part of the portfolio.
export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.fullName}
        </p>
        <p>
          Built in the open —{" "}
          <a
            href={profile.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            view this site&apos;s source
          </a>
        </p>
      </div>
    </footer>
  );
}
