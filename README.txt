LGDS Price Calculator - V7 Global Admin via Netlify

This version adds Netlify Functions + Netlify Blobs so Admin changes can sync globally across devices after deployment on Netlify.

Upload/commit all files including:
- index.html
- styles.css
- app.js
- assets/
- package.json
- netlify.toml
- netlify/functions/settings.js

Default passwords:
Admin: GgspnV8y4n!
Technician: 0606

Important:
- Global sync works only after deploying on Netlify, because it uses /.netlify/functions/settings
- If opened locally from a file, it will use local/default data only.
- This is practical internal security, not enterprise-grade authentication.
