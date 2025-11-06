import { rangeDistance } from '../range_distance.ts';
import { rangePadding } from '../range_padding.ts';

const spaceBeforeColon = 1;
const spaceAfterColon = 1;

/**
 * This plugin ensures consistent spacing before and after the colon for type definitions.
 */
const colonSpacing : Deno.lint.Plugin = {
  name: 'colon-spacing',
  rules: {
    'before-colon': {
      create(context) : Deno.lint.LintVisitor {
        return {
          FunctionExpression(node) : void {
            if (node.returnType) {
              // Section | from "<id> |(<...params>) |:<type>"
              const section : Deno.lint.Range = [
                node.parent.type === 'Property' ? node.parent.key.range[1] :
                node.parent.type === 'CallExpression' ? node.parent.callee.range[1] + 1 : node.parent.range[1],
                node.returnType.range[0]
              ]

              if (node.params.length > 0) {
                const last = node.params[node.params.length - 1]

                if (last.type === 'Identifier') {
                  // Section | from "<id>(<...params>|)  |:<type>"
                  section[0] = last.range[1] + 1;

                  if (last.typeAnnotation) {
                    // Section | from "<id>(<...params>:<type>|)  |:<type>"
                    section[0] = last.typeAnnotation.range[1] + 1;
                  }
                }
              }

              // Text _ from "<id>__(<...params>:<type>_)____:<type>"
              const text = context.sourceCode.getText(node).substring(
                section[0] - node.range[0],
                section[1] - node.range[0]
              )

              // Section | from "<id>(<...params>)|  |:<type>"
              const index = text.search(/\)/) + 1;

              section[0] += index;

              if (rangeDistance(section) !== spaceBeforeColon) {
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
          FunctionDeclaration(node) : void {
            if (node.returnType && node.id) {
              // Section | from "<id>| (<...params>) |:<type>"
              const section : Deno.lint.Range = [node.id.range[1], node.returnType.range[0]]
              
              if (node.params.length > 0) {
                const last = node.params[node.params.length - 1]

                if (last.type === 'Identifier' && last.typeAnnotation) {
                  // Section | from "<id>(<...params>)|  |:<type>"
                  section[0] = last.typeAnnotation.range[1] + 1;
                }
              }

              // Text _ from "<id>__(<...params>_)____:<type>"
              const text = context.sourceCode.getText(node).substring(
                section[0] - node.range[0],
                section[1] - node.range[0]
              )

              // Section | from "<id>(<...params>)|  |:<type>"
              const index = text.search(/\)/) + 1;

              section[0] += index;

              if (rangeDistance(section) !== spaceBeforeColon) {
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
          TSPropertySignature(node) : void {
            if (node.typeAnnotation) {
              // Text _ from "<name>___?__:<type>"
              const section : Deno.lint.Range = [node.key.range[1], node.typeAnnotation.range[0]]
              
              // Text _ from "<name>___?__:<type>"
              const text = context.sourceCode.getText(node).substring(
                node.key.range[1] - node.range[0],
                node.typeAnnotation.range[0] - node.range[0]
              )

              if (node.optional) {
                // Index of ? from "<name>?__:<type>"
                const textAfterOptionalIndex = text.search(/\?/) + 1

                section[0] += textAfterOptionalIndex
              }
              
              if (rangeDistance(section) !== spaceBeforeColon) {
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
          Identifier(node) : void {
            if (node.typeAnnotation) {
              // Text _ from "<name>___?__:<type>"
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

              if (rangeDistance(section) !== spaceBeforeColon) {
                context.report({
                  message: `Wrong colon spacing. Expected ${spaceBeforeColon} space before colon.`,
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
    },
    'after-colon': {
      create(context) : Deno.lint.LintVisitor {
        return {
          TSTypeAnnotation(node) : void {
            if (node.parent.type !== 'TSFunctionType') {

              // Text _ from "<name>___?__:<type>"
              const section : Deno.lint.Range = [node.range[0] + 1, node.typeAnnotation.range[0]]
              
              // Text _ from "<id>__(<...params>:<type>):___(__<type>)"
              const text = context.sourceCode.getText(node).substring(
                section[0] - node.range[0],
                section[1] - node.range[0]
              )

              // Section | from "<id>(<...params>):|  |(  <type>"
              const index = text.search(/\(/);

              if (index !== -1) {
                section[1] = section[0] + index;
              }

              if (rangeDistance(section) !== spaceAfterColon) {
                context.report({
                  message: `Wrong colon spacing. Expected ${spaceAfterColon} space after colon.`,
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
                  message: `Wrong colon spacing. Expected ${spaceAfterColon} space after colon.`,
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
