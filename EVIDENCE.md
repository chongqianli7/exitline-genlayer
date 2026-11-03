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
