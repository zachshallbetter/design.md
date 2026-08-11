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

import type { DesignSystemState } from '../../model/spec.js';
import { VALID_COMPONENT_SUB_TOKENS } from '../../model/spec.js';
import { COMPONENT_SUB_TOKENS } from '../../spec-config.js';
import type { RuleDescriptor, RuleFinding } from './types.js';

/**
 * Broken/circular references and unknown component sub-tokens.
 */
export function brokenRef(state: DesignSystemState): RuleFinding[] {
  const findings: RuleFinding[] = [];
  const expectedTypes = new Map<string, string>();
  for (const token of COMPONENT_SUB_TOKENS) {
    expectedTypes.set(token.name, token.type);
  }

  for (const [compName, comp] of state.components) {
    // Unresolved references
    for (const ref of comp.unresolvedRefs) {
      findings.push({
        path: `components.${compName}`,
        message: `Reference ${ref} does not resolve to any defined token.`,
      });
    }

    // Unknown component sub-tokens (lower severity override) and type validation
    for (const [propName, resolved] of comp.properties) {
      if (!(VALID_COMPONENT_SUB_TOKENS as readonly string[]).includes(propName)) {
        findings.push({
          severity: 'warning',
          path: `components.${compName}.${propName}`,
          message: `'${propName}' is not a recognized component sub-token. Valid sub-tokens: ${VALID_COMPONENT_SUB_TOKENS.join(', ')}.`,
        });
      } else if (resolved && typeof resolved === 'object' && 'type' in resolved) {
        const expectedType = expectedTypes.get(propName);
        if (expectedType && resolved.type.toLowerCase() !== expectedType.toLowerCase()) {
          findings.push({
            severity: 'warning',
            path: `components.${compName}.${propName}`,
            message: `'${propName}' expects a ${expectedType} token, but resolved to '${resolved.type}'.`,
          });
        }
      }
    }
  }
  return findings;
}

export const brokenRefRule: RuleDescriptor = {
  name: 'broken-ref',
  severity: 'error',
  description: 'Broken/circular references, unknown component sub-tokens, and property type mismatches.',
  run: brokenRef,
};
