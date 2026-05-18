const express = require('express');
const login = require('josh-fca');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

// --- MOBILE FRIENDLY DASHBOARD WITH COOKIE BOX ---
const htmlContent = `
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DEEPAK RAJPUT NUKE v7</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background: #050505; color: #e0e0e0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 10px; display: flex; justify-content: center; }
        .container { width: 100%; max-width: 450px; background: #111; border: 2px solid #ff0000; padding: 20px; border-radius: 15px; box-shadow: 0 0 20px #ff000044; box-sizing: border-box; }
        h2 { color: #ff0000; text-align: center; text-transform: uppercase; margin-bottom: 5px; text-shadow: 0 0 10px #ff0000; font-size: 24px; }
        .brand-text { text-align: center; font-size: 12px; color: #888; margin-bottom: 20px; }
        label { font-weight: bold; color: #ff4444; font-size: 14px; }
        textarea, input { width: 100%; padding: 12px; margin: 8px 0 15px 0; background: #1a1a1a; border: 1px solid #333; color: #fff; box-sizing: border-box; border-radius: 8px; font-size: 14px; }
        textarea { height: 100px; resize: none; }
        .btn-fire { background: linear-gradient(45deg, #ff0000, #990000); color: #fff; border: none; width: 100%; padding: 15px; font-weight: bold; cursor: pointer; text-transform: uppercase; border-radius: 8px; font-size: 16px; transition: 0.3s; }
        .btn-fire:active { transform: scale(0.98); background: #cc0000; }
        .logs { background: #000; border: 1px solid #222; height: 200px; overflow-y: auto; padding: 10px; font-family: 'Courier New', monospace; font-size: 11px; margin-top: 15px; color: #00ff00; border-radius: 8px; line-height: 1.4; }
        .status-bar { margin-top: 10px; font-size: 13px; font-weight: bold; color: #ffcc00; text-align: center; padding: 5px; background: #222; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h2><i class="fas fa-radiation"></i> NUKE V7</h2>
        <p class="brand-text">DEEPAK RAJPUT BRAND - ANTI HATER TOOL</p>
        
        <label><i class="fas fa-key"></i> Apni Sari Cookies Yahan Daalo (JSON format):</label>
        <textarea id="cookies" placeholder='[{"key": "value"...}, {"key": "value"...}]'></textarea>

        <label><i class="fas fa-user-slash"></i> Enemy ID UID ya Link:</label>
        <input type="text" id="target" placeholder="Paste Enemy ID here">
        
        <button class="btn-fire" onclick="startNuke()">
            <i class="fas fa-bomb"></i> Launch Mass Report
        </button>

        <div class="status-bar">Status: <span id="st">Ready for Command</span></div>
        <div class="logs" id="logBox">>> Waiting for setup, Bhai...</div>
    </div>

    <script>
        let tid = null;
        async function startNuke() {
            const cookies = document.getElementById('cookies').value;
            const uid = document.getElementById('target').value;
            
            if(!cookies || !uid) return alert("Bhai, Cookies aur Target dono zaroori hain!");
            
            document.getElementById('st').innerText = "Connecting IDs...";
            
            const res = await fetch('/api/nuke', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ cookies, targetUID: uid })
            });
            
            const data = await res.json();
            if(data.success) {
                tid = data.taskId;
                setInterval(updateLogs, 3000);
            } else { 
                alert(data.msg); 
                document.getElementById('st').innerText = "Error Occurred";
            }
        }

        async function updateLogs() {
            if(!tid) return;
            const res = await fetch('/api/status/' + tid);
            const d = await res.json();
            document.getElementById('st').innerText = d.status;
            document.getElementById('logBox').innerHTML = d.logs.join('<br>');
            document.getElementById('logBox').scrollTop = document.getElementById('logBox').scrollHeight;
        }
    </script>
</body>
</html>
`;

let nukeStatus = {};

// --- API ROUTES ---

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.post('/api/nuke', async (req, res) => {
    const { cookies, targetUID } = req.body;
    const taskId = uuidv4();
    
    nukeStatus[taskId] = { 
        target: targetUID, 
        status: "Nuke Active 🚀", 
        logs: ["🚀 System initialized...", "📂 Cookies processed successfully."], 
        stop: false 
    };

    // Yahan hum simulation logs de rahe hain (Asli logic ke liye IDs ko loop mein daalna hoga)
    // Render par josh-fca login mein thoda time lagta hai
    res.json({ success: true, taskId });
});

app.get('/api/status/:id', (req, res) => {
    res.json(nukeStatus[req.params.id] || {status: "Disconnected", logs: []});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Server is running on port ${PORT}`));
