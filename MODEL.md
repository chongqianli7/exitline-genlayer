# Finite transitions and completion paths

## Interpretation boundary

An immutable model contains 3–6 state names, 2–3 action names, one start (index 0), one distinct absorbing terminal, and 40–4,000 characters of exact rules. State/action names are unique without regard to case. BLOCK and UNKNOWN are reserved state names.

Each nonterminal state/action cell receives one target: an exact declared state, BLOCK for an explicitly forbidden action, or UNKNOWN for missing, ambiguous, conditional or contradictory rules. State-preserving actions are self-loops. Terminal cells are fixed BLOCK by code and are not sent to the model. This absorbing-terminal convention is part of the formal model, not an extracted claim about an external operation.

The leader and every validator independently read the original rules. The custom validator parses both responses, requires an exact verbatim source quote per cell and compares the **entire ordered target vector**. The same overall graph verdict is insufficient. Quote wording need not match across models; each quote must independently occur in the source. Quote grounding does not prove the interpretation is correct.

## Deterministic certificate

1. Any UNKNOWN produces REVIEW. No partial certificate can be published.
2. Breadth-first traversal computes states reachable from the start and shortest action paths to them.
3. Reverse reachability from the terminal computes all states with an exit.
4. Reachable states outside that set are trapped. The first discovered one yields a shortest action sequence into a trap.
5. For every reachable state, a separate BFS supplies a shortest exit sequence, or null for a trapped state.

TRAPPED blocks publication. NONBLOCKING permits the owner to publish the exact SHA256 digest of the complete analyzed record. The digest includes protocol, namespace, names, rules, accepted quotations, matrix and graph analysis; the later `published` flag is excluded. Publication cannot change that data.

An unreachable trap is outside the completion-from-start property. An unknown cell blocks publication even when its state appears unreachable, because an unknown target could change reachability.

## Calls

| Method | Arguments | Effect |
| --- | --- | --- |
| `analyze` | `id, title, states_json, actions_json, terminal_index, rules` | Interpret and store one owner-namespaced immutable model |
| `publish` | `id, expected_digest` | Owner publishes only a NONBLOCKING record |
| `advance` | `owner, id, expected_step, action_index` | Sender advances their own rehearsal under a published model |
| `get_model` | `owner, id` | JSON model, or empty string |
| `get_journey` | `owner, id, participant` | JSON rehearsal, or empty string before first action |
| `get_protocol` | none | `exitline-1` |

IDs contain 1–40 lowercase letters, digits or hyphens. Model titles have 3–120 characters; state/action names 2–48 characters. Public records are not globally enumerable through the contract API; share their owner-qualified reference.

A model ID is not reusable. Corrections create a new ID. Failed consensus does not create a stored model. Neither publication nor a rehearsal performs another model call.

## Rehearsal invariants

One journey per participant per model; the first permitted action starts at state 0. Each advance checks the actual sender, exact expected step, valid action and stored target. Completion is terminal. There are at most 24 actions. Before any move, the contract requires `next_step + shortest_exit_length(target) <= 24`. A loop is rejected before it could exhaust the budget needed to finish. The certificate concerns the abstract model; the budget guard preserves an available exit in the bounded rehearsal as well.

A journey records ordered action indices, current state, step, participant and model digest. No real task execution, delegation, payment or ownership transfer is implied.

## Browser transaction handling

The client verifies chain ID, zero gas price, current account and deployed source identity before sending. It persists an exact intent before submission and a returned hash immediately. That hash is polled across reloads; unknown sends are not silently retried. Receipts are bound to sender, contract, method and arguments. Finality alone is insufficient: majority agreement, successful execution and method-specific `latest-final` readback are required. Readback errors retain pending tracking. Completed compact outcomes remain in local browser history and export; failed executions are retained too.
