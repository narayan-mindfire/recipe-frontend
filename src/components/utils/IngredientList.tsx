interface Props {
  ingredients: string[];
}

export default function IngredientsList({ ingredients }: Props) {
  return (
    <div>
      <ul className="list-disc pl-5 text-sm space-y-1">
        {ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
