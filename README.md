# Marginalia

Marginalia is a clean, typography-focused publication platform inspired by the printed pages of literary journals and the handwritten annotations of well-read books. Built with a modern, text-forward design system, it rejects standard card grids and corporate styles, prioritizing whitespace, high-fidelity typesetting, and quiet reading.

---

## Technical Stack
- **Frontend**: React (with Vite for build tooling)
- **Styling**: Tailwind CSS
- **Markdown Render**: Marked
- **Backend**: Node.js & Express API
- **Database**: MongoDB (configured via Mongoose)
- **Auth**: JWT-based credentials storage and protected router middleware

---

## Design System Tokens
- **Background**: Midnight Charcoal (`#161719`) — soft, deep dark mode reducing eye fatigue during reading.
- **Main Text**: Soft Ivory (`#EBE7E0`) — natural warm off-white for comfortable typography reading.
- **Accents**: Warm Copper Gold (`#C49E7A`) for primary action items and hover highlights; Sage Green (`#5A6F62`) for quotes, tags, and category items.
- **Typography**: Newsreader / Source Serif 4 (for primary reading columns and titles), paired with Inter (for UI metadata, dashboard summaries, and interactive controls).
- **Reading Width**: Optimized column width (`~68 characters` / `max-w-reading`) to emulate a page layout.

---

## Running Locally

To set up and start the application on your computer, follow these terminal steps:

### Phase 1: Prerequisites
1. Ensure you have **Node.js** (v16+ recommended) installed on your system.
2. Ensure you have **MongoDB** installed and running locally (`mongodb://localhost:27017`), or possess a MongoDB Atlas connection string.

---

### Phase 2: Backend Configuration & Start
1. Open a new terminal window and navigate to the project directory:
   ```bash
   cd c:/work/Marginalia/backend
   ```
2. Install Node package dependencies:
   ```bash
   npm install
   ```
3. Establish your environment variables file. (Note: A pre-configured `.env` has already been generated for you in the `backend/` directory for local development, containing your specific MongoDB Atlas credentials commented out for convenience).
   If you ever need to recreate it:
   ```bash
   # Windows PowerShell
   copy .env.example .env

   # macOS / Linux / Bash
   cp .env.example .env
   ```
4. Open the `.env` file in a text editor to update or verify the `MONGO_URI` variable:
   * **For Local MongoDB (Default)**:
     * Set it to point to your local MongoDB server:
       ```env
       MONGO_URI=mongodb://127.0.0.1:27017/marginalia
       ```
   * **For MongoDB Atlas (Deployment)**:
     * Your personal Atlas connection string has been pre-configured and commented out in the `.env` file. To activate it, uncomment the Atlas line:
       ```env
       MONGO_URI=mongodb+srv://marginalia:marginalia123@cluster0.oair7q6.mongodb.net/marginalia?retryWrites=true&w=majority&appName=Cluster0
       ```
5. Run the dev script (starts server on port `5000` via `nodemon`):
   ```bash
   npm run dev
   ```

---

### Phase 3: Frontend Configuration & Start
1. Open a second, separate terminal window and navigate to the frontend directory:
   ```bash
   cd c:/work/Marginalia/frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the development server (runs Vite server on port `5173`, with proxy routes directing `/api` queries to port `5000` automatically):
   ```bash
   npm run dev
   ```
4. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Features Walkthrough
- **Reading Feed (`/`)**: Shows the most recent published work enlarged at the top as the featured item with an asymmetric layout, followed by older published items in a minimal, quiet list.
- **Reader Page (`/posts/:id`)**: Renders full articles compiled from Markdown, styled with custom drop quotes, thin left border lines, and book-style elements.
- **Author Dashboard (`/dashboard`)**: Author's control center, showing stats for Published vs. Drafts, and options to edit, view, or archive.
- **Manuscript Editor (`/editor`)**: Distraction-free markdown workspace with dual panel display (Canvas on the left, live HTML preview on the right), markdown toolbar, and status selectors (Draft vs. Publish).
- **Authentication (`/login`, `/register`)**: Encrypted access utilizing JSON Web Tokens stored locally in browser session context.
