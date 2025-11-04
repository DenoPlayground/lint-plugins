import colonSpacing from './colon_spacing.ts';
import { assertEquals } from '@std/assert';

Deno.test('colon-spacing plugin', async (test) => {
  await test.step('before-colon rule, no space', () => {
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

    assertEquals(diagnostic.id, 'colon-spacing/before-colon');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space before colon.');
    assertEquals(diagnostic.fix, [{range: [54, 54], text: ' '}]);
  });

  await test.step('before-colon rule, too many spaces', () => {
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

    assertEquals(diagnostic.id, 'colon-spacing/before-colon');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space before colon.');
    assertEquals(diagnostic.fix, [{range: [54, 56], text: ' '}]);
  });

  await test.step('after-colon rule, no space', () => {
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

    assertEquals(diagnostic.id, 'colon-spacing/after-colon');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space after colon.');
    assertEquals(diagnostic.fix, [{range: [58, 58], text: ' '}]);
  });

  await test.step('after-colon rule, too many spaces', () => {
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

    assertEquals(diagnostic.id, 'colon-spacing/after-colon');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space after colon.');
    assertEquals(diagnostic.fix, [{range: [58, 60], text: ' '}]);
  });

  await test.step('before-colon/after-colon rule, no space, both', () => {
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

    assertEquals(afterFunctionDiagnostic.id, 'colon-spacing/before-colon');
    assertEquals(afterFunctionDiagnostic.message, 'Wrong colon spacing. Expected 1 space before colon.');
    assertEquals(afterFunctionDiagnostic.fix, [{range: [56, 56], text: ' '}]);

    assertEquals(beforeTypeDiagnostic.id, 'colon-spacing/after-colon');
    assertEquals(beforeTypeDiagnostic.message, 'Wrong colon spacing. Expected 1 space after colon.');
    assertEquals(beforeTypeDiagnostic.fix, [{range: [57, 57], text: ' '}]);
  });

  await test.step('before-colon rule, no space', () => {
    const diagnostics = Deno.lint.runPlugin(
      colonSpacing,
      'main.ts',
      `
      export interface Foo {
        port: string,
      }
      `
    )

    assertEquals(diagnostics.length, 1);

    const diagnostic = diagnostics[0];

    assertEquals(diagnostic.id, 'colon-spacing/before-colon');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space before colon.');
    assertEquals(diagnostic.fix, [{range: [42, 42], text: ' '}]);
  });

  await test.step('after-colon rule, no space', () => {
    const diagnostics = Deno.lint.runPlugin(
      colonSpacing,
      'main.ts',
      `
      export interface Foo {
        port :string,
      }
      `
    )

    assertEquals(diagnostics.length, 1);

    const diagnostic = diagnostics[0];

    assertEquals(diagnostic.id, 'colon-spacing/after-colon');
    assertEquals(diagnostic.message, 'Wrong colon spacing. Expected 1 space after colon.');
    assertEquals(diagnostic.fix, [{range: [44, 44], text: ' '}]);
  });
});
