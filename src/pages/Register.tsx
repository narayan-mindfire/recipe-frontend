import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signupSchema } from "../zod/schemas";
import loginImage from "../assets/food2.png";
import Button from "../components/utils/Button";
import API from "../service/axiosInterceptor";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const { login } = useAuth();
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const res = await API.post("/auth/register", data);
      login(res.data.user, res.data.accessToken);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-[var(--background2)] text-[var(--text)] transition-colors duration-300">
      <div className="flex w-full max-w-6xl shadow-2xl rounded-3xl mx-5 overflow-hidden my-5">
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h2 className="text-3xl font-bold text-[var(--primary)] mb-2 text-center">
              Create Your Account
            </h2>

            <div>
              <input
                {...register("fname")}
                placeholder="First Name"
                className="w-full py-3 px-4 border border-[var(--muted)] rounded-lg focus:outline-none focus:ring-2"
              />
              {errors.fname && (
                <p className="text-[var(--primary)] text-sm mt-1">
                  {errors.fname.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("lname")}
                placeholder="Last Name"
                className="w-full py-3 px-4 border border-[var(--muted)] rounded-lg focus:outline-none focus:ring-2"
              />
              {errors.lname && (
                <p className="text-[var(--primary)] text-sm mt-1">
                  {errors.lname.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full py-3 px-4 border border-[var(--muted)] rounded-lg focus:outline-none focus:ring-2"
              />
              {errors.email && (
                <p className="text-[var(--primary)] text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className="w-full py-3 px-4 border border-[var(--muted)] rounded-lg focus:outline-none focus:ring-2 "
              />
              {errors.password && (
                <p className="text-[var(--primary)] text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                className="w-full py-3 px-4 border border-[var(--muted)] rounded-lg focus:outline-none focus:ring-2 "
              />
              {errors.confirmPassword && (
                <p className="text-[var(--primary)] text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <textarea
                {...register("bio")}
                placeholder="Bio (optional)"
                className="w-full py-3 px-4 border border-[var(--muted)] rounded-lg focus:outline-none focus:ring-2 "
              />
            </div>

            <div>
              <input
                {...register("profileImage")}
                placeholder="Profile Image URL (optional)"
                className="w-full py-3 px-4 border border-[var(--muted)] rounded-lg focus:outline-none focus:ring-2 "
              />
            </div>

            <Button type="submit" className="w-full mb-2">
              Sign Up
            </Button>

            <p className="text-sm text-center text-[var(--muted)]">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                Login
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

export default Register;
