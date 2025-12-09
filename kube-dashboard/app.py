from flask import Flask, jsonify, Response, send_from_directory, stream_with_context
import subprocess
import json, os, signal

app = Flask(__name__)
with open("apps.json") as f:
    apps = json.load(f)

processes = {}

@app.route("/")
def home():
    return "K8s Simple Dashboard Running!"

@app.route("/dashboard")
def dashboard():
    return send_from_directory("static", "index.html")

@app.route("/apps")
def get_apps():
    response = []
    for a in apps:
        response.append({
            "name": a["name"],
            "deployment": a["deployment"],
            "running": a["name"] in processes
        })
    return jsonify(response)

@app.route("/start/<app_name>", methods=["POST"])
def start_app(app_name):
    app_data = next((a for a in apps if a["name"] == app_name), None)
    if not app_data:
        return jsonify({"error": "not found"}), 404

    if app_name in processes:
        return jsonify({"status": "already running"})

    cmd = [
        "kubectl", "port-forward",
        f"deployment/{app_data['deployment']}",
        f"{app_data['localPort']}:{app_data['containerPort']}"
    ]

    proc = subprocess.Popen(cmd)
    processes[app_name] = proc
    return jsonify({"status": "started"})

@app.route("/stop/<app_name>", methods=["POST"])
def stop_app(app_name):
    if app_name in processes:
        proc = processes[app_name]
        os.kill(proc.pid, signal.SIGTERM)
        del processes[app_name]
        return jsonify({"status": "stopped"})
    return jsonify({"status": "not running"})

@app.route("/logs/<app>")
def stream_logs(app):
    def generate():
        # Running kubectl logs -f <deployment>
        process = subprocess.Popen(
            ["kubectl", "logs", "-f", f"deployment/{app}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Stream stdout
        for line in process.stdout:
            yield f"data: {line}\n\n"

    return Response(stream_with_context(generate()), mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
