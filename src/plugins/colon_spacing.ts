/**
 * This plugin ensures consistent spacing before and after the colon for type definitions.
 */
const colonSpacing : Deno.lint.Plugin = {
  name: 'colon-spacing',
  rules: {
    'before-colon': {
      create(context) : Deno.lint.LintVisitor {
        return {
          TSTypeAnnotation(node) : void {
            if (['FunctionDeclaration', 'FunctionExpression', 'TSPropertySignature'].includes(node.parent.type)) {
              const functionStart = node.parent.range[0];
              const sectionEnd = node.range[0];
              const index =
                context.sourceCode.getText(node.parent).substring(0, sectionEnd - functionStart).search(/(?:\)|.) *$/) + 1;
              const sectionStart = functionStart + index;

              if (index !== -1 && sectionEnd - sectionStart !== 1) {
                context.report({
                  message: `Wrong colon spacing. Expected 1 space before colon.`,
                  range: [sectionStart - 1, sectionEnd + 1],
                  fix(fixer) : Deno.lint.Fix{
                    return fixer.replaceTextRange([sectionStart, sectionEnd], ' ');
                  }
                });
              }
            }
          }
        };
      }
    },
    'after-colon': {
      create(context) : Deno.lint.LintVisitor {
        return {
          TSTypeAnnotation(node) : void {
            if (['FunctionDeclaration', 'FunctionExpression', 'TSPropertySignature'].includes(node.parent.type)) {
              const sectionStart = node.range[0] + 1;
              const sectionEnd = node.typeAnnotation.range[0];

              if (sectionEnd - sectionStart !== 1) {
                context.report({
                  message: `Wrong colon spacing. Expected 1 space after colon.`,
                  range: [sectionStart - 1, sectionEnd + 1],
                  fix(fixer) : Deno.lint.Fix{
                    return fixer.replaceTextRange([sectionStart, sectionEnd], ' ');
                  }
                });
              }
            }
          }
        };
      }
    }
  }
};

export default colonSpacing;
