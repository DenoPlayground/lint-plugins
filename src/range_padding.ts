/**
 * This function add padding to the range.
 * 
 * @param range The range to add padding to
 * @param padding Amount of padding
 */
export function rangePadding(
  range : Deno.lint.Range,
  padding : number = 1
) : Deno.lint.Range {
  return [
    range[0] - padding,
    range[1] + padding
  ]
}
