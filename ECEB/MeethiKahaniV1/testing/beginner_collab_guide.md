# Beginner's Guide to Team Collaboration (Colab Work)

If you are new to collaborative coding with a team of 4, don't worry! Here is the absolute simplest guide to how team coding works.

---

## 🎯 Option A: The GitHub Method (Recommended Industry Standard)

GitHub is like Google Drive for code. It allows multiple people to edit different parts of the same project simultaneously.

### Step-by-Step GitHub Workflow for 4 Teammates:

1. **Host GitHub Repo:**
   - Create 1 main repository on GitHub (e.g., `meethi-kahani-v1`).
   - Add your 3 teammates as **Collaborators** in GitHub repository settings.

2. **Branching Strategy (Apni Apni Branch):**
   - Each developer works on their own branch so they never overwrite each other:
     - Teammate 1: `git checkout -b dev1-header`
     - Teammate 2: `git checkout -b dev2-catalog`
     - Teammate 3: `git checkout -b dev3-cart`
     - Teammate 4: `git checkout -b dev4-admin`

3. **Push & Pull Request (PR):**
   - When a teammate finishes their module, they push to GitHub:
     `git push origin dev1-header`
   - On GitHub, they click **"Create Pull Request"**.
   - You click **"Merge"** to combine their code into the `main` project.

---

## 📦 Option B: The Folder-Sharing Method (If Git feels too complicated)

If your team is not using GitHub yet:

1. Send each developer a clean copy of the project zip file.
2. Tell Developer 1 to ONLY write code in `src/modules/HeaderNav/`.
3. Tell Developer 2 to ONLY write code in `src/modules/ProductCatalog/`.
4. Tell Developer 3 to ONLY write code in `src/modules/CartPayment/`.
5. Tell Developer 4 to ONLY write code in `src/modules/AdminPortal/`.
6. When they finish, they just send you their module folder (e.g. `ProductCatalog`).
7. You paste their folder into `src/modules/` in your project and import it in `App.jsx`!

---

## 🛡️ Why This Modular Approach Never Fails

- **Zero Overwriting:** Since Dev 1 never touches Dev 2's folder, code collisions are impossible.
- **Easy Testing:** You can test Dev 2's `ProductCatalog` component individually inside the `testing/` folder without running the whole website.
