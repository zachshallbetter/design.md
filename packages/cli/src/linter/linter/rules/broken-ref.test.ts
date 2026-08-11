// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { describe, it, expect } from 'bun:test';
import { brokenRef, brokenRefRule } from './broken-ref.js';
import { buildState } from './test-helpers.js';

describe('brokenRef', () => {
  it('emits error for unresolved token reference', () => {
    const state = buildState({
      colors: { primary: '#ff0000' },
      components: { button: { backgroundColor: '{colors.nonexistent}' } },
    });
    const findings = brokenRef(state);
    expect(findings.some(d => d.message.includes('does not resolve'))).toBe(true);
  });

  it('returns empty when all references resolve', () => {
    const state = buildState({
      colors: { primary: '#ff0000' },
      components: { button: { backgroundColor: '{colors.primary}' } },
    });
    const errors = brokenRef(state).filter(d => d.message.includes('does not resolve'));
    expect(errors.length).toBe(0);
  });

  it('emits warning (not error) for unknown component sub-tokens', () => {
    const state = buildState({
      colors: { primary: '#ff0000' },
      components: { button: { borderColor: '#ff0000' } },
    });
    const findings = brokenRef(state);
    const subTokenDiag = findings.find(d => d.message.includes('not a recognized'));
    expect(subTokenDiag).toBeDefined();
    expect(subTokenDiag!.severity).toBe('warning');
  });

  it('warns when a component sub-token resolves to a mismatched type', () => {
    const state = buildState({
      colors: { primary: '#ff0000' },
      rounded: { sm: '4px' },
      components: {
        button: {
          backgroundColor: '{rounded.sm}',
          rounded: '{colors.primary}',
        },
      },
    });
    const findings = brokenRef(state);
    const bgWarning = findings.find(f => f.path === 'components.button.backgroundColor');
    const roundedWarning = findings.find(f => f.path === 'components.button.rounded');

    expect(bgWarning).toBeDefined();
    expect(bgWarning!.severity).toBe('warning');
    expect(bgWarning!.message).toContain("expects a Color token, but resolved to 'dimension'");

    expect(roundedWarning).toBeDefined();
    expect(roundedWarning!.severity).toBe('warning');
    expect(roundedWarning!.message).toContain("expects a Dimension token, but resolved to 'color'");
  });

  it('warns when a typography property references a color token', () => {
    const state = buildState({
      colors: { primary: '#ff0000' },
      components: {
        button: {
          typography: '{colors.primary}',
        },
      },
    });
    const findings = brokenRef(state);
    const typoWarning = findings.find(f => f.path === 'components.button.typography');
    expect(typoWarning).toBeDefined();
    expect(typoWarning!.severity).toBe('warning');
    expect(typoWarning!.message).toContain("expects a Typography token, but resolved to 'color'");
  });

  it('does not warn when references are typed correctly', () => {
    const state = buildState({
      colors: { primary: '#ff0000' },
      rounded: { sm: '4px' },
      components: {
        button: {
          backgroundColor: '{colors.primary}',
          rounded: '{rounded.sm}',
        },
      },
    });
    const findings = brokenRef(state);
    const bgWarning = findings.find(f => f.path === 'components.button.backgroundColor');
    const roundedWarning = findings.find(f => f.path === 'components.button.rounded');
    expect(bgWarning).toBeUndefined();
    expect(roundedWarning).toBeUndefined();
  });

  it('has a valid rule descriptor', () => {
    expect(brokenRefRule.name).toBe('broken-ref');
    expect(brokenRefRule.severity).toBe('error');
    expect(brokenRefRule.description).toBeTruthy();
    expect(brokenRefRule.run).toBe(brokenRef);
  });
});
