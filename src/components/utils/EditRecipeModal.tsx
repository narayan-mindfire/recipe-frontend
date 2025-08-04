import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import API from "../../service/axiosInterceptor";
import Button from "../utils/Button";
import { recipeFormSchema } from "../../zod/schemas";
import type { Recipe } from "../../pages/Dashboard";
import { useToast } from "../ui/toast/use-toast";

interface EditRecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onUpdateSuccess: (updated: Recipe) => void;
}

type RecipeFormData = z.infer<typeof recipeFormSchema>;

export default function EditRecipeModal({
  recipe,
  onClose,
  onUpdateSuccess,
}: EditRecipeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: recipe.title,
      description: recipe.description,
      preparationTime: recipe.preparationTime,
      difficulty: recipe.difficulty,
      ingredientsRaw: recipe.ingredients.join(", "),
      steps: recipe.steps,
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
      formData.append("preparationTime", String(rest.preparationTime));
      formData.append("difficulty", rest.difficulty);
      formData.append("ingredients", ingredients.join(","));
      steps.forEach((step) => formData.append("steps", step));
      if (recipeImage && recipeImage.length > 0)
        formData.append("recipeImage", recipeImage[0]);

      const res = await API.put(`/recipes/${recipe._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpdateSuccess(res.data.recipe);
      onClose();
    } catch (err) {
      console.error(err);
      toast.addToast({
        message: "Failed to update recipe",
        variant: "error",
        animation: "pop",
        mode: "dark",
        icon: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--background)] p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[var(--primary)] mb-4">
          Edit Recipe
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              {...register("title")}
              className="w-full p-2 border rounded mt-1"
            />
            {errors.title && (
              <p className="text-[var(--primary)] text-sm">
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
              <p className="text-[var(--primary)] text-sm">
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
                <p className="text-[var(--primary)] text-sm">
                  {errors.preparationTime.message}
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
                <p className="text-[var(--primary)] text-sm">
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
              <p className="text-[var(--primary)] text-sm">
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
              <p className="text-[var(--primary)] text-sm">
                {errors.steps.message}
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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Recipe"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
