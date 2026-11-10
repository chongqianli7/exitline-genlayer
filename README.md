# EXITLINE ↗

There should be a way out.

Exitline is a small workflow laboratory for finding reachable states that have no path to completion. Start with named states, actions and written transition rules. GenLayer independently interprets every transition; deterministic graph traversal produces a trap witness or a shortest exit path for each reachable state.

[Open the laboratory](https://chongqianli7.github.io/exitline-genlayer/) · [Finite model](MODEL.md) · [Network records](EVIDENCE.md) · [Contract](contracts/exitline.py)

## The revision trap

A document starts in Draft. Forward sends it to Review. Review can send it to Done or return it to Revision. If every Revision action stays in Revision, someone who enters that branch cannot finish—even though Draft has a short route to Done.

Exitline finds the reachable counterexample `Draft → Review → Revision`. Changing Revision / Forward to return to Review repairs the graph. Each reachable state now has an exit certificate that can be replayed without another model call.

## The escalation trap

A support ticket starts in New. Advance moves it to Triage, then to Waiting. Returning from Waiting escalates it to Escalated — and every Escalated action stays in Escalated. The ticket can be worked on forever without ever reaching Resolved.

Exitline finds the reachable counterexample `New → Triage → Waiting → Escalated`. Changing Escalated / Advance to return to Waiting (and Escalated / Return to Triage) repairs the graph. Each reachable state now has an exit certificate that can be replayed without another model call.

## The public library

A published model used to be usable only if you already knew its owner-qualified reference. Registered models are listed on-chain: open the library, pick a model, load it and walk it. Registration is owner-only, published models only, and idempotent — registering twice changes nothing. The library lists the editorial loop and the support ticket loop, both published and NONBLOCKING.

## Use the laboratory

1. **Practice:** inspect the trapped graph and click **Replay trap witness**. Choose **Way back** and walk the repaired system using Forward and Return. Missing rule demonstrates REVIEW. All three offline matrices are authored fixtures, not live model results.
2. **Read live example:** load a finalized published model and recompute its graph certificate in the browser. **Read live trap** loads a separate rejected-for-publication model.
3. **On chain:** connect an EIP-1193 wallet on Stable Studionet 61999 or create a temporary test signer. Define 3–6 distinct states, 2–3 actions, a terminal state index, a new model ID and the exact transition rules. The first state is the start.
4. **Interpret with GenLayer:** independent validators must agree on every target, including BLOCK and UNKNOWN. Missing or conditional information is not filled with defaults.
5. **Publish this exact model:** only the owner may publish, and only a NONBLOCKING model with the expected digest. Source inputs and accepted transitions cannot be edited.
6. **Walk the model:** each wallet has its own signed rehearsal. The contract enforces allowed actions, the expected step and terminal completion. It reserves enough of the 24-action budget for a shortest exit, so taking another loop cannot consume the last route out.
7. **Register it in the library:** after publication, the owner can register the model. The library lists every registered model with its title, owner, and digest; anyone can load one from the library and walk it with their own wallet.
8. **Export evidence:** download the current model, journey and up to 30 completed intents with compact receipt outcomes from this browser origin. This is local interaction history, not a global transaction index.

Temporary signer keys live only in page memory and disappear on reload. Never fund these addresses. Public records remain readable. External wallet integrations are supported by the client; recorded browser checks identify the signer type actually exercised.

## What the certificate proves

NONBLOCKING means every state reachable from the declared start has **some** finite path to the declared terminal. It does not mean that arbitrary repeated choices must terminate. A trapped state may have outgoing actions and self-loops; having an available action is not sufficient.

The implementation is a single-current-state finite transition system. It is not a BPMN/Petri-net engine, concurrent workflow proof, guarantee of real work completion, or executor for external tasks. The only changes made by a rehearsal are this contract's state updates.

The model sees user-supplied rules, not authenticated operational facts. Consensus may misinterpret them. UNKNOWN anywhere blocks the full certificate and publication. Unreachable closed loops do not invalidate the reachable-state property, but are visible in the full transition matrix.

## Build and verify

Node 22+ and Python 3.11+:

```sh
npm ci
npm test
npm run test:contract
npm run build
npm run dev
```

`dist/` is a static website. The Pages workflow installs pinned dependencies, runs the tests and publishes a production build. No application backend, paid model API or hosted database is required.

The local tests mock the GenLayer host and model. Graph tests exhaustively check all 15,625 four-state/two-action matrices with an absorbing terminal against an independent transitive-closure oracle. Live receipts are recorded separately; these tests do not establish model accuracy or injection immunity.

Stable Studionet only: chain `61999`, RPC `https://studio.genlayer.com/api`. Writes request full consensus with zero value and stop if gas is nonzero. License: MIT. [Source notices](NOTICE.md).
