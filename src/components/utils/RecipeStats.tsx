import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faSignal,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Props {
  preparationTime: number;
  difficulty: string;
  averageRating: number;
  numberOfRatings: number;
}

export default function RecipeStats({
  preparationTime,
  difficulty,
  averageRating,
  numberOfRatings,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <StatCard
        icon={faClock}
        label="Prep Time"
        value={`${preparationTime} min`}
      />
      <StatCard icon={faSignal} label="Difficulty" value={difficulty} />
      <StatCard
        icon={faStar}
        label="Avg Rating"
        value={`${averageRating.toFixed(1)} / 5`}
      />
      <StatCard icon={faThumbsUp} label="Ratings" value={numberOfRatings} />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: IconDefinition;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-xl shadow-sm">
      <FontAwesomeIcon icon={icon} className="text-[var(--accent)] text-xl" />
      <div>
        <p className="text-[var(--muted)] text-xs font-medium">{label}</p>
        <p className="text-[var(--text)] font-semibold text-base">{value}</p>
      </div>
    </div>
  );
}
