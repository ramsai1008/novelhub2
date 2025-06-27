# NovelHub Setup Instructions

## 1. Firebase Credentials

You must provide your own Firebase project credentials. Open `src/lib/firebase.ts` and replace the following placeholders with your own values from your Firebase Console:

```
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};
```

## 2. Admin Email

Set your admin email in a `.env` file at the root of your project:

```
NEXT_PUBLIC_ADMIN_EMAIL=your-admin@email.com
```

This will be used for admin login in the app. The code will fallback to `admin@example.com` if not set.

## 3. Running the Project

- Install dependencies:
  ```
  npm install
  ```
- Start the development server:
  ```
  npm run dev
  ```
- Build for production:
  ```
  npm run build
  ```

## 4. Additional Notes
- Never commit your real Firebase credentials or admin email to public repositories.
- For more details, see the comments in `src/lib/firebase.ts` and `src/app/login/page.tsx`.
