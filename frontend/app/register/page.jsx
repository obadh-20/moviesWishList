"use client";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
const loginShema = z.object({
  email: z.email("Invaled email address"),
  password:z.string().min(6,"Password must be at least 6 charecters long"),
  name: z.string().min(2, "Name must be at least 2 charecters long")
});

export default function RegisterPage() {
  
  const router = useRouter();
const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginShema),
  });

  const handleRegister = async (formData) => {
    const { name, email, password } = formData;

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // مهم عشان الكوكي تنحفظ
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
    
      if (res.status === 409) {
          console.log(res.status);
        router.push("/login");
        return;
      }

      // Register ناجح → redirect للصفحة المحمية
      router.push("/movies");
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center h-128 lg:h-screen justify-center">
      <h1 className="text-3xl font-light">Register</h1>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col gap-4 min-w-75 lg:min-w-96"
      >
        <div className="*:mt-3">
          <Label>Name</Label>
          <Input placeholder="Name" type="text" {...register("name")} />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </div>
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
            Registering
          </Button>
        ) : (
          <Button>Register</Button>
        )}
      </form>
    </div>
  );
}
