import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "../../zod/schemas";
import type { z } from "zod";
import API from "../../service/axiosInterceptor";
import { motion } from "framer-motion";
import Button from "./Button";
import { useEffect } from "react";
import { useToast } from "../ui/toast/use-toast";

interface EditProfileModalProps {
  defaultValues: z.infer<typeof editProfileSchema>;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditProfileModal = ({
  defaultValues,
  onClose,
  onSuccess,
}: EditProfileModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });
  const toast = useToast();
  useEffect(() => {
    setValue("profileImage", undefined);
  }, [setValue]);

  const onSubmit = async (data: z.infer<typeof editProfileSchema>) => {
    try {
      const formData = new FormData();

      formData.append("fname", data.fname);
      formData.append("lname", data.lname);
      formData.append("email", data.email);
      formData.append("bio", data.bio || "");

      if (data.profileImage instanceof File) {
        formData.append("profileImage", data.profileImage);
      }

      await API.put("/auth/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess?.();
      onClose();
    } catch (_err) {
      toast.addToast({
        message: "failed to update profile",
        mode: "dark",
        animation: "pop",
        variant: "error",
        icon: undefined,
      });
      toast.addToast({
        message: "failed to update profile",
        mode: "dark",
        variant: "error",
        animation: "pop",
        icon: undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-[var(--background)] rounded-2xl shadow-2xl p-8 text-[var(--text)] relative"
      >
        <button
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--primary)] text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[var(--primary)] text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("fname")}
            placeholder="First Name"
            className="w-full py-2 px-4 rounded-lg border border-[var(--muted)] focus:outline-none focus:ring-2"
          />
          {errors.fname && (
            <p className="text-[var(--primary)] text-sm">
              {errors.fname.message}
            </p>
          )}

          <input
            {...register("lname")}
            placeholder="Last Name"
            className="w-full py-2 px-4 rounded-lg border border-[var(--muted)] focus:outline-none focus:ring-2"
          />
          {errors.lname && (
            <p className="text-[var(--primary)] text-sm">
              {errors.lname.message}
            </p>
          )}

          <input
            {...register("email")}
            placeholder="Email"
            className="w-full py-2 px-4 rounded-lg border border-[var(--muted)] focus:outline-none focus:ring-2"
          />
          {errors.email && (
            <p className="text-[var(--primary)] text-sm">
              {errors.email.message}
            </p>
          )}

          <textarea
            {...register("bio")}
            placeholder="Bio"
            className="w-full py-2 px-4 rounded-lg border border-[var(--muted)] focus:outline-none focus:ring-2"
          />
          {errors.bio && (
            <p className="text-[var(--primary)] text-sm">
              {errors.bio.message}
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("profileImage", file);
            }}
          />

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
