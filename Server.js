const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'members.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getMembers() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

function saveMembers(members) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2));
}

app.get('/api/members', (req, res) => {
    res.json(getMembers());
});

app.post('/api/members', (req, res) => {
    const members = getMembers();
    const newMember = {
        id: Date.now().toString(),
        name: req.body.name,
        phone: req.body.phone,
        joinDate: req.body.joinDate,
        validTill: req.body.validTill,
        feeAmount: req.body.feeAmount
    };
    members.push(newMember);
    saveMembers(members);
    res.status(201).json(newMember);
});

app.put('/api/members/:id', (req, res) => {
    let members = getMembers();
    const id = req.params.id;
    const index = members.findIndex(m => m.id === id);

    if (index !== -1) {
        members[index] = { ...members[index], ...req.body };
        saveMembers(members);
        res.json(members[index]);
    } else {
        res.status(404).json({ message: "Member not found" });
    }
});

app.delete('/api/members/:id', (req, res) => {
    let members = getMembers();
    members = members.filter(m => m.id !== req.params.id);
    saveMembers(members);
    res.json({ message: "Member deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
