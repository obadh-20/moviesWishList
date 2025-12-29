"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
const loginShema = z.object({
  email: z.email("Invaled email address"),
  password:z.string().min(6,"Password must be at least 6 charecters long")
});
export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginShema),
  });
  const handleLogin = async (formData) => {
    const { email, password } = formData;

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // مهم عشان الكوكي تنحفظ
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // Login ناجح → redirect للصفحة المحمية
      router.push("/movies");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error, try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center h-128 lg:h-screen justify-center">
      <h1 className="text-3xl font-light">Login</h1>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col gap-4 min-w-75 lg:min-w-96 "
      >
        <div className="*:mt-3">
          <Label>Email</Label>
          <Input placeholder="Email" type="email" {...register("email")} />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>
        <div className="*:mt-3 mb-3">
          <Label>Password</Label>
          <Input
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>
          {isSubmitting ? (
            <Button>
              <Spinner />
              Signing in..
            </Button>
          ) : (
            <Button>Sign in</Button>
          )}
      </form>
    </div>
  );
}
