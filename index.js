const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html><html><head><title>DEEPAK RAJPUT BRAND - SCANNER</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
        body{background:#050505;color:#00ffcc;font-family:monospace;padding:15px;text-align:center}
        .box{max-width:700px;margin:auto;background:#111;padding:20px;border-radius:15px;border:1px solid #00ffcc;box-shadow:0 0 20px #00ffcc33}
        textarea{width:100%;height:150px;background:#000;color:#00ffcc;border:1px solid #333;padding:12px;border-radius:10px;margin:10px 0;outline:none;font-size:12px}
        button{width:100%;padding:15px;background:#00ffcc;color:#000;border:none;font-weight:bold;cursor:pointer;border-radius:10px;text-transform:uppercase;margin-bottom:10px}
        .table-container{margin-top:20px;overflow-x:auto}
        table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}
        th, td{border:1px solid #333;padding:10px;text-align:left}
        th{background:#00ffcc;color:#000}
        .live-tag{color:#00ff00;font-weight:bold}
        .dead-tag{color:#ff3333;font-weight:bold}
    </style></head><body>
    <div class="box">
        <h2>DEEPAK RAJPUT BRAND</h2>
        <p style="font-size:11px;color:#888">MULTI-TOKEN SCANNER (NAME & UID EDITION)</p>
        <textarea id="tokenInput" placeholder="Paste Tokens (One per line)"></textarea>
        <button onclick="checkTokens()">Start Scanning</button>
        <div id="resultArea" style="display:none">
            <div style="margin:10px 0; font-weight:bold">
                Live: <span id="liveCount" style="color:#00ff00">0</span> | 
                Dead: <span id="deadCount" style="color:#ff3333">0</span>
            </div>
            <div class="table-container">
                <table id="tokenTable">
                    <thead><tr><th>#</th><th>ID Name</th><th>User ID (UID)</th><th>Status</th></tr></thead>
                    <tbody id="tableBody"></tbody>
                </table>
            </div>
            <h4 style="margin-top:20px">ONLY LIVE TOKENS:</h4>
            <textarea id="liveList" style="height:100px" readonly></textarea>
        </div>
    </div>
    <script>
        async function checkTokens() {
            const input = document.getElementById('tokenInput').value.trim();
            if(!input) return alert("Tokens daalo bhai!");
            const tokens = input.split('\\n').filter(t => t.trim() !== "");
            document.getElementById('resultArea').style.display = "block";
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = "";
            let liveCount = 0; let deadCount = 0; let liveArr = [];
            for(let i=0; i < tokens.length; i++) {
                let token = tokens[i].trim();
                try {
                    const response = await fetch(\`https://graph.facebook.com/me?access_token=\${token}\`);
                    const data = await response.json();
                    let row = tableBody.insertRow();
                    row.insertCell(0).innerText = i + 1;
                    if(data.id) {
                        liveCount++;
                        liveArr.push(token);
                        row.insertCell(1).innerText = data.name;
                        row.insertCell(2).innerText = data.id;
                        row.insertCell(3).innerHTML = '<span class="live-tag">LIVE</span>';
                        document.getElementById('liveCount').innerText = liveCount;
                    } else { throw new Error(); }
                } catch(e) {
                    deadCount++;
                    let row = tableBody.insertRow();
                    row.insertCell(0).innerText = i + 1;
                    row.insertCell(1).innerText = "---";
                    row.insertCell(2).innerText = "---";
                    row.insertCell(3).innerHTML = '<span class="dead-tag">DEAD</span>';
                    document.getElementById('deadCount').innerText = deadCount;
                }
                document.getElementById('liveList').value = liveArr.join('\\n');
            }
            alert("Scanning Completed! ✅");
        }
    </script></body></html>
    `);
});

app.listen(PORT, () => console.log('Deepak Rajput Brand Scanner Active'));
