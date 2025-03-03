/**
 * This plugin ensures consistent spacing before and after the colon for type definitions.
 */
const plugin : Deno.lint.Plugin = {
  name: "type-colon-spacing",
  rules: {
    "no-space-before-color": {
      create(context) {
        return {
          Identifier(node) {
            if (node.typeAnnotation) {
              const spaceAfter = node.typeAnnotation.range[0] - (node.range[0] + node.name.length)

              if (spaceAfter != 1) {
                context.report({
                  node,
                  message: `Wrong spacing before colon.`,
                  range: [node.range[0], node.range[0] + spaceAfter],
                  fix(fixer) {
                    return fixer.replaceTextRange([(node.range[0] + node.name.length), (node.typeAnnotation!.range[0])], ' ')
                  }
                })
              }
            }
          }
        }
      }
    },
    "no-space-after-color": {
      create(context) {
        return {
          TSTypeAnnotation(node) {
            
            const spaceInFront = node.typeAnnotation.range[0] - (node.range[0] + 1)
            
            if (spaceInFront != 1) {
              context.report({
                node,
                message: `Wrong spacing after colon.`,
                fix(fixer) {
                  return fixer.replaceTextRange([node.range[0] + 1, node.range[0] + 1 + spaceInFront], ' ')
                }
              });
            }
          }
        }
      }
    }
  }
}
export default plugin;
