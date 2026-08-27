import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import type { AuthCredentials } from "@/types";

export default function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentials>();

  if (user) return <Navigate to="/" replace />;

  return (
    <AuthCard
      title="Welcome Back!"
      subtitle="Login to access your profile and connect with others."
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerLinkTo="/register"
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((values) => login.mutate(values))}
      >
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />
        <Button
          type="submit"
          variant="secondary"
          className="mt-1 w-full"
          isLoading={login.isPending}
        >
          Log In
        </Button>
      </form>
    </AuthCard>
  );
}
