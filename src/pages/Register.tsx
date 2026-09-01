import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegister } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import type { RegisterPayload } from "@/types";

export default function RegisterPage() {
  const user = useAuthStore((s) => s.user);
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterPayload & { confirmPassword: string }>();

  if (user) return <Navigate to="/" replace />;

  const password = watch("password");

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join Socially and connect with others."
      footerText="Already have an account?"
      footerLinkText="Log In"
      footerLinkTo="/login"
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((values) =>
          registerUser.mutate({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        )}
      >
        <Input
          label="Name"
          placeholder="Seyed Ali Mousavi"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "At least 8 characters" },
          })}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        <Button
          type="submit"
          variant="secondary"
          className="mt-1 w-full"
          isLoading={registerUser.isPending}
        >
          Sign Up
        </Button>
      </form>
    </AuthCard>
  );
}
