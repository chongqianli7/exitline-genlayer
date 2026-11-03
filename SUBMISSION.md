# Exitline

Main tag: Developer Tools

A workflow laboratory that turns explicit written transition rules into a consensus-accepted finite-state model, finds reachable traps, and publishes only models where every reachable state can still finish.

A revision loop can have available actions but no path to completion. Exitline identifies the shortest route into such a trap. A repaired model provides replayable shortest exit paths for each reachable state. GenLayer validators independently interpret every state/action target; deterministic graph algorithms compute the result. The complete transition vector must agree, not just a final pass/fail label.

The application includes an offline laboratory, interactive graph, transition quotations, public finalized-record lookup, owner publication, per-wallet signed rehearsals and transaction evidence export. Rehearsals enforce permitted moves and preserve enough of a 24-action budget to reach the terminal.

Website: https://chongqianli7.github.io/exitline-genlayer/

Repository: https://github.com/chongqianli7/exitline-genlayer

[Network and browser records](EVIDENCE.md)

The fixture is an authored editorial workflow. The model is single-current-state and bounded; it does not execute real work or guarantee that arbitrary choices terminate. Source rules are public user-supplied data, and consensus may misinterpret them.
