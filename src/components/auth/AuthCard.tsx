import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export function AuthCard({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link to="/" className="font-logo text-2xl font-bold text-foreground">
            Socially
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
          <div className="mb-5 text-center">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link to={footerLinkTo} className="font-medium text-foreground hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
