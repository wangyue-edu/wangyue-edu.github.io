import React from 'react';
import { ReviewItem, RubricScores } from '../types';
import { UserCheck } from 'lucide-react';

interface ReviewPanelProps {
  reviews?: ReviewItem[];
  rubricScores?: RubricScores;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  reviews,
}) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Mentor Critiques */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            评审导师评语 (Mentor Critiques)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs flex flex-col justify-center"
            >
              <p className="text-sm text-stone-700 dark:text-stone-300 font-serif leading-relaxed italic">
                “{rev.comment}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
