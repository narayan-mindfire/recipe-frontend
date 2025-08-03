import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import API from "../service/axiosInterceptor";
import Button from "../components/utils/Button";
import { useNavigate } from "react-router-dom";
import { recipeFormSchema } from "../zod/schemas";

type RecipeFormData = z.infer<typeof recipeFormSchema>;

export default function CreateRecipeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      preparationTime: undefined,
      difficulty: "easy",
      ingredientsRaw: "",
      steps: [""],
      recipeImage: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray<RecipeFormData>({
    control,
    name: "steps",
  });

  const onSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true);
    try {
      const { ingredientsRaw, steps, recipeImage, ...rest } = data;

      const ingredients = ingredientsRaw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("title", rest.title);
      if (rest.description) formData.append("description", rest.description);
      if (rest.preparationTime !== undefined)
        formData.append("preparationTime", String(rest.preparationTime));
      formData.append("difficulty", rest.difficulty);
      formData.append("ingredients", ingredients.join(","));
      steps.forEach((step) => formData.append("steps", step));
      if (recipeImage && recipeImage.length > 0)
        formData.append("recipeImage", recipeImage[0]);

      const res = await API.post("/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Recipe created successfully!");
      reset();
      navigate(`/recipes/${res.data.recipe._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create recipe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-[var(--background2)] text-[var(--text)] transition-colors duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="max-w-3xl mx-auto bg-[var(--background)] p-8 rounded-xl shadow-md space-y-6 text-[var(--text)]"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] text-center">
          Create a New Recipe
        </h2>

        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.title && (
            <p className="text-[var(--primary)] text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.description && (
            <p className="text-[var(--primary)] text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">
              Preparation Time (minutes)
            </label>
            <input
              type="number"
              {...register("preparationTime", { valueAsNumber: true })}
              className="w-full p-2 border rounded mt-1"
            />

            {errors.preparationTime && (
              <p className="text-[var(--primary)] text-sm mt-1">
                {errors.preparationTime?.message as React.ReactNode}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Difficulty</label>
            <select
              {...register("difficulty")}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {errors.difficulty && (
              <p className="text-[var(--primary)] text-sm mt-1">
                {errors.difficulty.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Ingredients (comma separated)
          </label>
          <input
            type="text"
            {...register("ingredientsRaw")}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.ingredientsRaw && (
            <p className="text-[var(--primary)] text-sm mt-1">
              {errors.ingredientsRaw.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Steps</label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <textarea
                  {...register(`steps.${index}`)}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-[var(--primary)] hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append("")}
              className="text-[var(--accent)] hover:underline text-sm"
            >
              + Add Step
            </button>
          </div>
          {errors.steps && (
            <p className="text-[var(--primary)] text-sm mt-1">
              {errors.steps.message as React.ReactNode}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Recipe Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("recipeImage")}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Create Recipe"}
          </Button>
        </div>
      </form>
    </div>
  );
}
