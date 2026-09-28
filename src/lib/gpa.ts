// Pure functions, no I/O — GPA is derived on every read from GradeEntry
// rows, never written to the database as its own number (ARCHITECTURE.md
// §2). Keeping this file framework-free also makes it trivial to unit test.

export type GradeEntryLike = { score: number; maxScore: number; weight: number };

const SCALE: { min: number; points: number; letter: string }[] = [
  { min: 93, points: 4.0, letter: "A" },
  { min: 90, points: 3.7, letter: "A-" },
  { min: 87, points: 3.3, letter: "B+" },
  { min: 83, points: 3.0, letter: "B" },
  { min: 80, points: 2.7, letter: "B-" },
  { min: 77, points: 2.3, letter: "C+" },
  { min: 73, points: 2.0, letter: "C" },
  { min: 70, points: 1.7, letter: "C-" },
  { min: 67, points: 1.3, letter: "D+" },
  { min: 63, points: 1.0, letter: "D" },
  { min: 60, points: 0.7, letter: "D-" },
  { min: 0, points: 0.0, letter: "F" },
];

export function percentageToGrade(percentage: number): { points: number; letter: string } {
  const band = SCALE.find((b) => percentage >= b.min) ?? SCALE[SCALE.length - 1];
  return { points: band.points, letter: band.letter };
}

/**
 * Weighted average of whatever has been graded so far, normalized by the
 * weight actually entered — so a course with only 30% of its weight graded
 * still shows an accurate "current grade" instead of assuming zeros for the
 * rest. Returns null when nothing has been graded yet (no entries).
 */
export function courseGradeSummary(entries: GradeEntryLike[]) {
  if (entries.length === 0) return null;

  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight === 0) return null;

  const weightedSum = entries.reduce((sum, e) => sum + (e.score / e.maxScore) * e.weight, 0);
  const percentage = (weightedSum / totalWeight) * 100;
  const { points, letter } = percentageToGrade(percentage);

  return { percentage, points, letter, weightGraded: totalWeight };
}

/**
 * Credit-weighted GPA across a set of courses. Courses with no grade
 * entries yet are excluded entirely (not treated as 0.0) so an ungraded
 * course doesn't tank a semester's GPA before any grades exist.
 */
export function creditWeightedGpa(
  courses: { credits: number; summary: ReturnType<typeof courseGradeSummary> }[]
): number | null {
  const graded = courses.filter((c) => c.summary !== null);
  if (graded.length === 0) return null;

  const totalCredits = graded.reduce((sum, c) => sum + c.credits, 0);
  if (totalCredits === 0) return null;

  const totalPoints = graded.reduce((sum, c) => sum + c.summary!.points * c.credits, 0);
  return totalPoints / totalCredits;
}
