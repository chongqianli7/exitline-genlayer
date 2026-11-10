# Reviewer fast path — Exitline public registry

Exitline turns written workflow rules into a consensus-accepted finite-state model and certifies that every reachable state has an exit. This milestone adds a public on-chain registry: a published model can be registered by its owner, and anyone can list the registry and walk a registered model without knowing its slug in advance. It also adds a second published workflow — a support-ticket loop with its own escalation trap and repair — so the library holds two genuinely different models.

## Contract

| | |
| --- | --- |
| New contract | `0x8a53770267A917dCF2632d1ed2891c65d904Aa43` |
| Explorer | https://explorer-studio.genlayer.com/address/0x8a53770267A917dCF2632d1ed2891c65d904Aa43 |
| Deploy tx | `0x54032642df12e1a6929b4d90dfa3729847683f80926b9a8bc87db9b48189fa5a` |
| Source | `contracts/exitline.py` |
| Source SHA-256 | `03aa4b4f54a69ae7858916b8aee6d32842ca8b4c42a2b5b4c714d153a64063d4` |
| Protocol | `exitline-1` (unchanged) |
| Previous deployment (v1, untouched) | `0x5382cad86E756c0443c99260E60338e9DA9E0ce1` |

## Reproduce in one command

```sh
npm ci
node scripts/verify-registry.mjs
```

Read-only: no account, no writes, no keys. It checks deployed-code byte parity against `contracts/exitline.py`, the source SHA against `public/deployment.json`, the protocol string, all 20 evidence transactions (FINALIZED with the expected SUCCESS/ERROR outcome), both models published NONBLOCKING, the registry listing, and both completed rehearsals. Expected output ends `29 passed, 0 failed`.

## Evidence map

| File | What it shows |
| --- | --- |
| `evidence/registry-regression.json` | v1 flows re-run on the new contract: trap analysis, publication denied, repaired analysis, publish, forbidden action denied |
| `evidence/registry-publish-second.json` | Support-ticket trap analysis (TRAPPED, witness `New → Triage → Waiting → Escalated`), publication denied, repaired analysis (NONBLOCKING), publish |
| `evidence/registry-register.json` | Both registrations + the registry listing read back (editorial-open index 0, support-open index 1) |
| `evidence/registry-walk-new.json` | A second wallet walks support-open New → Triage → Waiting → Resolved (3 signed advances, complete) |
| `evidence/registry-walk-editorial.json` | The same second wallet walks editorial-open Draft → Review → Done (2 signed advances, complete) |
| `evidence/registry-negative-cases.json` | Registering an unpublished model fails; registering by a non-owner fails; re-registering is a no-op (registry unchanged) |
| `evidence/registry-evidence.json` | Combined: all 20 transactions, all 4 model records, the registry, both journeys |
| `public/deployment.json` | New deployment (address, owner, model ids, source SHA) |

The flow that produced the evidence is `scripts/registry-flow.mjs`. Local tests: `npm test` (10 JavaScript tests) and `npm run test:contract` (20 mocked-host Python tests, including 5 registry/support tests).

## What this does NOT prove

- Registration does not prove a model is correct or useful — only that it is published (NONBLOCKING) and its owner registered it. A published model can still be a poor workflow.
- The registry does not prove ownership beyond the model record: registration is owner-only, but the owner is whichever address analyzed the model.
- The library does not rank, curate, or endorse models. There is no unregister in this version; a registered entry stays listed.
- The rehearsal proves a wallet walked the abstract model to its terminal. It does not execute real work, and NONBLOCKING proves an option to finish, not that arbitrary choices terminate.
- Consensus may misinterpret written rules. The certificate is only as good as the rules and the agreed transitions.
