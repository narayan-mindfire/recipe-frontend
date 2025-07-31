import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../zod/schemas";

import loginImage from "../assets/food1.png";
import Button from "../components/utils/Button";
import API from "../service/axiosInterceptor";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await API.post("/auth/login", data);
      login(res.data.user, res.data.accessToken);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-[var(--background2)] text-[var(--text)] transition-colors duration-300">
      <div className="flex w-full max-w-6xl shadow-2xl rounded-3xl mx-5 overflow-hidden mb-5">
        <div className="hidden md:flex flex-col justify-between md:px-5 bg-[var(--accent)] text-white w-1/2">
          <div className="my-auto flex justify-center">
            <img
              src={loginImage}
              alt="Side Visual"
              className="rounded-xl w-72 h-auto"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-[var(--background)] p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-3xl font-bold text-[var(--primary)] mb-4 text-center">
              Login to Your Account
            </h2>

            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full py-3 px-4 border border-[var(--muted)] rounded-lg focus:outline-none focus:ring-2"
              />
              {errors.email && (
                <p className="text-sm text-[var(--primary)] mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className="w-full py-3 px-4 border border-[var(--muted)] rounded-lg focus:outline-none focus:ring-2"
              />
              {errors.password && (
                <p className="text-sm text-[var(--primary)] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full mb-3">
              Login
            </Button>

            <p className="text-sm text-center text-[var(--muted)]">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>

            <div className="md:hidden flex justify-center mt-6">
              <img
                src={loginImage}
                alt="Mobile Visual"
                className="w-40 h-40 object-contain"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
