import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

interface Props {
  onFilterChange: (
    filters: {
      ingredients: string;
      minRating: string;
      maxTime: string;
      sortBy: string;
    },
    shouldResetPage: boolean,
  ) => void;
}

export default function SearchFilters({ onFilterChange }: Props) {
  const [ingredients, setIngredients] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [order, setOrder] = useState(-1);

  const debouncedFilterChange = useRef(
    debounce((filters) => {
      onFilterChange(filters, true);
    }, 500),
  ).current;

  useEffect(() => {
    const filters = { ingredients, minRating, maxTime, sortBy, order };
    debouncedFilterChange(filters);

    return () => {
      debouncedFilterChange.cancel();
    };
  }, [order, ingredients, minRating, maxTime, sortBy, debouncedFilterChange]);

  return (
    <div className="p-4 rounded-xl shadow flex flex-col sm:flex-row gap-4 mb-6 flex-wrap bg-[var(--background)]">
      <input
        className="flex-1 p-2 text-[var(--text)] rounded-md border border-[var(--text)]] text-sm"
        placeholder="Ingredients (comma-separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <input
        className="w-28 p-2 text-[var(--text)] rounded-md border border-[var(--text)]] text-sm"
        type="number"
        placeholder="Min Rating"
        value={minRating}
        onChange={(e) => setMinRating(e.target.value)}
      />
      <input
        className="w-24 p-2 text-[var(--text)] rounded-md border border-[var(--text)]] text-sm"
        type="number"
        placeholder="Max Time"
        value={maxTime}
        onChange={(e) => setMaxTime(e.target.value)}
      />
      <select
        className="p-2 text-[var(--text)] rounded-md border border-[var(--text)]] text-sm"
        value={sortBy}
        onChange={(e) => {
          const value = e.target.value;
          setSortBy(value);

          if (value === "averageRating") {
            setOrder(-1);
          } else if (value === "preparationTime") {
            setOrder(1);
          } else {
            setOrder(-1);
          }
        }}
      >
        <option
          className="bg-[var(--background)] text-[var(--text)]]"
          value="updatedAt"
        >
          Recently Updated
        </option>
        <option
          className="bg-[var(--background)] text-[var(--text)]]"
          value="averageRating"
        >
          Top Rated
        </option>
        <option
          className="bg-[var(--background)] text-[var(--text)]]"
          value="preparationTime"
        >
          Quickest First
        </option>
      </select>
    </div>
  );
}
