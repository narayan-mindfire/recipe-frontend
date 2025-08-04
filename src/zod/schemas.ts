import { z } from "zod";

/**
 * Schema for user login form
 * Validates email and password fields
 */
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password too short" }),
});

/**
 * Schema for user registration/signup
 * Includes validation for name, email, password, optional bio, and image file
 */
export const signupSchema = z
  .object({
    fname: z.string().min(1, "First name is required"),
    lname: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    bio: z.string().optional(),
    profileImage: z
      .any()
      .refine((file) => file instanceof File || file === undefined, {
        message: "Profile image must be a file",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Schema for editing user profile
 * Similar to signup but without password fields
 */
export const editProfileSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  profileImage: z.any().optional(),
});

/**
 * Schema for creating a new recipe
 * Validates title, preparation time, difficulty, ingredients, steps, and image
 */
export const recipeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  preparationTime: z.number().min(1, "preparation time must be >= 1"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  ingredientsRaw: z.string().min(1, "Ingredients are required"),
  steps: z.array(z.string().min(1, "Step cannot be empty")),
  recipeImage: z
    .any()
    .refine((file) => file instanceof FileList || file === undefined, {
      message: "Invalid file",
    })
    .optional(),
});
