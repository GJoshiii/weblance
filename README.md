# Weblance

    npm install
    npm run dev      # local
    npm run build    # production build in /dist

Form: open `src/components/ContactForm.jsx` and paste your Apps Script Web App URL into `SHEETS_WEB_APP_URL`.
Apps Script `doPost(e)` should parse `JSON.parse(e.postData.contents)` and append a row (name, brand, need, message, submittedAt).

3D lives in `src/scenes/WorldScene.jsx` (Character, W, Ecosystem, Particles), all procedural, driven by scroll progress in `src/utils/store.js`.
