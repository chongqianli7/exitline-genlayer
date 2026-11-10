# Expected results — Exitline public registry

Pre-registered expectations for the evidence in `evidence/registry-*.json`. Contract `0x8a53770267A917dCF2632d1ed2891c65d904Aa43`, owner `0x8d120f7a44fe195f69be599c89a8a4d777d86a35`, second wallet `0x26f98866d8f07d1bea1e0b7daf961716c7535ae4`. All transactions FINALIZED.

## Regression (v1 flows on the new contract)

| Step | Expected | Tx |
| --- | --- | --- |
| 01-deploy | SUCCESS, deployed code == source | `0x54032642df12e1a6929b4d90dfa3729847683f80926b9a8bc87db9b48189fa5a` |
| 02-trapped-analysis | SUCCESS, editorial-trap TRAPPED, witness `Forward → Return` | `0x99afa1cbb956ca445d39d3a68126cc448a7028a501558438b6744e7199b5f025` |
| 03-trapped-publication-denied | ERROR, still unpublished | `0x33bfbc360f17602cc8274cab0370a97923b430c9fb4255ad80074316e83a6e32` |
| 04-repaired-analysis | SUCCESS, editorial-open NONBLOCKING | `0x725379d503b92fa911288600d27eaee0d77a5538c127dc283d5d3001129eebd3` |
| 05-publish | SUCCESS, editorial-open published | `0xc96cc1f9488a8a12d937ebb97b6a51dee569bad702eea6d43fd0a73f33303468` |
| 06-forbidden-action-denied | ERROR, no journey started | `0x486641aa82c29f8b401ab34e3492e9e0698e289503ff60584b1c11e76bba6a92` |

## Second model (support ticket)

| Step | Expected | Tx |
| --- | --- | --- |
| 07-support-trap-analysis | SUCCESS, support-trap TRAPPED, trapped `[3]`, witness `Advance → Advance → Return` | `0xa5985a6a520895df8b348c570218b3f7efb5d09be0cded946a576c4627b814ab` |
| 08-support-trap-publication-denied | ERROR, still unpublished | `0xf5e824054d439d64e1280549d7e834a5922b4da791f67f2c62426d374772176b` |
| 09-support-analysis | SUCCESS, support-open NONBLOCKING, every exit replays to Resolved | `0x5e9d2f5c36f4324bd7d9429de400d6aaa0d822fb4613f2061d3c5b7a81823d58` |
| 10-support-publish | SUCCESS, support-open published | `0x4a774b0649b1f5beaa8290ae20fb2da29d0d6a509bf0866aba329a0c6f52e0d9` |

## Registry

| Step | Expected | Tx |
| --- | --- | --- |
| 11-register-editorial | SUCCESS, editorial-open entry index 0 | `0xf551527f3c4472116b7379d37e55c5adb27ca76912ae68bb27c9a69cee3035f7` |
| 12-register-support | SUCCESS, support-open entry index 1 | `0x43e3fd49cee1d8eb63bbe7df9838e237f9358402fa626cda3742003594c2dd53` |
| 13-register-unpublished-denied | ERROR, registry unchanged | `0x1b1daa2244e15ae4516080d0f2d6cde07c158fcea43423dcc28c2a5ace3e70de` |
| 14-register-nonowner-denied | ERROR, registry unchanged | `0x54d264d2d8dd3f78f67fe83728eadbe4dc927f2b8cdac821597bf6a2ba0adc2b` |
| 15-register-again-noop | SUCCESS, registry still exactly the same 2 entries | `0xb49c0e808bb277b0006c1e849c3dcd6eb2d41c4588d2fcaeec08ac95dbcb344d` |

## Second-wallet walks from the library

| Step | Expected | Tx |
| --- | --- | --- |
| 16-walk-support-1 | SUCCESS, walker at Triage, step 1 | `0xabe2d0e246f8660900463681e28c7cf2507cc518ee458c1bcefa6e4f4f6d0634` |
| 17-walk-support-2 | SUCCESS, walker at Waiting, step 2 | `0x4a41b4d880c8637598b2b2ba2a69fc7c74e2762e5ffa8649f1f04141bb02ed6f` |
| 18-walk-support-3 | SUCCESS, walker at Resolved, complete, step 3 | `0x0739effc53e938aad299c1d78a78199cfd16d5439ff1ced3af9c348c446b3f2f` |
| 19-walk-editorial-1 | SUCCESS, walker at Review, step 1 | `0xf6dc308abb9e2e23394cbc37577f464ba873b3601725c35771a3f09bc60fe531` |
| 20-walk-editorial-2 | SUCCESS, walker at Done, complete, step 2 | `0xf7c5398c9577f3a834023a5bb77b13f14bd68f04cceccb01edf80d51dde60409` |

## Final read-backs (latest-final)

- `list_registry` returns exactly 2 entries in registration order: editorial-open (index 0, digest `811effbc9d7ee437f92228f102f8739b416499de732368f925bebaa07db6501b`), support-open (index 1, digest `f37eaf0da85406b547bffa2c4ca253e63b37681f4c39764609cf4b13370e8fb1`).
- `get_registry_count` returns 2.
- Both published models read back NONBLOCKING + published.
- Both walker journeys read back complete at their terminals.
