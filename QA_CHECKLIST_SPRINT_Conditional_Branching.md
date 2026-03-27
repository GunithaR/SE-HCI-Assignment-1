# QA Checklist - Conditional Branching Assistant Flow

## Scope
This checklist validates the dynamic/conditional assistant flow where question visibility, order, and follow-up questions change based on previous answers.

Sprint focus:
- Conditional branching logic
- Skip/reorder behavior
- Dynamic validation
- Back/forward navigation integrity
- Consistent recommendation payload generation

## Test Data and Preconditions
- Backend is running and recommendation endpoint is reachable.
- Frontend wizard page is accessible.
- At least one product exists for recommendation categories.
- Browser cache cleared (or hard refresh) before test execution.

## Acceptance Criteria Coverage Matrix

| AC ID | Acceptance Criteria | Test Cases |
|---|---|---|
| AC-1 | Assistant changes questions based on prior answers | TC-01, TC-02, TC-03 |
| AC-2 | System skips irrelevant questions and introduces relevant follow-ups | TC-02, TC-04 |
| AC-3 | Users can navigate back/forward without losing valid answers | TC-05, TC-06 |
| AC-4 | Validation applies only to visible questions | TC-07, TC-08 |
| AC-5 | Final input profile is valid and consistent for backend | TC-09, TC-10 |
| AC-6 | No broken or contradictory question paths | TC-11 |
| AC-7 | Optional/unanswered fields handled safely when skipped | TC-08, TC-10 |

## User Scenario Mapping

| Scenario | Description | Test Cases |
|---|---|---|
| S1 | Display conditional question based on previous answer | TC-01, TC-03 |
| S2 | Skip irrelevant questions automatically | TC-02, TC-04 |
| S3 | Recalculate flow after answer modification | TC-05, TC-06 |
| S4 | Maintain input profile consistency after dynamic removal | TC-06, TC-10 |
| S5 | Complete adapted flow and proceed to evaluation | TC-09, TC-12 |

## Detailed Test Cases

### TC-01 - Coastal answer triggers conditional follow-up
- Objective: Verify dependent question appears when trigger answer is selected.
- Steps:
1. Open Wizard.
2. Select category with location/environment questions (for example Roofing Solution).
3. Choose location = coastal.
4. Proceed to next question.
- Expected:
1. Moisture/salt follow-up question appears.
2. Follow-up question is part of current visible flow.
3. No UI errors or blank steps.

### TC-02 - Irrelevant question is skipped automatically
- Objective: Verify non-applicable question is removed from path.
- Steps:
1. Open Wizard.
2. Select a path configured to skip style (for example affordability-first path).
3. Continue through flow.
- Expected:
1. Style question does not appear for that path.
2. Progress continues without dead-end.
3. Submission remains possible.

### TC-03 - Luxury style triggers finish/texture follow-up
- Objective: Verify style-based follow-up insertion.
- Steps:
1. Open Wizard and reach style question.
2. Select luxury style option.
3. Continue.
- Expected:
1. Finish/texture preference follow-up appears.
2. Follow-up content is relevant to luxury selection.

### TC-04 - Non-trigger path does not show trigger-based follow-up
- Objective: Ensure branch isolation.
- Steps:
1. Open Wizard.
2. Select non-coastal option and non-luxury style.
3. Continue.
- Expected:
1. Coastal and luxury-specific follow-up questions are not shown.
2. Flow remains coherent.

### TC-05 - Back navigation retains valid answers
- Objective: Verify previously entered valid answers persist.
- Steps:
1. Answer first 3-4 visible questions.
2. Navigate back step-by-step.
3. Navigate forward again.
- Expected:
1. Previously entered answers remain selected for still-visible questions.
2. No unexpected reset occurs.

### TC-06 - Flow recalculates and invalid answers are removed
- Objective: Validate branch recalculation after changing trigger answer.
- Steps:
1. Select trigger answer (for example coastal) and answer its follow-up.
2. Navigate back to trigger question.
3. Change answer to non-trigger option.
4. Continue to end.
- Expected:
1. Previously inserted follow-up question is removed.
2. Old follow-up answer is not preserved in final payload.
3. No contradictory question appears.

### TC-07 - Required validation only on currently visible question
- Objective: Ensure dynamic validation scope is correct.
- Steps:
1. At a required visible question, try Next without selecting answer.
2. Select answer and proceed.
- Expected:
1. Next/Submit is blocked when required visible question is unanswered.
2. Navigation proceeds immediately after answer selection.

### TC-08 - Skipped/optional questions do not block submission
- Objective: Verify optional/unshown fields are safe.
- Steps:
1. Follow path where certain questions are skipped.
2. Do not fill optional follow-up where applicable.
3. Submit.
- Expected:
1. Submission is allowed.
2. No validation errors for hidden/skipped questions.

### TC-09 - Final profile is valid for recommendation endpoint
- Objective: Validate backend contract compatibility.
- Steps:
1. Complete wizard using one branching path.
2. Submit and observe request payload in network tab.
- Expected:
1. Payload contains category and answers object.
2. Answers include only active/visible responses.
3. Recommendation response returns successfully.

### TC-10 - Final profile excludes inactive answers
- Objective: Confirm cleanup logic correctness.
- Steps:
1. Trigger and answer a conditional follow-up.
2. Go back and change trigger to remove that follow-up.
3. Submit.
- Expected:
1. Removed follow-up key is absent in payload.
2. Recommendation result is returned without backend errors.

### TC-11 - No broken or contradictory flow states
- Objective: Catch path integrity defects.
- Steps:
1. Execute at least 3 different answer paths across categories.
2. Observe transitions and question consistency.
- Expected:
1. No duplicate question IDs in active path.
2. No impossible/contradictory combination of questions.
3. No blank steps or crashes.

### TC-12 - End-to-end completion from adapted flow
- Objective: Validate full journey outcome.
- Steps:
1. Complete dynamic flow from category selection to submit.
2. Verify results page loads and shows ranked recommendations.
- Expected:
1. End-to-end process completes successfully.
2. Results are displayed without runtime errors.

## API Validation Checklist (Postman + Network Inspection)

- Endpoint: POST /api/public/recommendations
- Validate:
1. HTTP 200 for valid adapted payload.
2. No keys from skipped/removed questions in answers.
3. Response contains recommendation list and score fields.

## Defect Reporting Template
Use this template for any issue found:
- Defect ID:
- Title:
- Build/Commit:
- Preconditions:
- Steps to Reproduce:
- Expected Result:
- Actual Result:
- Severity/Priority:
- Screenshots/Video:
- Payload/Response Evidence:

## QA Sign-Off Criteria
Sign off only if all are true:
- All acceptance criteria mapped test cases pass.
- No blocker/critical defects remain open.
- Recalculation and answer cleanup validated.
- Recommendation payload contract remains valid.
- Regression pass completed for wizard navigation and submission.

## Presentation Notes (QA + Dev)
- Designed and executed conditional flow test coverage from acceptance criteria.
- Verified branching, skip logic, validation scope, and payload consistency.
- Reported and retested defects around filtering/recommendation behavior.
- Provided PR review comments and QA sign-off evidence.
- Collaborated on implementation fixes to align with expected user scenarios.
