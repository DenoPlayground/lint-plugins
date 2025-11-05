import { rangePadding } from '../range_padding.ts';

/**
 * This plugin ensures consistent formatting for imports.
 */
const imports : Deno.lint.Plugin = {
  name: 'imports',
  rules: {
    'spacing-before': {
      create(context) : Deno.lint.LintVisitor {
        return {
          ImportDeclaration(node) : void {
            if (node.specifiers.find(specifier => specifier.type === 'ImportSpecifier')) {
              const section : Deno.lint.Range = [
                node.range[0] + context.sourceCode.getText(node).substring(
                  0,
                  node.specifiers[0].range[0] - node.range[0]
                ).search(/\{(?:  +|)/) + 1,
                node.specifiers[0].range[0]
              ]
              
              
              if (section[1] - section[0] !== 1) {
                context.report({
                  message: 'Wrong import spacing. Expected 1 space after {.',
                  range: rangePadding(section),
                  fix(fixer) : Deno.lint.Fix{
                    return fixer.replaceTextRange(section, ' ');
                  }
                });
              }
            }
          }
        };
      }
    },
    'spacing-after': {
      create(context) : Deno.lint.LintVisitor {
        return {
          ImportDeclaration(node) : void {
            if (node.specifiers.find(specifier => specifier.type === 'ImportSpecifier')) {
              const start = node.specifiers[node.specifiers.length - 1].range[1];
              const section : Deno.lint.Range = [
                start,
                start + context.sourceCode.getText(node).substring(start - node.range[0]).search(/(?<=  +|)\}/)
              ]
              
              
              if (section[1] - section[0] !== 1) {
                context.report({
                  message: 'Wrong import spacing. Expected 1 space before }.',
                  range: rangePadding(section),
                  fix(fixer) : Deno.lint.Fix {
                    return fixer.replaceTextRange(section, ' ');
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

export default imports;
