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

  const debouncedFilterChange = useRef(
    debounce((filters) => {
      onFilterChange(filters, true);
    }, 500),
  ).current;

  useEffect(() => {
    const filters = { ingredients, minRating, maxTime, sortBy };
    debouncedFilterChange(filters);

    return () => {
      debouncedFilterChange.cancel();
    };
  }, [ingredients, minRating, maxTime, sortBy, debouncedFilterChange]);

  return (
    <div className="p-4 rounded-xl shadow flex flex-col sm:flex-row gap-4 mb-6 flex-wrap bg-[var(--background)]">
      <input
        className="flex-1 p-2 text-[var(--text)] rounded-md border border-gray-300 text-sm"
        placeholder="Ingredients (comma-separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <input
        className="w-24 p-2 text-[var(--text)] rounded-md border border-gray-300 text-sm"
        type="number"
        placeholder="Min Rating"
        value={minRating}
        onChange={(e) => setMinRating(e.target.value)}
      />
      <input
        className="w-24 p-2 text-[var(--text)] rounded-md border border-gray-300 text-sm"
        type="number"
        placeholder="Max Time"
        value={maxTime}
        onChange={(e) => setMaxTime(e.target.value)}
      />
      <select
        className="p-2 text-[var(--text)] rounded-md border border-gray-300 text-sm"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
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
