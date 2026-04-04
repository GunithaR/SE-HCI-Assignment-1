# Hybrid Recommendation Enhancement

## Architecture

The recommendation pipeline is now explicitly split into two layers:

1. Rule Engine Decision Layer (authoritative)
   - Evaluate products
   - Compute weighted scores
   - Rank products

2. AI Augmentation Layer (non-authoritative)
   - Receives structured post-ranking payload
   - Generates contextual insights only
   - Cannot reorder, add, or remove products

## Endpoints

- Existing deterministic endpoint:
  - `POST /api/public/recommendations`
  - Returns `List<RecommendationResponseDTO>`

- New hybrid endpoint:
  - `POST /api/public/recommendations/hybrid`
  - Returns `HybridRecommendationResponseDTO`

## Structured Payload Sent to AI

The AI layer prompt is built from structured rule-engine outputs only:

- user category and answer map
- ranked products (already scored/ranked)
- score breakdown per strategy
- matched rule hints and trade-offs

## Safety Rules

The prompt enforces these constraints:

- do not reorder products
- do not remove products
- do not add products
- return JSON-only insights

Server-side validation additionally enforces:

- reject insights referencing unknown product IDs
- sanitize and trim insight text
- fallback to deterministic insights if AI output is invalid/inconsistent

## Fallback Behavior

If AI is unavailable or invalid:

- ranked recommendations are returned unchanged
- deterministic fallback insights are returned
- `fallbackUsed=true` in hybrid response

## UI Behavior

The frontend displays:

- core ranked product list (unchanged)
- separate `Additional Insights` section for AI augmentation

This keeps explainability clear and preserves deterministic ranking authority.
