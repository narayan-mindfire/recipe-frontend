import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../zod/schemas";

import loginImage from "../assets/food1.png";
import Button from "../components/utils/Button";
import API from "../service/axiosInterceptor";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/toast/use-toast";
import { Helmet } from "@dr.pogodin/react-helmet";

/**
 * Login page component.
 * Handles user login using react-hook-form and zod validation.
 * On successful login, redirects to dashboard and shows a toast.
 */
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  /**
   * Handles login form submission.
   * Calls the API, logs the user in, and navigates to dashboard.
   * Displays toast messages on success or error.
   *
   * @param data - User credentials from the form.
   */
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await API.post("/auth/login", data);
      login(res.data.user, res.data.accessToken);
      navigate("/dashboard?page=1", {
        state: {
          toast: {
            message: "Login successful!",
            variant: "success",
            animation: "pop",
            mode: "dark",
          },
        },
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.addToast({
        message: error.response?.data?.message || "Registration failed",
        mode: "dark",
        variant: "error",
        animation: "pop",
        icon: undefined,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Log In | Recipe Sharing Platform</title>
        <meta
          name="description"
          content="Create your free account on Recipe Sharing Platform"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sign Up | Recipe Sharing Platform" />
        <meta
          property="og:description"
          content="Join Recipe Sharing Platform today and start sharing your culinary creations!"
        />
        <meta
          property="og:image"
          content={`${window.location.origin}/assets/food2.png`}
        />
        <meta
          property="og:url"
          content={`${window.location.origin}/register`}
        />
        <meta property="og:site_name" content="Recipe Sharing Platform" />
      </Helmet>
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
    </>
  );
};

export default Login;
