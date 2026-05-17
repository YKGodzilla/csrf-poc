# CSRF Demo Bank

A minimal Node.js banking demo site that shows a CSRF-vulnerable profile email update form.

## What is included

- Home page
- Accounts page
- Transfer page
- Profile page with a vulnerable email update form
- CSRF attack demo page that submits the profile update request automatically

## Run locally

1. Open a terminal in `c:\Users\Yash\Documents\csrf poc`
2. Run `npm install`
3. Run `npm start`
4. Visit `http://localhost:3000`

## How to demonstrate the vulnerability

1. Open `http://localhost:3000/profile`
2. Open `http://localhost:3000/csrf-attack.html`
3. The malicious page will send a POST request to `http://localhost:3000/profile/email`
4. The user email on the profile page will change without any CSRF protection

## Notes

- The app intentionally does not use CSRF tokens or origin validation.
- The attack page demonstrates how a third-party page can submit a form to the vulnerable endpoint.
