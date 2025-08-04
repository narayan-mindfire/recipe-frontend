interface Props {
  steps: string[];
}

export default function RecipeSteps({ steps }: Props) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-[var(--background)] p-4 rounded-xl shadow-sm border-l-4 border-[var(--accent)]"
          >
            <div className="text-xl font-bold text-[var(--accent)]">
              {i + 1 < 10 ? `0${i + 1}` : i + 1}
            </div>
            <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
