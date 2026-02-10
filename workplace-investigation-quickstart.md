# Workplace Investigation Course - Quick Start

## Project
AI-powered Workplace Investigation course using Articulate Storyline, n8n workflows, and MongoDB.

## Tech Stack
- **n8n:** https://n8n.srv1129033.hstgr.cloud
- **MongoDB Database:** ConversAI
- **Collections:** `interactions` (all data), `prompts` (LLM prompts)
- **LLM:** Claude Sonnet 4.5

## Workflows Built

| Workflow | ID | Webhook | Status |
|----------|-----|---------|--------|
| WF1 - Single Response | `30PuySl3ZP8VBdj0` | `/webhook/single-response` | Done |
| WF2 - Chapter Opener | `FH6ezuyWMDfbyd6x` | `/webhook/chapter-opener` | Done |
| WF5 - Decision Tracker | `qKpLQUgX6oCc6J4h` | `/webhook/decision-tracker` | Needs testing |

## Workflows To Build
- **WF4 - Case Study Deep Dive** (Activity 6) - Multi-turn conversation with cross-chapter recall
- **WF6 - Chapter Aggregator** - End-of-chapter AI synthesis
- WF3 - Slide Interaction (skipped for now)

## Current Task
**Test WF5 (Decision Tracker)** - Need to:
1. Add HR Dilemma prompt to MongoDB `prompts` collection
2. Test `save_choice` and `analyze` actions

## Key Design Decisions
- Prompts stored in MongoDB (not hardcoded) - enables updates without republishing Storyline
- All interactions stored in unified `interactions` collection
- Email used as `user_id` for cross-session tracking
- 6 separate workflows (not one complex workflow with routing)

## Standard Payload Structure
```json
{
  "user_id": "email",
  "username": "Name",
  "module_id": "module_01",
  "chapter_id": "chapter_01",
  "activity_id": "activity_name",
  "activity_type": "chapter_opener",
  "content": "User's response",
  "session_id": "timestamp"
}
```

## MongoDB Credentials (n8n)
- MongoDB: `d35IlKZTtMoLnKId`
- Anthropic: `wOFjlcXmeM57WmYq`

## Full Details
See: `workplace-investigation-course-summary.md` for complete documentation.
