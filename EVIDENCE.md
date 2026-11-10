# Network records

Stable Studionet · chain 61999 · [Contract 0x5382cad86E756c0443c99260E60338e9DA9E0ce1](https://explorer-studio.genlayer.com/address/0x5382cad86E756c0443c99260E60338e9DA9E0ce1)

Source SHA256: `41122a161b0e569dfe71891d5653a4f83a3ba3496b6fc1eb6b844e895270bcd1`. Deployed code was read back and compared byte for byte before contract calls.

The fixtures are authored editorial workflows, not a real organization’s operational policy. One zero-balance temporary signer ran these network cases. All requests used full consensus and zero value.

| Case | Transaction | Final execution |
| --- | --- | --- |
| 01-deploy | [0x62e4624f56…](https://explorer-studio.genlayer.com/tx/0x62e4624f561c1c5b1457c7f522292897820177b24de758aece5ea9019d0d7887) | FINALIZED / SUCCESS |
| 02-trapped-analysis | [0xe167f04c77…](https://explorer-studio.genlayer.com/tx/0xe167f04c770dc11ab56061a192ee1d0c1ef4033d7565c587dc8dfc16b0ffbc76) | FINALIZED / SUCCESS |
| 03-trapped-publication-denied | [0x84c57fb80f…](https://explorer-studio.genlayer.com/tx/0x84c57fb80f24fa60eb7d70cb66160f3cfbe7e69ea60c54f3b117401f18effa25) | FINALIZED / ERROR |
| 04-repaired-analysis | [0x03e172c09c…](https://explorer-studio.genlayer.com/tx/0x03e172c09c68cccdb674bcc73f194c95ed9f5265c56224aa6630bfaed05a7f2f) | FINALIZED / SUCCESS |
| 05-publish | [0xeae40dae89…](https://explorer-studio.genlayer.com/tx/0xeae40dae89d7b497176b7b9d81081572007eb541212c28c42671f7a021fe4767) | FINALIZED / SUCCESS |
| 06-forbidden-action-denied | [0x6088e1ed32…](https://explorer-studio.genlayer.com/tx/0x6088e1ed32bfd7dae04f0044edd9579c0c5ff9626a1f6b10c9951f461fc5526b) | FINALIZED / ERROR |
| 07-draft-to-review | [0x99880b5d43…](https://explorer-studio.genlayer.com/tx/0x99880b5d438001992ba8a2238587f04a1bbeb7ed24adab4fb842ec7904fa0baa) | FINALIZED / SUCCESS |
| 08-review-to-done | [0x4a353305fd…](https://explorer-studio.genlayer.com/tx/0x4a353305fd987afcd846b90c1da4fe02cce3fe95dabc30256d3d84a349665cff) | FINALIZED / SUCCESS |
| 09-uncertain-analysis | [0x553b3df419…](https://explorer-studio.genlayer.com/tx/0x553b3df41908e952a15120b3d9630b6a5cdff5d2147e77bac380c4caddbf811c) | FINALIZED / SUCCESS |
| 10-uncertain-publication-denied | [0x3c84e48c92…](https://explorer-studio.genlayer.com/tx/0x3c84e48c929d07f9bdedb49ceccb54d745956dbc276d58e97d3180d862ccebac) | FINALIZED / ERROR |

The trapped model has witness `Forward → Return`, entering Revision with no exit. Publication is rejected. The repaired model is NONBLOCKING and published. Its signed rehearsal reaches Done. The missing-rule model is REVIEW and publication is rejected. A forbidden starting action is also rejected. All three rejected executions are retained.

[Compact transaction and model index](evidence/summary.json) · [Raw full network receipts](evidence/studionet.json.gz) · [Deployment](public/deployment.json). Receipts use lossless gzip; inspect with `gzip -dc evidence/studionet.json.gz`.

Local checks: 15 mocked-host contract tests and 8 JavaScript tests passed, including exhaustive comparison of 15,625 small graphs against an independent transitive-closure oracle. Calldata tests cover safe BigInt/numeric equality and rejection of string substitutions. Local tests do not prove remote model accuracy. The production build passed.

## Published application

[Production laboratory](https://chongqianli7.github.io/exitline-genlayer/) · [Build and deployment](https://github.com/chongqianli7/exitline-genlayer/actions/runs/41679213649). Dependency installation, 15 contract tests, 8 JavaScript tests, production build and Pages deployment succeeded. The production interface independently read both the published NONBLOCKING model and the TRAPPED model from Stable Studionet and recomputed their certificates.

## Browser rehearsal

The interface completed `Draft → Review → Revision → Review → Done` on the published model. Four signed actions each reached finalized successful execution with intent-bound journey readback. The final journey has `complete: true`, step 4, and action indices `[0,1,0,0]`. This exercises the repaired return path, not just the direct completion route.

[Exported model, journey and compact receipt history](evidence/browser.json) · [Four-step index](evidence/browser-summary.json). These compact outcomes include transaction hashes, exact intents, execution signals and votes; they are not full raw receipts. The full network-case receipts are preserved separately above. The export also retains an additional partial rehearsal. All temporary test signers were controlled by one operator.

| Browser step | Transaction |
| --- | --- |
| 1: Forward | [0x9653b57a69…](https://explorer-studio.genlayer.com/tx/0x9653b57a697e4d4283066215ad6183136c10d1ecf556e906726d37be6148c77c) |
| 2: Return | [0xfa90cfc256…](https://explorer-studio.genlayer.com/tx/0xfa90cfc25639abe5193e99e0e19ce96d5a6f61b5ec16a0020f01cee6438609df) |
| 3: Forward | [0x890d2e1966…](https://explorer-studio.genlayer.com/tx/0x890d2e1966187f5127c78beaac9f2bae97da0353f0f4b6187f2bbafda4d379cd) |
| 4: Forward | [0x9d80e68969…](https://explorer-studio.genlayer.com/tx/0x9d80e68969ea56a735893378e7ffb26ce0e224d89401e4edcf005900b093a6bc) |

## Public registry — new deployment

New contract `0x8a53770267A917dCF2632d1ed2891c65d904Aa43` ([explorer](https://explorer-studio.genlayer.com/address/0x8a53770267A917dCF2632d1ed2891c65d904Aa43)), protocol `exitline-1`, source SHA-256 `03aa4b4f54a69ae7858916b8aee6d32842ca8b4c42a2b5b4c714d153a64063d4`. A published model can be registered by its owner into an on-chain index that anyone can list; the frontend renders the library and any wallet can walk a registered model. A second published model — a support-ticket loop with its own escalation trap and repair — joins the v1 editorial model in the registry.

| Step | Transaction | Result |
| --- | --- | --- |
| 01-deploy | [0x54032642df…](https://explorer-studio.genlayer.com/tx/0x54032642df12e1a6929b4d90dfa3729847683f80926b9a8bc87db9b48189fa5a) | FINALIZED / SUCCESS |
| 02-trapped-analysis | [0x99afa1cbb9…](https://explorer-studio.genlayer.com/tx/0x99afa1cbb956ca445d39d3a68126cc448a7028a501558438b6744e7199b5f025) | FINALIZED / SUCCESS |
| 03-trapped-publication-denied | [0x33bfbc360f…](https://explorer-studio.genlayer.com/tx/0x33bfbc360f17602cc8274cab0370a97923b430c9fb4255ad80074316e83a6e32) | FINALIZED / ERROR |
| 04-repaired-analysis | [0x725379d503…](https://explorer-studio.genlayer.com/tx/0x725379d503b92fa911288600d27eaee0d77a5538c127dc283d5d3001129eebd3) | FINALIZED / SUCCESS |
| 05-publish | [0xc96cc1f948…](https://explorer-studio.genlayer.com/tx/0xc96cc1f9488a8a12d937ebb97b6a51dee569bad702eea6d43fd0a73f33303468) | FINALIZED / SUCCESS |
| 06-forbidden-action-denied | [0x486641aa82…](https://explorer-studio.genlayer.com/tx/0x486641aa82c29f8b401ab34e3492e9e0698e289503ff60584b1c11e76bba6a92) | FINALIZED / ERROR |
| 07-support-trap-analysis | [0xa5985a6a52…](https://explorer-studio.genlayer.com/tx/0xa5985a6a520895df8b348c570218b3f7efb5d09be0cded946a576c4627b814ab) | FINALIZED / SUCCESS |
| 08-support-trap-publication-denied | [0xf5e824054d…](https://explorer-studio.genlayer.com/tx/0xf5e824054d439d64e1280549d7e834a5922b4da791f67f2c62426d374772176b) | FINALIZED / ERROR |
| 09-support-analysis | [0x5e9d2f5c36…](https://explorer-studio.genlayer.com/tx/0x5e9d2f5c36f4324bd7d9429de400d6aaa0d822fb4613f2061d3c5b7a81823d58) | FINALIZED / SUCCESS |
| 10-support-publish | [0x4a774b0649…](https://explorer-studio.genlayer.com/tx/0x4a774b0649b1f5beaa8290ae20fb2da29d0d6a509bf0866aba329a0c6f52e0d9) | FINALIZED / SUCCESS |
| 11-register-editorial | [0xf551527f3c…](https://explorer-studio.genlayer.com/tx/0xf551527f3c4472116b7379d37e55c5adb27ca76912ae68bb27c9a69cee3035f7) | FINALIZED / SUCCESS |
| 12-register-support | [0x43e3fd49ce…](https://explorer-studio.genlayer.com/tx/0x43e3fd49cee1d8eb63bbe7df9838e237f9358402fa626cda3742003594c2dd53) | FINALIZED / SUCCESS |
| 13-register-unpublished-denied | [0x1b1daa2244…](https://explorer-studio.genlayer.com/tx/0x1b1daa2244e15ae4516080d0f2d6cde07c158fcea43423dcc28c2a5ace3e70de) | FINALIZED / ERROR |
| 14-register-nonowner-denied | [0x54d264d2d8…](https://explorer-studio.genlayer.com/tx/0x54d264d2d8dd3f78f67fe83728eadbe4dc927f2b8cdac821597bf6a2ba0adc2b) | FINALIZED / ERROR |
| 15-register-again-noop | [0xb49c0e808b…](https://explorer-studio.genlayer.com/tx/0xb49c0e808bb277b0006c1e849c3dcd6eb2d41c4588d2fcaeec08ac95dbcb344d) | FINALIZED / SUCCESS |
| 16-walk-support-1 | [0xabe2d0e246…](https://explorer-studio.genlayer.com/tx/0xabe2d0e246f8660900463681e28c7cf2507cc518ee458c1bcefa6e4f4f6d0634) | FINALIZED / SUCCESS |
| 17-walk-support-2 | [0x4a41b4d880…](https://explorer-studio.genlayer.com/tx/0x4a41b4d880c8637598b2b2ba2a69fc7c74e2762e5ffa8649f1f04141bb02ed6f) | FINALIZED / SUCCESS |
| 18-walk-support-3 | [0x0739effc53…](https://explorer-studio.genlayer.com/tx/0x0739effc53e938aad299c1d78a78199cfd16d5439ff1ced3af9c348c446b3f2f) | FINALIZED / SUCCESS |
| 19-walk-editorial-1 | [0xf6dc308abb…](https://explorer-studio.genlayer.com/tx/0xf6dc308abb9e2e23394cbc37577f464ba873b3601725c35771a3f09bc60fe531) | FINALIZED / SUCCESS |
| 20-walk-editorial-2 | [0xf7c5398c95…](https://explorer-studio.genlayer.com/tx/0xf7c5398c9577f3a834023a5bb77b13f14bd68f04cceccb01edf80d51dde60409) | FINALIZED / SUCCESS |

The registry reads back two entries in order: editorial-open (index 0, digest `811effbc…6501b`) and support-open (index 1, digest `f37eaf0d…e8fb1`). A second wallet walked support-open to Resolved in 3 signed advances and editorial-open to Done in 2. Registering an unpublished model and registering as a non-owner both fail; re-registering leaves the registry unchanged. [Combined evidence](evidence/registry-evidence.json) · [Regression](evidence/registry-regression.json) · [Second model](evidence/registry-publish-second.json) · [Registration](evidence/registry-register.json) · [Support walk](evidence/registry-walk-new.json) · [Editorial walk](evidence/registry-walk-editorial.json) · [Negative cases](evidence/registry-negative-cases.json). One-command reviewer check: `node scripts/verify-registry.mjs` — 29 passed, 0 failed.
