import colonSpacing from './colon_spacing.ts';
import { assertEquals } from '@std/assert';

Deno.test('colon-spacing plugin', async (test) => {
  await test.step('after-function rule, no space', () => {
    const diagnostics = Deno.lint.runPlugin(
      colonSpacing,
      'main.ts',
      `
      export function Foo(arg1: string, arg2: number): string { 
        return 'Hello World!';
      }
      `
    )

    assertEquals(diagnostics.length, 1);

    const diagnostic = diagnostics[0];

    assertEquals(diagnostic.id, 'colon-spacing/after-function');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space after function.');
    assertEquals(diagnostic.fix, [{range: [54, 54], text: ' '}]);
  });

  await test.step('after-function rule, too many spaces', () => {
    const diagnostics = Deno.lint.runPlugin(
      colonSpacing,
      'main.ts',
      `
      export function Foo(arg1: string, arg2: number)  : string { 
        return 'Hello World!';
      }
      `
    )

    assertEquals(diagnostics.length, 1);

    const diagnostic = diagnostics[0];

    assertEquals(diagnostic.id, 'colon-spacing/after-function');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space after function.');
    assertEquals(diagnostic.fix, [{range: [54, 56], text: ' '}]);
  });

  await test.step('before-type rule, no space', () => {
    const diagnostics = Deno.lint.runPlugin(
      colonSpacing,
      'main.ts',
      `
      export function Foo(prop1: string, prop2: number) :string {
        return 'Hello World!';
      }
      `
    )

    assertEquals(diagnostics.length, 1);

    const diagnostic = diagnostics[0];

    assertEquals(diagnostic.id, 'colon-spacing/before-type');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space before type.');
    assertEquals(diagnostic.fix, [{range: [58, 58], text: ' '}]);
  });

  await test.step('before-type rule, too many spaces', () => {
    const diagnostics = Deno.lint.runPlugin(
      colonSpacing,
      'main.ts',
      `
      export function Foo(prop1: string, prop2: number) :  string {
        return 'Hello World!';
      }
      `
    )

    assertEquals(diagnostics.length, 1);

    const diagnostic = diagnostics[0];

    assertEquals(diagnostic.id, 'colon-spacing/before-type');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space before type.');
    assertEquals(diagnostic.fix, [{range: [58, 60], text: ' '}]);
  });

  await test.step('before-type rule, no space, both', () => {
    const diagnostics = Deno.lint.runPlugin(
      colonSpacing,
      'main.ts',
      `
      export function Foo(prop1: string, prop2: number):string {
        return 'Hello World!';
      }
      `
    )
    
    assertEquals(diagnostics.length, 2);

    const afterFunctionDiagnostic = diagnostics[0];
    const beforeTypeDiagnostic = diagnostics[1];

    assertEquals(afterFunctionDiagnostic.id, 'colon-spacing/after-function');
    assertEquals(afterFunctionDiagnostic.message, 'Wrong colon spacing. Expected 1 space after function.');
    assertEquals(afterFunctionDiagnostic.fix, [{range: [56, 56], text: ' '}]);

    assertEquals(beforeTypeDiagnostic.id, 'colon-spacing/before-type');
    assertEquals(beforeTypeDiagnostic.message, 'Wrong colon spacing. Expected 1 space before type.');
    assertEquals(beforeTypeDiagnostic.fix, [{range: [57, 57], text: ' '}]);
  });
});
