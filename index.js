const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

// UI Dashboard - Mobile Fit & Persistent
const ui = `
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>DEEPAK RAJPUT V7 PRO</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; margin: 0; padding: 10px; }
        .app { width: 100%; max-width: 450px; margin: auto; border: 2px solid #ff0000; border-radius: 15px; padding: 15px; background: #111; box-sizing: border-box; }
        h2 { color: #ff0000; text-align: center; margin: 5px 0; text-shadow: 0 0 10px #f00; }
        textarea, input { width: 100%; background: #000; border: 1px solid #333; color: #0f0; padding: 12px; margin: 10px 0; border-radius: 8px; box-sizing: border-box; }
        .btn-box { display: flex; gap: 10px; margin-top: 10px; }
        .btn { flex: 1; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; text-transform: uppercase; }
        .btn-start { background: #ff0000; color: #fff; }
        .btn-stop { background: #444; color: #fff; }
        .logs { background: #000; border: 1px solid #222; height: 250px; overflow-y: auto; padding: 10px; font-size: 11px; color: #0f0; margin-top: 15px; border-radius: 8px; font-family: monospace; }
        .status { text-align: center; color: #ff0; font-size: 13px; margin: 10px 0; padding: 5px; background: #222; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="app">
        <h2><i class="fas fa-radiation"></i> NUKE V7 PRO</h2>
        <input type="text" id="target" placeholder="Enemy UID ya Link">
        <textarea id="cookies" placeholder="Paste String Cookies Here..."></textarea>
        
        <div class="btn-box">
            <button class="btn btn-start" onclick="start()"><i class="fas fa-play"></i> Launch</button>
            <button class="btn btn-stop" onclick="stop()"><i class="fas fa-stop"></i> Stop</button>
        </div>

        <div class="status">System: <span id="st">Ready</span></div>
        <div class="logs" id="logBox">>> Waiting for command...</div>
    </div>

    <script>
        let interval = null;
        
        // Auto-fetch logs on page load (In case of refresh)
        window.onload = () => { startTracking(); };

        async function start() {
            const uid = document.getElementById('target').value;
            const cookieStr = document.getElementById('cookies').value;
            if(!uid || !cookieStr) return alert("Bhai, sab bharo!");

            const res = await fetch('/api/nuke', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ uid, cookieStr })
            });
            startTracking();
        }

        async function stop() {
            await fetch('/api/stop', { method: 'POST' });
            document.getElementById('st').innerText = "Stopped";
        }

        function startTracking() {
            if(interval) clearInterval(interval);
            interval = setInterval(async () => {
                const res = await fetch('/api/status');
                const d = await res.json();
                if(d.logs.length > 0) {
                    document.getElementById('st').innerText = d.status;
                    document.getElementById('logBox').innerHTML = d.logs.join('<br>');
                    document.getElementById('logBox').scrollTop = document.getElementById('logBox').scrollHeight;
                }
            }, 2000);
        }
    </script>
</body>
</html>
`;

// --- BACKEND LOGIC WITH PERSISTENCE ---
let globalLogs = [">> System Online (Deepak Rajput Brand)"];
let currentStatus = "Idle";
let isRunning = false;

app.get('/', (req, res) => res.send(ui));

app.post('/api/nuke', (req, res) => {
    isRunning = true;
    currentStatus = "Attacking 🚀";
    globalLogs.push(`>> Target Locked: ${req.body.uid}`);
    globalLogs.push(">> Multi-Vector attack initiated...");
    res.json({ success: true });
});

app.post('/api/stop', (req, res) => {
    isRunning = false;
    currentStatus = "Stopped 🛑";
    globalLogs.push(">> [ALERT] User stopped the attack.");
    res.json({ success: true });
});

app.get('/api/status', (req, res) => {
    res.json({ status: currentStatus, logs: globalLogs });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Deepak Rajput Server Running'));
