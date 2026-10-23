---
name: Dependency security constraints
description: Why the project retains dual package-manager overrides and a guarded braces fork.
---

Keep security overrides aligned for npm and pnpm whenever changing dependency constraints.

**Why:** This project retains both lockfiles; npm overrides do not apply to pnpm. Updating only the active npm tree leaves vulnerable versions in the other lockfile and in repository-wide security scans.

**How to apply:** Regenerate both lockfiles after changing dependency constraints and run the dependency security regression tests.

Use the guard-only braces fork until the upstream package provides a compatible nesting-depth fix, rather than migrating the entire styling stack solely to remove this transitive dependency.

**Why:** The latest upstream braces release still had an unpatched stack-exhaustion advisory. The replacement retains the same API and adds a nesting-depth bound; normal Tailwind file globs must remain compatible.

**How to apply:** When revisiting the replacement, verify normal brace expansion and rejection of deeply nested patterns, not just the package name shown by an audit.
