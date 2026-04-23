# Quality Assurance (QA) Report
**Project:** L+ SIVILIMA Construction Platform
**Version:** 1.0 (Current MVP)

This document outlines the high-level test scenarios and expected behaviors for the core features of the application. 

> [!NOTE]
> Many of these scenarios cover negative testing (invalid inputs) as well as positive testing (happy path) to ensure the system is robust.

---

## 1. Authentication & Authorization

### 1.1 Admin Login
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | Login with no credentials | Click "Sign In" with empty fields | Frontend displays HTML5 validation error ("Please fill out this field") for email/password. |
| **TC-AUTH-02** | Login with username only | Enter email, leave password empty | Frontend HTML5 validation prevents submission, asks for password. |
| **TC-AUTH-03** | Login with password only | Enter password, leave email empty | Frontend HTML5 validation prevents submission, asks for email. |
| **TC-AUTH-04** | Login with wrong password | Enter valid admin email, wrong password | Backend rejects; UI displays "Invalid email or password." |
| **TC-AUTH-05** | Login with wrong username | Enter unregistered email, valid password format | Backend rejects; UI displays "Invalid email or password." |
| **TC-AUTH-06** | Login with correct credentials | Enter correct admin email and password | Success; User is redirected to `/admin` dashboard. Session token is stored securely. |

### 1.2 Customer Registration
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-REG-01** | Mismatched passwords | Enter valid email, `pass123`, `pass456` | UI displays error: "Passwords do not match." |
| **TC-REG-02** | Short password | Enter email, `12345` for both passwords | UI displays error: "Password must be at least 6 characters." |
| **TC-REG-03** | Existing email | Enter an email already in the database | Backend rejects; UI displays "Registration failed" or specific email taken error. |
| **TC-REG-04** | Successful Registration | Enter valid new email and matching passwords | Success; User registered as `CUSTOMER` and redirected to Home `/`. |

---

## 2. Product Catalog

### 2.1 Viewing & Filtering
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-CAT-01** | Default Catalog Load | Navigate to `/catalog` | Categories fetch successfully, the first category is auto-selected, and its products are displayed. |
| **TC-CAT-02** | Switching Categories | Click on a different category pill | Products grid refreshes to show items strictly within the newly selected category. Pagination resets to Page 1. |
| **TC-CAT-03** | Category with no products | Select an empty category | UI displays the "📭 No products found in this category yet" empty state. |

### 2.2 Searching within Category
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-CAT-04** | Search existing product | Type a partial/full product name in search bar | Grid filters down instantly (client-side) to match the query. |
| **TC-CAT-05** | Search non-existing product | Type a gibberish string in search bar | UI displays the empty state message. |

---

## 3. Product Recommendation Wizard

### 3.1 Wizard Flow
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-WIZ-01** | Budget Selection | Choose a budget (e.g., "Economy") | Progress bar updates, proceeds to Climate question. |
| **TC-WIZ-02** | Navigation Back | Click "← Back" on step 2 | Wizard returns to step 1, retains previous answers contextually. |
| **TC-WIZ-03** | Submit Wizard | Select Budget and Climate | App shows loading spinner, fetches data, and routes to `/results`. |

### 3.2 Recommendation Results
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-RES-01** | Verify Result Output | Arrive at results page with matches | Products match the passed parameters (e.g., `LOW` budget, `TROPICAL` climate), ranked by durability. |
| **TC-RES-02** | Empty Recommendations | Engine returns no matches | UI displays "No products matched your criteria" with a button to "Try Again". |

---

## 4. Admin Dashboard (Protected Routes)

> [!IMPORTANT]
> To run these tests, the user must be authenticated with the `ADMIN` role. 
> Navigating to `/admin` as a `CUSTOMER` or an unauthenticated user should forcefully redirect to the Home page or Login page.

### 4.1 Product Management
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-ADM-01** | Add new product (valid) | Click "Add Product", fill all required fields, submit | Modal closes, grid refreshes, new product appears in the table. Success toast/alert. |
| **TC-ADM-02** | Add product (missing info) | Leave Name or Base Price blank, submit | HTML5 validation prevents submission. Fields are outlined in red. |
| **TC-ADM-03** | Toggle Active Status | Click the green/red switch on a product row | Product instantly switches between ACTIVE and INACTIVE state via the backend toggle API. |

### 4.2 Sub-Admin Management
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-ADM-04** | Create Sub-Admin | Click "Add Admin", enter valid email/pwd | Modal closes, success message, backend registers new user with `ADMIN` role. |
| **TC-ADM-05** | Invalid email format | Enter "admin123" in email field | HTML5 validation catches the invalid email format. |

---

## 5. UI & Global Components

### 5.1 Responsive Design
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-UI-01** | Mobile responsiveness | Resize browser to <768px wide | Navbar links collapse, Grid adjusts to 1 column, font sizes scale down properly without overflow. |

### 5.2 Floating Assistant
| Test Case ID | Scenario | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-ASST-01** | Toggle Assistant | Click the floating FAB chat icon | The chatbot window slides into view smoothly. |
| **TC-ASST-02** | Known Keyword Query | Type "budget", press enter | Bot responds automatically with the predefined explanation for budget levels. |
| **TC-ASST-03** | Unknown Keyword Query | Type "Hello world" | Bot replies with the fallback "I'm not sure about that yet!" message. |
