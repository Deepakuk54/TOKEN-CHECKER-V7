const express = require('express');
const login = require('josh-fca');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let activeSessions = {}; 
let nukeStatus = {};

// --- THE NUKE CORE ---
async function runNuke(targetUID, taskId) {
    const apis = Object.values(activeSessions);
    // Khatarnak Categories for Instant Ban
    const highRiskCategories = [
        "SALE_OF_ARM_WEAPONS", // Selling Weapons (Tier 1)
        "HATE_SPEECH",          // Hate Speech
        "PRETENDING_TO_BE_A_CELEBRITY", 
        "HARASSMENT", 
        "VIOLENCE",
        "SPAM"
    ];

    nukeStatus[taskId].status = "Active 🚀";

    for (let i = 0; i < apis.length; i++) {
        if (!nukeStatus[taskId] || nukeStatus[taskId].stop) break;

        const api = apis[i];
        const reason = highRiskCategories[i % highRiskCategories.length];

        try {
            // Human-like delay to protect your OLD IDs (45s - 90s)
            const delay = Math.floor(Math.random() * (90000 - 45000) + 45000);
            nukeStatus[taskId].logs.push(`[System] ID ${i+1} cooling down... (${Math.round(delay/1000)}s)`);
            await new Promise(res => setTimeout(res, delay));

            // Execute the API hit
            await api.reportUser(targetUID, reason);
            
            const successMsg = `✅ Report #${i+1} Sent! Category: ${reason} (Using: ${api.getCurrentUserID()})`;
            nukeStatus[taskId].logs.push(successMsg);
            console.log(successMsg);

        } catch (err) {
            nukeStatus[taskId].logs.push(`❌ ID ${i+1} Skipped: Session Protected or Rate Limited`);
        }
    }
    nukeStatus[taskId].status = "Mission Completed 🏁";
}

// --- ROUTES ---
app.post('/api/nuke', (req, res) => {
    const { targetUID } = req.body;
    if(Object.keys(activeSessions).length === 0) return res.json({success:false, msg:"Pehle IDs Login Kar Bhai!"});
    
    const taskId = uuidv4();
    nukeStatus[taskId] = { target: targetUID, status: "Initializing", logs: [], stop: false };
    
    runNuke(targetUID, taskId);
    res.json({ success: true, taskId });
});

app.get('/api/status/:id', (req, res) => {
    res.json(nukeStatus[req.params.id] || {status: "Not Found"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Deepak Rajput Brand Server Live on ${PORT}`));
