import { rangePadding } from '../range_padding.ts';

const spaceBeforeColon = 1;

/**
 * This plugin ensures consistent spacing before and after the colon for type definitions.
 */
const colonSpacing : Deno.lint.Plugin = {
  name: 'colon-spacing',
  rules: {
    'before-colon': {
      create(context) : Deno.lint.LintVisitor {
        return {
          Identifier(node) : void {
            if (node.typeAnnotation) {
              const section : Deno.lint.Range = [node.range[1], node.typeAnnotation.range[0]]

              // Text _ from "<name>___?__:<type>"
              const text = context.sourceCode.getText(node.parent).substring(
                node.range[1] - node.parent.range[0],
                node.typeAnnotation.range[0] - node.parent.range[0]
              )
              
              if (node.optional) {
                // Index of ? from "<name>?__:<type>"
                const textAfterOptionalIndex = text.search(/\?/) + 1

                section[0] += textAfterOptionalIndex
              }

              if (section[1] - section[0] !== spaceBeforeColon) {
                context.report({
                  message: `Wrong colon spacing. Expected ${spaceBeforeColon} space before colon.`,
                  range: rangePadding(section),
                  fix(fixer) : Deno.lint.Fix {
                    return fixer.replaceTextRange(section, ' ');
                  }
                });
              }
            }
          },
          TSTypeAnnotation(node) : void {
            if (['FunctionDeclaration', 'FunctionExpression', 'TSPropertySignature', 'PropertyDefinition'].includes(node.parent.type)) {
              const text = context.sourceCode.getText(node.parent).substring(
                0,
                node.range[0] - node.parent.range[0]
              );

              const index = text.search(/. *$/gm) + 1;
              
              const section : Deno.lint.Range = [
                node.parent.range[0] + index,
                node.range[0]
              ]

              if (index !== -1 && section[1] - section[0] !== 1) {
                context.report({
                  message: 'Wrong colon spacing. Expected 1 space before colon.',
                  range: rangePadding(section),
                  fix(fixer) : Deno.lint.Fix {
                    return fixer.replaceTextRange(section, ' ');
                  }
                });
              }
            }
          },
          Property(node) : void {
            if (['ObjectExpression'].includes(node.parent.type)) {

              const index = context.sourceCode.getText(node).substring(
                node.key.range[1] - node.range[0],
                node.value.range[0] - node.range[0]
              ).search(/\:/);

              const section : Deno.lint.Range = [
                node.key.range[1],
                node.key.range[1] + index
              ];
              
              if (index !== -1 && section[1] - section[0] !== 0) {
                context.report({
                  message: 'Wrong colon spacing. Expected no space before colon.',
                  range: rangePadding(section),
                  fix(fixer) : Deno.lint.Fix {
                    return fixer.replaceTextRange(section, '');
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
            if (['FunctionDeclaration', 'FunctionExpression', 'TSPropertySignature', 'Identifier', 'PropertyDefinition'].includes(node.parent.type)) {
              const section : Deno.lint.Range = [
                node.range[0] + 1,
                node.typeAnnotation.range[0]
              ]

              if (section[1] - section[0] !== 1) {
                context.report({
                  message: 'Wrong colon spacing. Expected 1 space after colon.',
                  range: rangePadding(section),
                  fix(fixer) : Deno.lint.Fix{
                    return fixer.replaceTextRange(section, ' ');
                  }
                });
              }
            }
          },
          Property(node) : void {
            if (['ObjectExpression'].includes(node.parent.type)) {
              const index = context.sourceCode.getText(node).substring(
                node.key.range[1] - node.range[0],
                node.value.range[0] - node.range[0]
              ).search(/\:(?:  +|)$/);

              const section : Deno.lint.Range = [
                node.key.range[1] + index + 1,
                node.value.range[0]
              ]
              
              if (index !== -1) {
                context.report({
                  message: 'Wrong colon spacing. Expected 1 space after colon.',
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
    }
  }
};

export default colonSpacing;

function _foo(_e? : string) : void {

}
