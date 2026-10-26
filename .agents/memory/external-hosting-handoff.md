---
name: External hosting handoff
description: Safely resolve repository and hosting access before moving this project's production traffic.
---

For an external-host migration, an integration attachment message is not proof that the provider is usable. Confirm the integration status is `ready` before calling its API, and keep the current production host available until the new endpoint passes its smoke checks.

**Why:** During the Render migration, GitHub remained in `connect` status even after an attachment call returned success, and no repository connection was available. Source transfer and DNS cutover are separate actions with different authorization requirements.

**How to apply:** Recheck GitHub and Render access before each external write. Do not claim a repository, service, or domain has moved until it is verified; ask the user to complete provider authorization when the connection is not ready.
