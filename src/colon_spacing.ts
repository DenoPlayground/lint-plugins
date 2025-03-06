/**
 * This plugin ensures consistent spacing before and after the colon for type definitions.
 */
const plugin : Deno.lint.Plugin = {
  name: "colon-spacing",
  rules: {
    "no-space-before-color": {
      create(context) {
        return {
          Property(node) {
            if (!node.shorthand && !node.method) {
              const nodeText = context.sourceCode.getText(node)
              const colonText = nodeText.slice(
                node.key.range[1]-node.key.range[0],
                -(node.value.range[1] - node.value.range[0])
              );
              if (colonText != ': ') {
                const beforeColonText = nodeText.slice(
                  0,
                  node.key.range[1]-node.key.range[0]
                );
                const afterColonText = nodeText.slice(
                  -(node.value.range[1] - node.value.range[0])
                );
                context.report({
                  node,
                  message: `Wrong spacing around colon.`,
                  fix(fixer) {
                    return fixer.replaceText(node, beforeColonText + colonText.replace(/ *: */, ': ') + afterColonText)
                  }
                })
              }
             
            }
          },
          TSPropertySignature(node) {
            if ((node.typeAnnotation?.range[0] ?? node.key.range[1]) - node.key.range[1] != 1) {
              context.report({
                node,
                message: `Wrong spacing before colon.`,
                fix(fixer) {
                  return fixer.replaceTextRange(
                    [node.key.range[1], (node.typeAnnotation?.range[0] ?? node.key.range[1])],
                    ' '
                  )
                }
              })
            }
          },
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
