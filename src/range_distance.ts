/**
 * This function calculates the distance in a range.
 * 
 * @param range The range to calculate the distance for
 */
export function rangeDistance(range : Deno.lint.Range) : number {
  return range[1] - range[0];
}
