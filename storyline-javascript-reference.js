// ============================================================
// WORKPLACE INVESTIGATION COURSE
// STORYLINE JAVASCRIPT REFERENCE
// ============================================================
//
// This file contains all JavaScript code for Storyline interactions.
// Copy the relevant section for each slide in your course.
//
// Webhooks:
// - Single Response: /webhook/single-response
// - Chapter Opener:  /webhook/chapter-opener
// - Decision Tracker: /webhook/decision-tracker
//
// ============================================================


// ============================================================
// SECTION 0: STORYLINE VARIABLES TO CREATE
// ============================================================
//
// Create these variables in Storyline before using the scripts:
//
// USER IDENTIFICATION:
// - learner_name (Text) - From name entry slide
// - learner_email (Text) - From email entry slide
// - session_id (Text) - Set once at course start
//
// INTRO ACTIVITY:
// - noble_Intro_analysis (Text) - Learner's case study review
// - aiResponse_noble_intro (Text) - AI feedback display
//
// CHAPTER OPENER:
// - chapter_opener_response (Text) - Learner's response
// - aiResponse_chapter_opener (Text) - AI feedback display
//
// DECISION TRACKER (HR Dilemma):
// - decision_01_response (Text) - Choice text
// - decision_01_label (Text) - "Option A", "Option B", etc.
// - decision_02_response (Text)
// - decision_02_label (Text)
// - decision_03_response (Text)
// - decision_03_label (Text)
// - decision_04_response (Text)
// - decision_04_label (Text)
// - aiResponse_hr_dilemma (Text) - Final AI analysis
//
// REFLECTIONS:
// - reflection_response (Text) - Learner's reflection
// - aiResponse_reflection (Text) - AI feedback display
//
// ============================================================


// ============================================================
// SECTION 1: SESSION INITIALIZATION
// ============================================================
// Run this ONCE when the course starts (e.g., on first slide)

var player = GetPlayer();
player.SetVar("session_id", Date.now().toString());


// ============================================================
// SECTION 2: WF1 - INTRO CASE STUDY REVIEW
// ============================================================
// Activity 1: Learner reviews Noble Care case and flawed report
// Webhook: /webhook/single-response

var player = GetPlayer();

var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

var userText = player.GetVar("noble_Intro_analysis");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "intro",
    "chapter_id": null,
    "activity_id": "intro_case_review",
    "activity_type": "intro_review",
    "content": userText,
    "session_id": sessionId
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/single-response", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            player.SetVar("aiResponse_noble_intro", response.response);
        } else {
            player.SetVar("aiResponse_noble_intro", "Sorry, there was an error processing your response. Please try again.");
        }
    }
};

xhr.send(JSON.stringify(data));


// ============================================================
// SECTION 3: WF2 - CHAPTER OPENER
// ============================================================
// Start-of-chapter AI question (e.g., bias identification)
// Webhook: /webhook/chapter-opener
//
// NOTE: Update module_id and chapter_id for each chapter

var player = GetPlayer();

var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

var userText = player.GetVar("chapter_opener_response");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "module_01",      // UPDATE for each module
    "chapter_id": "chapter_01",    // UPDATE for each chapter
    "activity_id": "chapter_opener",
    "activity_type": "chapter_opener",
    "content": userText,
    "session_id": sessionId
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/chapter-opener", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            player.SetVar("aiResponse_chapter_opener", response.response);
        } else {
            player.SetVar("aiResponse_chapter_opener", "Sorry, there was an error. Please try again.");
        }
    }
};

xhr.send(JSON.stringify(data));


// ============================================================
// SECTION 4: WF5 - DECISION TRACKER
// ============================================================
// Activity 4: Branching decision scenarios (e.g., HR Dilemma)
// Webhook: /webhook/decision-tracker
//
// Each decision slide saves the choice.
// Final slide requests AI analysis of all choices.


// ------------------------------------------------------------
// DECISION 1 - Save Choice
// ------------------------------------------------------------

var player = GetPlayer();

var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

var choiceText = player.GetVar("decision_01_response");
var choiceLabel = player.GetVar("decision_01_label");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "module_01",
    "chapter_id": "chapter_01",
    "activity_id": "hr_dilemma",
    "activity_type": "decision_scenario",
    "action": "save_choice",
    "content": choiceText,
    "step_id": "decision_01",
    "choice_label": choiceLabel,
    "session_id": sessionId
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/decision-tracker", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log("Decision 1 saved successfully");
        } else {
            console.log("Error saving decision 1:", xhr.status);
        }
    }
};

xhr.send(JSON.stringify(data));


// ------------------------------------------------------------
// DECISION 2 - Save Choice
// ------------------------------------------------------------

var player = GetPlayer();

var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

var choiceText = player.GetVar("decision_02_response");
var choiceLabel = player.GetVar("decision_02_label");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "module_01",
    "chapter_id": "chapter_01",
    "activity_id": "hr_dilemma",
    "activity_type": "decision_scenario",
    "action": "save_choice",
    "content": choiceText,
    "step_id": "decision_02",
    "choice_label": choiceLabel,
    "session_id": sessionId
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/decision-tracker", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log("Decision 2 saved successfully");
        } else {
            console.log("Error saving decision 2:", xhr.status);
        }
    }
};

xhr.send(JSON.stringify(data));


// ------------------------------------------------------------
// DECISION 3 - Save Choice
// ------------------------------------------------------------

var player = GetPlayer();

var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

var choiceText = player.GetVar("decision_03_response");
var choiceLabel = player.GetVar("decision_03_label");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "module_01",
    "chapter_id": "chapter_01",
    "activity_id": "hr_dilemma",
    "activity_type": "decision_scenario",
    "action": "save_choice",
    "content": choiceText,
    "step_id": "decision_03",
    "choice_label": choiceLabel,
    "session_id": sessionId
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/decision-tracker", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log("Decision 3 saved successfully");
        } else {
            console.log("Error saving decision 3:", xhr.status);
        }
    }
};

xhr.send(JSON.stringify(data));


// ------------------------------------------------------------
// DECISION 4 - Save Choice
// ------------------------------------------------------------

var player = GetPlayer();

var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

var choiceText = player.GetVar("decision_04_response");
var choiceLabel = player.GetVar("decision_04_label");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "module_01",
    "chapter_id": "chapter_01",
    "activity_id": "hr_dilemma",
    "activity_type": "decision_scenario",
    "action": "save_choice",
    "content": choiceText,
    "step_id": "decision_04",
    "choice_label": choiceLabel,
    "session_id": sessionId
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/decision-tracker", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log("Decision 4 saved successfully");
        } else {
            console.log("Error saving decision 4:", xhr.status);
        }
    }
};

xhr.send(JSON.stringify(data));


// ------------------------------------------------------------
// FINAL FEEDBACK - Request AI Analysis
// ------------------------------------------------------------
// Run this AFTER all decisions have been saved

var player = GetPlayer();

var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "module_01",
    "chapter_id": "chapter_01",
    "activity_id": "hr_dilemma",
    "activity_type": "decision_scenario",
    "action": "analyze",
    "session_id": sessionId
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/decision-tracker", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            player.SetVar("aiResponse_hr_dilemma", response.response);
        } else {
            player.SetVar("aiResponse_hr_dilemma", "Sorry, there was an error generating your feedback. Please try again.");
        }
    }
};

xhr.send(JSON.stringify(data));


// ============================================================
// SECTION 5: WF1 - REFLECTION QUESTIONS
// ============================================================
// Activity 5: End-of-chapter reflections
// Webhook: /webhook/single-response
//
// NOTE: Update module_id, chapter_id, and question_prompt for each reflection

var player = GetPlayer();

var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

var userText = player.GetVar("reflection_response");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "module_01",          // UPDATE for each module
    "chapter_id": "chapter_01",        // UPDATE for each chapter
    "activity_id": "reflection_01",    // UPDATE: reflection_01, reflection_02, etc.
    "activity_type": "reflection",
    "content": userText,
    "question_prompt": "What surprised you most about this chapter?",  // UPDATE for each reflection
    "session_id": sessionId
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/single-response", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            player.SetVar("aiResponse_reflection", response.response);
        } else {
            player.SetVar("aiResponse_reflection", "Sorry, there was an error. Please try again.");
        }
    }
};

xhr.send(JSON.stringify(data));


// ============================================================
// SECTION 6: WF4 - CASE STUDY DEEP DIVE (TO BE BUILT)
// ============================================================
// Activity 6: Extended multi-turn conversation about Noble Care
// Webhook: /webhook/case-study (not yet created)
//
// This workflow will be built next. Placeholder for future code.


// ============================================================
// SECTION 7: WF6 - CHAPTER AGGREGATOR (TO BE BUILT)
// ============================================================
// End-of-chapter AI synthesis
// Webhook: /webhook/chapter-summary (not yet created)
//
// This workflow will be built later. Placeholder for future code.


// ============================================================
// GENERIC TEMPLATE
// ============================================================
// Use this as a starting point for new interactions
// Copy and modify as needed

var player = GetPlayer();

// User identification
var userName = player.GetVar("learner_name");
var userEmail = player.GetVar("learner_email");
var userId = userEmail || ("user_" + Date.now());
var sessionId = player.GetVar("session_id");

// Get content from this slide
var userText = player.GetVar("YOUR_VARIABLE_NAME");

var data = {
    "user_id": userId,
    "username": userName,
    "module_id": "module_XX",          // UPDATE
    "chapter_id": "chapter_XX",        // UPDATE
    "activity_id": "activity_name",    // UPDATE
    "activity_type": "activity_type",  // UPDATE: intro_review, reflection, chapter_opener, decision_scenario
    "content": userText,
    "session_id": sessionId
    // Add additional fields as needed:
    // "action": "save_choice" or "analyze" (for decision tracker)
    // "step_id": "decision_01" (for decisions)
    // "choice_label": "Option A" (for decisions)
    // "question_prompt": "..." (for reflections)
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://n8n.srv1129033.hstgr.cloud/webhook/WEBHOOK_PATH", true);  // UPDATE
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            player.SetVar("aiResponse_variable", response.response);  // UPDATE
        } else {
            player.SetVar("aiResponse_variable", "Sorry, there was an error. Please try again.");  // UPDATE
        }
    }
};

xhr.send(JSON.stringify(data));


// ============================================================
// END OF FILE
// ============================================================
