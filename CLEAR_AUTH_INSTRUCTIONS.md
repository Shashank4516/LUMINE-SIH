# Clear Authentication Data

If you're seeing the Slot Booking page instead of the Landing page, you have stale authentication data in your browser.

## Quick Fix - Option 1: Clear in Browser Console

1. Open your browser at `http://localhost:5174/`
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Paste and run this command:

```javascript
localStorage.clear(); sessionStorage.clear(); location.reload();
```

## Quick Fix - Option 2: Clear in Application Tab

1. Open your browser at `http://localhost:5174/`
2. Press `F12` to open Developer Tools
3. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click on **Local Storage** → `http://localhost:5174`
5. Right-click and select **Clear**
6. Click on **Session Storage** → `http://localhost:5174`
7. Right-click and select **Clear**
8. Refresh the page (F5)

## What This Does

This clears the stored authentication tokens and user data, so you'll see the Landing page (sign-in page) as the first page.

## Expected Behavior After Clearing

- **Landing Page** shows at `/` with the temple image and login form
- After successful login, you'll be redirected to the appropriate dashboard
- If you're already logged in (with valid credentials), you'll be auto-redirected to your dashboard

