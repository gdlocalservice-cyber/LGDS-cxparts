const { getStore } = require("@netlify/blobs");

const DEFAULT_PASSWORDS = {
  admin: "GgspnV8y4n!",
  tech: "0606"
};

async function getSettingsStore() {
  return getStore("lgds-calculator-settings");
}

exports.handler = async function(event) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const store = await getSettingsStore();

    if (event.httpMethod === "GET") {
      const saved = await store.get("settings", { type: "json" });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(saved || { data: null, passwords: null, updatedAt: null })
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const saved = await store.get("settings", { type: "json" });
      const currentAdminPassword =
        saved?.passwords?.admin ||
        body?.currentPasswords?.admin ||
        DEFAULT_PASSWORDS.admin;

      if (!body.adminPassword || body.adminPassword !== currentAdminPassword) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ ok: false, error: "Wrong admin password" })
        };
      }

      const next = {
        data: body.data,
        passwords: body.passwords,
        updatedAt: new Date().toISOString()
      };

      await store.setJSON("settings", next);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, updatedAt: next.updatedAt })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: "Method not allowed" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: error.message || "Server error" })
    };
  }
};
