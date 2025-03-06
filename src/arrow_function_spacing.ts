/**
 * This plugin ensures consistent spacing before and after the arrow for arrow functions.
 */
const plugin : Deno.lint.Plugin = {
  name: "arrow-function-spacing",
  rules: {
    "space-around-arrow": {
      create(context) {
        return {
          ArrowFunctionExpression(node) {
            const nodeText = context.sourceCode.getText(node)

            const arrowText = nodeText.slice(0, -(node.body.range[1]-node.body.range[0]))
            const bodyText = nodeText.slice(-(node.body.range[1]-node.body.range[0]))

            if (!(/[^ ] {1}=> {1}$/gm.test(arrowText))) {
              context.report({
                node,
                message: `Wrong spacing around arrow.`,
                fix(fixer) {
                  return fixer.replaceText(node, arrowText.replace(/ *= *> */, ' => ') + bodyText);
                }
              })
            }
          }
        }
      }
    }
  }
}
export default plugin;

