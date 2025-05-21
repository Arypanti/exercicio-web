const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'data', 'db.json');

function getData() {
    const raw = fs.readFileSync(dbPath);
    return JSON.parse(raw);
}

function saveData(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

app.get('/exercises', (req, res) => {
    const data = getData();
    const today = new Date().toISOString().split('T')[0];

    if (!data[today]) {
        data[today] = {
            exercises: [
                { name: 'Push Up', video: 'https://www.youtube.com/embed/_l3ySVKYVJ8', done: false },
                { name: 'Plank', video: 'https://www.youtube.com/embed/pSHjTRCQxIw', done: false },
                { name: 'Squat', video: 'https://www.youtube.com/embed/aclHkVaku9U', done: false },
                { name: 'Lunge', video: 'https://www.youtube.com/embed/QOVaHwm-Q6U', done: false },
                { name: 'Jumping Jacks', video: 'https://www.youtube.com/embed/UpH7rm0cYbM', done: false }
            ]
        };
        saveData(data);
    }

    res.json(data[today]);
});

app.post('/exercises/:index/done', (req, res) => {
    const data = getData();
    const today = new Date().toISOString().split('T')[0];
    const index = parseInt(req.params.index);

    if (data[today] && data[today].exercises[index]) {
        data[today].exercises[index].done = true;
        saveData(data);
        return res.json({ success: true });
    }

    res.status(400).json({ error: 'Exercício inválido' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

