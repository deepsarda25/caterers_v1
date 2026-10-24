# Making admin changes visible to everyone

Your site is a set of static files, so it has nowhere to keep data that all visitors
share. This one-time setup creates a free online database (Google Firebase) that stores
the **menu** and the **event schedule** (including each event's venue and meal menus). Anyone can read them; only your admin
login can change them.

Takes about 10 minutes. You need a Google account. Cost: free for a site this size.

## 1. Create the project
1. Go to <https://console.firebase.google.com> and click **Create a project**.
2. Name it (for example `sheetal-caterers`). You can turn Google Analytics off.

## 2. Create the database
1. In the left menu: **Build → Firestore Database → Create database**.
2. Location: pick one close to your customers (for example `asia-south1 (Mumbai)`).
3. Choose **Start in production mode**, then **Create**.

## 3. Lock it so only you can edit
1. Open the **Rules** tab in Firestore.
2. Delete everything there and paste this. **Replace `YOUR-ADMIN-EMAIL` with the email
   you will use in step 4, all lowercase.**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/{docId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'YOUR-ADMIN-EMAIL'
                   && docId in ['menu', 'events'];
    }
  }
}
```
3. Click **Publish**.

## 4. Create the admin login
1. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable → Save.**
2. Open the **Users** tab → **Add user**. Enter the same email as in step 3 and a strong
   password. This is what you will type into the site's Admin sign-in.

## 5. Copy two values into the site
1. Click the gear icon → **Project settings → General**.
2. Copy **Project ID** and **Web API Key**.
   (If no Web API Key is shown, click the `</>` icon under "Your apps", register a web app,
   and copy `apiKey` from the code it shows.)
3. Open `site-config.js` in your repository and paste them between the quotes:

```js
window.SITE_CONFIG = {
  firebase: {
    apiKey: "paste-web-api-key-here",
    projectId: "paste-project-id-here"
  }
};
```
These two values are meant to be public. They cannot be used to edit your site, because
the rules in step 3 only allow your admin email.

## 6. Upload and test
1. Upload the updated files to your GitHub repository (`index.html`, `script.js`,
   `styles.css`, `site-config.js`).
2. Open your website, click **Admin** in the page footer, and sign in with the email and password from step 4.
3. Make a small change (for example add a dish, or add an event with a venue and a Hi-Tea meal).
4. Open the website in a **private/incognito window or on your phone**. You should see the
   change there without signing in. If you do, it is working.

## Good to know
- **First save:** the first change you make uploads the whole menu (from `menu-data.js`) online.
  From then on the online copy is the real menu, and editing `menu-data.js` in GitHub no longer
  changes what visitors see. Use **Restore original menu** in the admin bar to go back to the file version.
- **Backups:** **Download menu file** in the admin bar saves a copy of the current menu.
- **Sign-in is not remembered** after you close or refresh the page. This is deliberate.
- **Two people editing at once:** the last save wins, so agree on one editor at a time.
- **Change or reset the password** in Firebase console → Authentication → Users.
- **Nothing shows as saved?** If the admin bar says "NOT saved online", check your internet
  connection and that the email in the Rules matches the login email exactly.
