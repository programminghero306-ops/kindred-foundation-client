const frontendUrl =
  (process.env.FRONTEND_URL ||
    "https://kindred-foundation-client.vercel.app").replace(/\/$/, "");
const backendUrl =
  (process.env.VITE_API_URL ||
    "https://kindread-foundation-server.onrender.com").replace(/\/$/, "");
const timeoutMs = Number(process.env.LIVE_CHECK_TIMEOUT_MS) || 90000;
const maxAttempts = Number(process.env.LIVE_CHECK_ATTEMPTS) || 3;

async function check(name, url, validate) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(timeoutMs),
      });
      const contentType = response.headers.get("content-type") || "";
      const body = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      validate(response.status, body);
      console.log(`PASS ${name}: ${response.status} (${url})`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        console.log(
          `RETRY ${name}: attempt ${attempt}/${maxAttempts} (${error.message})`
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  throw new Error(`${name} failed after ${maxAttempts} attempts: ${lastError?.message} (${url})`);
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
