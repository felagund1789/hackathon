# Rollback Plan: [Milestone Name]

Copy this template once per milestone. Each milestone needs its own rollback plan
because the reversal steps depend on what shipped.

## What Shipped

List the specific features, database changes, and API modifications in this
milestone.

- Feature:
- Database migration:
- API changes:

## Rollback Decision Trigger

What observable event tells you to roll back? Be specific -- a gut feeling is
not a trigger.

- **Metric:** (e.g., error rate, latency p95, conversion rate)
- **Threshold:** (e.g., error rate > 2% for 15 minutes)
- **Who decides:** (on-call engineer? PM? both?)
- **Time limit:** (how long after deploy before rollback is no longer an option?)

## Rollback Steps

Number each step. Include who does it and how long it takes.

1. Step:
   - Owner:
   - Estimated time:

2. Step:
   - Owner:
   - Estimated time:

3. Step:
   - Owner:
   - Estimated time:

## Feature Flags

List any features controlled by flags. Disabling a flag is the fastest rollback
option when available.

| Feature | Flag Name | Default State | Rollback Action |
|---------|-----------|---------------|-----------------|
|         |           |               |                 |

## Data Migration Reversal

If this milestone includes database schema changes or data migrations, describe
how to reverse them. If a migration is irreversible (e.g., column dropped, data
merged), state that explicitly and describe the alternative recovery path.

## Customer Communication

What do you tell users if you roll back?

- **External message:** (short, benefit-focused, no internal jargon)
- **Channel:** (in-app banner, email, status page, all of the above)
- **Timing:** (before rollback, during, after)

## Post-Rollback

After rolling back, what happens next?

- Root cause investigation owner:
- Target timeline for fix:
- Criteria for re-deploying:
