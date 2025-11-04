/**
 * This plugin ensures consistent formatting for imports.
 */
const imports : Deno.lint.Plugin = {
  name: 'imports',
  rules: {
    'spacing': {
      create(context) : Deno.lint.LintVisitor {
        return {
          ImportDeclaration(node) : void {
            const sectionStart = node.range[0];
            const sectionEnd = node.range[1];

            if (node.specifiers.length > 0) {
              context.report({
                message: 'Wrong import spacing. Expected 1 space after { and 1 space before }.',
                range: [sectionStart - 1, sectionEnd + 1],
                // fix(fixer) : Deno.lint.Fix{
                //   return fixer.replaceTextRange([sectionStart, sectionEnd], ' ');
                // }
              });
            }
          }
        };
      }
    }
  }
};

export default imports;
