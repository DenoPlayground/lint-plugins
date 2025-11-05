/**
 * This plugin ensures consistent formatting for imports.
 */
const imports : Deno.lint.Plugin = {
  name: 'arrays',
  rules: {
    'negative-index': {
      create(context) : Deno.lint.LintVisitor {
        return {
          MemberExpression(node) : void {
            if (
              ['ExpressionStatement'].includes(node.parent.type) &&
              node.property.type === 'UnaryExpression' &&
              node.property.operator === '-'
            ) {
              const literal = context.sourceCode.getText(node.property.argument);
              
              if(literal !== '0') {
                const identifier = context.sourceCode.getText(node.object);

                context.report({
                  message: 'Possibly wrong expression. You can not index an array with a negative number.',
                  hint: `Maybe use '${identifier}[${identifier}.length - ${literal}]' instead?`,
                  node: node.property
                });
              }
            }
          }
        };
      }
    }
  }
};

export default imports;
