const express = require('express');
const login = require('josh-fca');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

// --- MOBILE OPTIMIZED UI ---
const htmlContent = `
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>DEEPAK RAJPUT BRAND</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { background: #000; color: #fff; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 15px; overflow-x: hidden; }
        .app-container { width: 100%; max-width: 450px; margin: auto; border: 2px solid #ff0000; border-radius: 20px; padding: 20px; background: linear-gradient(145deg, #0f0f0f, #1a1a1a); box-shadow: 0 0 30px rgba(255, 0, 0, 0.3); }
        h2 { color: #ff0000; text-align: center; text-transform: uppercase; margin: 10px 0; font-size: 26px; text-shadow: 0 0 10px #ff0000; }
        .sub-text { text-align: center; color: #666; font-size: 11px; letter-spacing: 1px; margin-bottom: 20px; }
        .input-group { margin-bottom: 15px; }
        label { display: block; color: #ff4d4d; font-size: 12px; margin-bottom: 5px; font-weight: bold; text-transform: uppercase; }
        textarea, input { width: 100%; background: #0a0a0a; border: 1px solid #333; color: #00ff00; padding: 12px; border-radius: 10px; font-family: monospace; font-size: 14px; outline: none; }
        textarea:focus, input:focus { border-color: #ff0000; box-shadow: 0 0 10px rgba(255, 0, 0, 0.2); }
        textarea { height: 120px; }
        .btn-nuke { background: #ff0000; color: #fff; border: none; width: 100%; padding: 16px; border-radius: 10px; font-weight: 800; font-size: 18px; cursor: pointer; text-transform: uppercase; margin-top: 10px; transition: 0.2s; box-shadow: 0 5px 0 #800000; }
        .btn-nuke:active { transform: translateY(3px); box-shadow: 0 2px 0 #800000; }
        #status-bar { margin-top: 15px; text-align: center; font-size: 13px; color: #ffcc00; padding: 8px; border-radius: 5px; background: rgba(255, 204, 0, 0.1); }
        .logs { background: #050505; border: 1px solid #222; height: 180px; overflow-y: auto; padding: 10px; font-size: 11px; color: #00ff00; margin-top: 15px; border-radius: 8px; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="app-container">
        <h2><i class="fas fa-biohazard"></i> NUKE V7</h2>
        <div class="sub-text">DEEPAK RAJPUT SERVER DOMINANCE</div>
        
        <div class="input-group">
            <label><i class="fas fa-cookie-bite"></i> Normal String Cookies:</label>
            <textarea id="cookies" placeholder="Paste your normal cookies here (sb=...; datr=...;)"></textarea>
        </div>

        <div class="input-group">
            <label><i class="fas fa-bullseye"></i> Enemy UID:</label>
            <input type="text" id="target" placeholder="Enter Target ID">
        </div>

        <button class="btn-nuke" onclick="fireAttack()"><i class="fas fa-fire"></i> Start Mass Report</button>
        
        <div id="status-bar">System: Idle</div>
        <div class="logs" id="logs">>> Engine Ready, Deepak Bhai...</div>
    </div>

    <script>
        let tid = null;
        async function fireAttack() {
            const cookieStr = document.getElementById('cookies').value;
            const uid = document.getElementById('target').value;
            if(!cookieStr || !uid) return alert("Bhai, dono cheezein bharo!");

            document.getElementById('status-bar').innerText = "System: Launching...";
            
            const res = await fetch('/api/nuke', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ cookieStr, targetUID: uid })
            });
            
            const data = await res.json();
            if(data.success) {
                tid = data.taskId;
                setInterval(updateLogs, 2500);
            }
        }

        async function updateLogs() {
            if(!tid) return;
            const res = await fetch('/api/status/' + tid);
            const d = await res.json();
            document.getElementById('status-bar').innerText = "System: " + d.status;
            document.getElementById('logs').innerHTML = d.logs.join('<br>');
            document.getElementById('logs').scrollTop = document.getElementById('logs').scrollHeight;
        }
    </script>
</body>
</html>
`;

let nukeStatus = {};

// --- COOKIE PARSER LOGIC ---
function parseCookie(str) {
    return str.split(';').map(v => v.split('=')).reduce((acc, v) => {
        if(v[0]) acc.push({ key: v[0].trim(), value: v[1] ? v[1].trim() : '', domain: 'facebook.com', path: '/' });
        return acc;
    }, []);
}

// --- ROUTES ---
app.get('/', (req, res) => res.send(htmlContent));

app.post('/api/nuke', (req, res) => {
    const { cookieStr, targetUID } = req.body;
    const appState = parseCookie(cookieStr); // Auto convert string to JSON
    const taskId = uuidv4();
    
    nukeStatus[taskId] = { 
        status: "Nuke Active 🚀", 
        logs: [
            ">> String cookies parsed successfully.",
            `>> Target locked: ${targetUID}`,
            ">> Launching Multi-Vector Attack (Weapons + Hate Speech)..."
        ]
    };
    
    // Yahan fca login aur report logic aayega
    res.json({ success: true, taskId });
});

app.get('/api/status/:id', (req, res) => res.json(nukeStatus[req.params.id] || {status: "Idle", logs: []}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Deepak Rajput Brand Server Live'));
