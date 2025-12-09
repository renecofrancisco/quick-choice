let eventSource = null;
let currentApp = null;
let currentApps = [];

async function loadApps() {
  const res = await fetch("/apps");
  const list = await res.json();
  currentApps = list;

  const container = document.getElementById("apps");
  container.innerHTML = "";

  list.forEach(app => {
    const box = document.createElement("div");
    box.className = "app-box";

    // VIEW LOGS button only if app is running
    let logsButton = "";
    if (app.running) {
      logsButton = `<button onclick="openLogs('${app.name}', this)">VIEW LOGS</button>`;
    }

    box.innerHTML = `
      <strong>${app.name}</strong><br>
      Status: ${app.running ? "🟢 Running" : "🔴 Stopped"}<br><br>
      <button onclick="${app.running ? `stopApp('${app.name}')` : `startApp('${app.name}')`}">
        ${app.running ? "STOP" : "START"}
      </button>
      ${logsButton}
    `;

    container.appendChild(box);
  });
}

async function startApp(name) {
  await fetch(`/start/${name}`, { method: "POST" });
  setTimeout(loadApps, 500); // reload to update status
}

async function stopApp(name) {
  await fetch(`/stop/${name}`, { method: "POST" });
  setTimeout(loadApps, 500); // reload to update status
}

function openLogs(app, button) {
  if (currentApp === app) return; // already showing
  currentApp = app;

  const output = document.getElementById("logOutput");
  const title = document.getElementById("logTitle");
  output.textContent = "";
  title.textContent = `Logs: ${app}`;

  // Close previous SSE connection
  if (eventSource) eventSource.close();

  eventSource = new EventSource(`/logs/${app}`);

  eventSource.onmessage = (event) => {
    output.textContent += event.data + "\n";
    output.scrollTop = output.scrollHeight;
  };

  eventSource.onerror = () => {
    console.log("Log stream closed");
  };

  // Highlight active tab
  document.querySelectorAll("#apps button").forEach(btn => btn.classList.remove("active-tab"));
  button.classList.add("active-tab");
}

// Initial load + auto-refresh
loadApps();
setInterval(loadApps, 2000);
