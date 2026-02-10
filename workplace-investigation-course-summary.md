# Workplace Investigation Course - AI Integration Project Summary

**Date:** 2026-02-02
**Project Status:** In Progress

---

## Project Overview

### Course Description
A **Workplace Investigation course** with AI interactivity, designed using **Articulate Storyline**. The course uses **n8n workflows** to handle AI interactions and **MongoDB** for data storage, enabling personalized learning experiences and longitudinal AI recall.

### Course Structure
- **Introduction Module** + **10 Modules**
- Module 1: 6 chapters
- Modules 2-8: 1 chapter each
- Modules 9-10: 2-3 chapters each

### Key Stakeholders
1. **Learners** - Access personalized feedback and progress
2. **AI Agents/Workflows** - Provide intelligent responses and cross-chapter recall
3. **Course Facilitators** - Monitor learner progress via dashboard (future)

---

## Activity Types

| Activity | Description | Captured | Workflow |
|----------|-------------|----------|----------|
| **Activity 1** | Intro case study review (Noble Care + flawed report) | Yes | WF1 |
| **Activity 2** | Short scenario questions | No | None |
| **Activity 3** | eLearning slides with AI interactions | Yes | WF3 (skipped for now) |
| **Activity 4** | Decision scenarios with branching logic | Yes | WF5 |
| **Activity 5** | Reflection questions | Yes | WF1 |
| **Activity 6** | Overarching case study (deep AI conversation) | Yes | WF4 |
| **Chapter Summary** | End-of-chapter AI synthesis | Yes | WF6 |

---

## Technical Architecture

### n8n Instance
- **URL:** https://n8n.srv1129033.hstgr.cloud
- **Webhook base:** https://n8n.srv1129033.hstgr.cloud/webhook/

### MongoDB
- **Database:** ConversAI
- **Collections:**
  - `interactions` - All learner/AI exchanges (unified schema)
  - `prompts` - Activity prompts and rubrics (enables updates without Storyline changes)

### Credentials (in n8n)
- MongoDB account: `d35IlKZTtMoLnKId`
- Anthropic API: `wOFjlcXmeM57WmYq`

### LLM
- **Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **Consideration:** May switch to Haiku for simpler interactions in production (cost/speed)

---

## Database Schema

### Collection: `interactions`

```javascript
{
  // Identification
  "_id": ObjectId,
  "user_id": "email or unique ID",      // Cross-session tracking
  "username": "Display Name",

  // Course Location
  "module_id": "module_01",
  "chapter_id": "chapter_01",           // null for intro
  "activity_id": "intro_case_review",
  "activity_type": "intro_review",      // See activity types

  // Message Data
  "role": "user" | "assistant",
  "content": "The actual text",

  // Context (varies by activity)
  "context": {
    "step_id": "decision_01",           // For decision scenarios
    "choice_label": "Option B",
    "question_prompt": "...",           // For reflections
    "prompt_version": "1.0"
  },

  // Threading
  "conversation_id": "user_module_chapter_activity_session",
  "sequence": 1,

  // Metadata
  "timestamp": ISODate,
  "interaction_type": "message" | "decision" | "reflection" | "feedback" | "summary",

  // AI-specific (assistant messages only)
  "ai_metadata": {
    "model": "claude-sonnet-4-5-20250929",
    "prompt_version": "1.0",
    "tokens_used": 1234
  }
}
```

### Collection: `prompts`

```javascript
{
  // Lookup Keys
  "module_id": "module_01",
  "chapter_id": "chapter_01",
  "activity_type": "chapter_opener",
  "activity_id": "hr_dilemma",          // Optional, for specific scenarios

  // Display
  "question_displayed": "What types of bias can you name...?",

  // LLM Guidance
  "key_concepts": ["Confirmation bias", "Authority bias", ...],
  "learning_point": "Understanding bias origins is more important than naming them.",
  "additional_instructions": "Be encouraging...",

  // For Decision Scenarios
  "scenario_title": "The HR Manager's Dilemma",
  "scenario_description": "...",
  "rubric": "DECISION 1: Option A = FAILED...",
  "analysis_instructions": "Analyze cumulative impact...",
  "role_description": "You are an expert HR Risk Auditor...",
  "tone": "Professional, constructive...",

  // Metadata
  "prompt_version": "1.0",
  "last_updated": "2026-02-01",
  "updated_by": "Lawrence"
}
```

---

## Workflows Completed

### WF1 - Single Response (Intro + Reflections)
- **ID:** `30PuySl3ZP8VBdj0`
- **Webhook:** `/webhook/single-response`
- **Status:** Complete and tested
- **Handles:** Activity 1 (intro_review), Activity 5 (reflection)
- **Nodes:** 9
- **Pattern:** User submits → Save → LLM feedback → Save AI → Return

**Storyline Payload:**
```javascript
{
  "user_id": "email",
  "username": "Name",
  "module_id": "intro",
  "chapter_id": null,
  "activity_id": "intro_case_review",
  "activity_type": "intro_review",  // or "reflection"
  "content": "User's response text",
  "session_id": "timestamp",
  "question_prompt": "..."          // For reflections only
}
```

---

### WF2 - Chapter Opener
- **ID:** `FH6ezuyWMDfbyd6x`
- **Webhook:** `/webhook/chapter-opener`
- **Status:** Complete and tested
- **Handles:** Start-of-chapter AI questions
- **Nodes:** 10
- **Pattern:** User responds → Save → Fetch Prompt from MongoDB → LLM → Save AI → Return

**Key Feature:** Prompts stored in MongoDB `prompts` collection, enabling updates without Storyline changes.

**Storyline Payload:**
```javascript
{
  "user_id": "email",
  "username": "Name",
  "module_id": "module_01",
  "chapter_id": "chapter_01",
  "activity_id": "chapter_opener",
  "activity_type": "chapter_opener",
  "content": "User's response",
  "session_id": "timestamp"
}
```

**Sample Prompt Document (in MongoDB):**
```javascript
{
  "module_id": "module_01",
  "chapter_id": "chapter_01",
  "activity_type": "chapter_opener",
  "question_displayed": "What types of bias can you name that could impact your investigations?",
  "key_concepts": ["Conflicting loyalties", "Historical prejudices", "Confirmation bias", ...],
  "learning_point": "Understanding bias origins is more important than naming them.",
  "prompt_version": "1.0"
}
```

---

### WF5 - Decision Tracker
- **ID:** `qKpLQUgX6oCc6J4h`
- **Webhook:** `/webhook/decision-tracker`
- **Status:** Created, needs testing
- **Handles:** Activity 4 (decision scenarios with branching)
- **Nodes:** 14
- **Pattern:**
  - `action: "save_choice"` → Save decision → Return OK
  - `action: "analyze"` → Get history → Fetch prompt → LLM analysis → Save AI → Return

**Storyline Payloads:**

Save Choice:
```javascript
{
  "user_id": "email",
  "username": "Name",
  "module_id": "module_01",
  "chapter_id": "chapter_01",
  "activity_id": "hr_dilemma",
  "activity_type": "decision_scenario",
  "action": "save_choice",
  "content": "Description of choice made",
  "step_id": "decision_01",
  "choice_label": "Option B",
  "session_id": "timestamp"
}
```

Request Analysis:
```javascript
{
  "user_id": "email",
  "username": "Name",
  "module_id": "module_01",
  "chapter_id": "chapter_01",
  "activity_id": "hr_dilemma",
  "activity_type": "decision_scenario",
  "action": "analyze",
  "session_id": "timestamp"
}
```

---

## Workflows To Build

### WF3 - Slide Interaction (Skipped for now)
- **Handles:** Activity 3 - eLearning slide AI chats
- **Status:** Deferred - not needed for current chapter

### WF4 - Case Study Deep Dive
- **Handles:** Activity 6 - Extended multi-turn conversations about Noble Care
- **Status:** Pending
- **Requirements:**
  - Multi-turn conversation (5-15+ exchanges)
  - Conversation history retrieval
  - Cross-chapter recall capability
  - Full case study context in prompts

### WF6 - Chapter Aggregator
- **Handles:** End-of-chapter AI synthesis
- **Status:** Pending
- **Requirements:**
  - Read all chapter interactions
  - Generate comprehensive feedback
  - Identify patterns and learning progress

---

## Existing Workflows (Legacy - Can Be Deactivated)

| Workflow | ID | Notes |
|----------|-----|-------|
| Intro Interaction - 1st Case Study Analysis | `U93RZOBYCi7s2eTb` | Original intro workflow, replaced by WF1 |
| Activity 4 - HR Dilemma (Branching Logic) | `cYUWVnT5WUd8TjQCioUMh` | Original decision tracker, replaced by WF5 |

---

## Storyline Integration

### Standard JavaScript Template

```javascript
// ============================================================
// STORYLINE TO n8n - STANDARD TEMPLATE
// ============================================================
var player = GetPlayer();

// User identification (captured from entry slide)
var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

// Get content from this slide
var userText = player.GetVar("VARIABLE_NAME");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "module_XX",
    "chapter_id": "chapter_XX",
    "activity_id": "activity_name",
    "activity_type": "type",
    "content": userText,
    "session_id": sessionId
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/WEBHOOK_PATH", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            player.SetVar("aiResponse_variable", response.response);
        } else {
            player.SetVar("aiResponse_variable", "Sorry, there was an error. Please try again.");
        }
    }
};

xhr.send(JSON.stringify(data));
```

### Session Initialization (Run Once at Course Start)
```javascript
var player = GetPlayer();
player.SetVar("session_id", Date.now().toString());
```

---

## Key Design Decisions

1. **6 Separate Workflows** - Easier to maintain than one complex workflow with routing
2. **MongoDB for Prompts** - Enables prompt updates without republishing Storyline course
3. **Unified Schema** - All activities write to `interactions` collection with consistent fields
4. **Email as user_id** - Enables cross-session tracking for longitudinal AI recall
5. **session_id** - Groups messages within a single course session
6. **conversation_id** - Generated from user + module + chapter + activity + session

---

## Naming Conventions

| Field | Convention | Examples |
|-------|------------|----------|
| `module_id` | `intro`, `module_01`, `module_02`... | `module_03` |
| `chapter_id` | `chapter_01`, `chapter_02`... or `null` | `chapter_02`, `null` |
| `activity_id` | Descriptive name | `intro_case_review`, `hr_dilemma` |
| `activity_type` | Fixed values | `intro_review`, `reflection`, `chapter_opener`, `decision_scenario`, `case_study`, `chapter_summary` |

---

## Task Tracker

| # | Task | Status |
|---|------|--------|
| 1 | Build Workflow 1: Single Response | COMPLETED |
| 2 | Build Workflow 2: Chapter Opener | COMPLETED |
| 3 | Build Workflow 3: Slide Interaction | SKIPPED (for now) |
| 4 | Build Workflow 4: Case Study Deep Dive | PENDING |
| 5 | Build Workflow 5: Decision Tracker | CREATED (needs testing) |
| 6 | Build Workflow 6: Chapter Aggregator | PENDING |

---

## Next Steps

1. **Test WF5 (Decision Tracker)**
   - Add HR Dilemma prompt to MongoDB `prompts` collection
   - Test save_choice and analyze actions
   - Test from Storyline

2. **Build WF4 (Case Study Deep Dive)**
   - Multi-turn conversation with history retrieval
   - Cross-chapter recall capability
   - Full case study context

3. **Build WF6 (Chapter Aggregator)**
   - Read all chapter interactions
   - Generate end-of-chapter synthesis

4. **Future Considerations**
   - Data hygiene/archiving strategy
   - Dashboard for learners and facilitators
   - ElevenLabs voice integration
   - HeyGen video integration
   - Production LLM selection (cost/speed optimization)

---

## Important URLs

- **n8n Dashboard:** https://n8n.srv1129033.hstgr.cloud
- **WF1 Webhook:** https://n8n.srv1129033.hstgr.cloud/webhook/single-response
- **WF2 Webhook:** https://n8n.srv1129033.hstgr.cloud/webhook/chapter-opener
- **WF5 Webhook:** https://n8n.srv1129033.hstgr.cloud/webhook/decision-tracker

---

## Files Referenced

- MongoDB database: `ConversAI`
- Collections: `interactions`, `prompts`
- Storyline source files: `.story` files (user's local machine)

---

*End of Summary*
