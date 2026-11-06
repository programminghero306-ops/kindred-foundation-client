const frontendUrl =
  process.env.FRONTEND_URL || "https://kindred-foundation-client.vercel.app";
const backendUrl =
  process.env.VITE_API_URL ||
  "https://kindread-foundation-server.onrender.com";

async function check(name, url, validate) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  validate(response.status, body);
  console.log(`PASS ${name}: ${response.status}`);
}

await check("backend health", `${backendUrl}/health`, (status, body) => {
  if (status !== 200 || body.status !== "ok" || body.database !== "connected") {
    throw new Error(`Invalid health response: ${JSON.stringify(body)}`);
  }
});

await check("public events", `${backendUrl}/events`, (status, body) => {
  if (status !== 200 || !Array.isArray(body)) {
    throw new Error(`Invalid events response: ${status}`);
  }
});

for (const route of ["", "/my-events", "/joined-events", "/joined"]) {
  await check(`frontend ${route || "/"}`, `${frontendUrl}${route}`, (status) => {
    if (status !== 200) throw new Error(`Frontend route returned ${status}`);
  });
}
