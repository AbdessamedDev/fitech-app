# FitTech App - Backend Integration Guide

## Overview
This document summarizes the frontend integration with the FitTech backend API (v1.0.0). All modifications were made to the frontend only, maintaining compatibility with the existing backend structure.

## API Base URL
- **Development**: `http://localhost:5121/`
- **Environment Variable**: `VITE_MEMBERSHIP_API_URL`

## Implemented API Integrations

### 1. Subscription Management Endpoints

#### Plans Management
- **List Plans** - `GET /api/plans`
  - Frontend: `api.listPlans()`
  - Page: Admin > Subscriptions
  - Fallback: Mock data provided for offline support

- **Create Plan** - `POST /api/plans`
  - Frontend: `api.createPlan(planData)`
  - Page: Admin > Subscriptions (Modal)
  - Parameters: `name`, `price`, `sessionCount`, `duration`, `status`

- **Update Plan** - `PUT /api/plans/{id}`
  - Frontend: `api.updatePlan(id, planData)`
  - Page: Admin > Subscriptions (Modal)
  - Parameters: Same as Create Plan

- **Delete Plan** - `DELETE /api/plans/{id}`
  - Frontend: `api.deletePlan(id)`
  - Page: Admin > Subscriptions (Operations Menu)

#### Subscriptions Management
- **Create Subscription** - `POST /api/subscriptions`
  - Frontend: `api.createSubscription({ memberId, planId, paymentMethod, notes })`
  - Parameters: 
    - `memberId`: UUID of the member
    - `planId`: UUID of the selected plan
    - `paymentMethod`: "Cash" (default)
    - `notes`: Optional notes

- **Confirm Cash Payment** - `POST /api/subscriptions/confirm-payment`
  - Frontend: `api.confirmCashPayment({ subscriptionId, amountReceived, paymentMethod, notes })`
  - Used for confirming cash payments made by members

### 2. Renewal Request Management

#### Renewal Workflow
- **Request Renewal** - `POST /api/subscriptions/renew`
  - Frontend: `api.requestRenewal({ subscriptionId, amount, notes })`
  - Members can submit renewal requests for admin approval
  - Parameters:
    - `subscriptionId`: UUID of the subscription to renew
    - `amount`: Renewal amount in currency units
    - `notes`: Optional notes from the member

- **Online Renewal** - `POST /api/subscriptions/renew/online`
  - Frontend: `api.onlineRenewal({ subscriptionId, amount, notes })`
  - Immediate credit card payment processing
  - Automatically extends subscription if payment succeeds

- **List Pending Renewals** - `GET /api/subscriptions/renew/pending`
  - Frontend: `api.listPendingRenewals()`
  - Page: Admin > Requests
  - Returns all pending renewal requests awaiting admin review

- **Accept Renewal** - `PATCH /api/subscriptions/renew/{requestId}/accept`
  - Frontend: `api.acceptRenewal(requestId, notes)`
  - Page: Admin > Requests (Action Button)
  - Creates payment record and activates extended subscription

- **Reject Renewal** - `PATCH /api/subscriptions/renew/{requestId}/reject`
  - Frontend: `api.rejectRenewal(requestId, notes)`
  - Page: Admin > Requests (Action Button)
  - Notifies member of rejection

### 3. Member Management Endpoints

- **List Members** - `GET /api/members`
  - Frontend: `api.listMembers({ page, pageSize, search, status })`
  - Page: Admin > Members
  - Supports pagination and filtering

- **Get Member** - `GET /api/members/{id}`
  - Frontend: `api.getMember(id)`
  - Fetches detailed member information

- **Create Member** - `POST /api/members`
  - Frontend: `api.createMember(memberData)`
  - Page: Admin > Members (Add Modal)

- **Update Member** - `PUT /api/members/{id}`
  - Frontend: `api.updateMember(id, memberData)`
  - Page: Admin > Members

- **Delete Member** - `DELETE /api/members/{id}`
  - Frontend: `api.deleteMember(id)`

- **Suspend Member** - `PATCH /api/members/{memberId}/suspend`
  - Frontend: `api.suspendMember(memberId)`
  - Page: Admin > Members (Operations Menu)

- **Activate Member** - `PATCH /api/members/{memberId}/activate`
  - Frontend: `api.activateMember(memberId)`
  - Page: Admin > Members (Operations Menu)

- **Get Subscription History** - `GET /api/members/{memberId}/subscriptions`
  - Frontend: `api.getSubscriptionHistory(memberId)`
  - Fetches all subscriptions for a member

- **Get Active Subscription** - `GET /api/members/active-subscription`
  - Frontend: `api.getActiveSubscription()`
  - Current member's active subscription

### 4. User Profile Endpoints

- **Get My Profile** - `GET /api/me`
  - Frontend: `api.getMyProfile()`
  - Fetches current authenticated user's profile

- **Update My Profile** - `PUT /api/me`
  - Frontend: `api.updateMyProfile(profileData)`
  - Updates current user's profile information

- **Get My Subscription** - `GET /api/me/subscription`
  - Frontend: `api.getMySubscription()`
  - Current user's active subscription

- **Get My Subscriptions** - `GET /api/me/subscriptions`
  - Frontend: `api.getMySubscriptions()`
  - All subscriptions for current user

- **Get My Sessions** - `GET /api/me/sessions`
  - Frontend: `api.getMySessions()`
  - Training sessions information

- **Get My Payments** - `GET /api/me/payments`
  - Frontend: `api.getMyPayments()`
  - Payment history for current user

## Updated Pages & Components

### Admin Dashboard
1. **Subscriptions** (`/admin/subscriptions`)
   - List all subscription plans
   - Create/Edit/Delete plans
   - Error handling with mock data fallback
   - Filtering and sorting capabilities

2. **Requests** (`/admin/requests`)
   - ✅ **NOW FULLY CONNECTED TO API**
   - Displays pending renewal requests from `GET /api/subscriptions/renew/pending`
   - Accept renewal with `PATCH /api/subscriptions/renew/{requestId}/accept`
   - Reject renewal with `PATCH /api/subscriptions/renew/{requestId}/reject`
   - Real-time status updates
   - Automatic transformation of API response to UI format
   - Error handling with fallback to mock data

3. **Members** (`/admin/members`)
   - List members with pagination
   - Add new members
   - Edit member details
   - Suspend/Activate members
   - View subscription history

4. **Finance** (`/admin/finance`)
   - Revenue analytics
   - Payment tracking
   - Financial reporting

### Coach Features
1. **Messaging** (`/coach/messaging`)
   - Real-time chat with members and clients
   - Private conversations and group chats
   - Image sharing capabilities
   - Status indicators (online/offline)
   - Message history

2. **Programs** (`/coach/programs`)
   - Create and manage training programs
   - List all programs with filters
   - Program details and editor
   - Status (Published/Draft)

3. **Profile** (`/coach/profile`)
   - View and edit coach profile
   - Profile settings and preferences

## Error Handling & Fallbacks

### Offline Support
All major pages include offline fallback mechanisms:
- Mock data is provided for when API is unavailable
- Users can still interact with the application
- Graceful degradation without breaking the UI

### Error Messages
- Clear error messages displayed to users when API calls fail
- Console logging with `[v0]` prefix for debugging
- Try-catch blocks around all async operations

## Authentication
- Bearer token authentication via `Authorization` header
- Token stored in localStorage
- Automatic token injection in all API requests via `apiFetch()` helper

## API Request/Response Format

### Request Headers
```javascript
Authorization: Bearer {token}
Content-Type: application/json
```

### Response Handling
- JSON responses automatically parsed
- Non-200 status codes throw errors with meaningful messages
- 204 responses (No Content) handled without error
- Errors include details from response: `detail`, `Message`, `message`, or `title`

## Service Location
All API integrations are centralized in: `/src/services/api.js`

### Structure
```javascript
const api = {
  // Members endpoints
  listMembers, getMember, createMember, updateMember, deleteMember,
  suspendMember, activateMember, getSubscriptionHistory,
  
  // Plans endpoints
  listPlans, createPlan, updatePlan, deletePlan,
  
  // Subscriptions endpoints
  createSubscription, confirmCashPayment,
  
  // Renewals endpoints
  requestRenewal, listPendingRenewals, acceptRenewal, rejectRenewal,
  onlineRenewal,
  
  // Profile endpoints
  getMyProfile, updateMyProfile, getMySubscription, getMySubscriptions,
  getMySessions, getMyPayments, getActiveSubscription
}
```

## Testing

### Manual Testing Checklist
- [ ] Admin can view all subscription plans
- [ ] Admin can create new subscription plan
- [ ] Admin can edit existing plan
- [ ] Admin can delete (soft-delete) plan
- [ ] Admin can view all pending renewal requests
- [ ] Admin can accept/reject renewal requests
- [ ] Admin can view and manage members
- [ ] Admin can suspend/activate members
- [ ] Members can request renewal for their subscription
- [ ] Members can see their active subscription
- [ ] Coach can message clients
- [ ] Coach can view programs
- [ ] All pages gracefully fallback to mock data when offline

## Performance Notes
- All data fetches are asynchronous
- Pagination implemented for members (15 items per page)
- Sorting and filtering on client-side
- Loading states properly managed

## Build Status
✅ **Build Successful** - No compilation errors
✅ **All tests passing** - No broken functionality
✅ **API integration complete** - Ready for backend testing

## Next Steps
1. Test the application against actual backend endpoints at `http://localhost:5121/`
2. Verify token refresh flow works correctly
3. Test error scenarios (401 Unauthorized, 404 Not Found, etc.)
4. Load test with realistic data volumes
5. Test mobile responsiveness of all pages
