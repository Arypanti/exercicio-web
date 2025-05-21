async function loadExercises() {
    const res = await fetch('http://localhost:3000/exercises');
    const data = await res.json();

    const container = document.getElementById('exercises');
    container.innerHTML = '';

    data.exercises.forEach((ex, index) => {
        const div = document.createElement('div');
        div.className = 'exercise';

        div.innerHTML = `
            <h2>${ex.name}</h2>
            <iframe src="${ex.video}" allowfullscreen></iframe>
            <div>
                <span id="timer-${index}">03:00</span>
                <button onclick="startTimer(${index})" id="btn-${index}">Iniciar</button>
            </div>
            <div class="checkbox">
                <input type="checkbox" id="check-${index}" ${ex.done ? 'checked disabled' : ''} onchange="markDone(${index})">
                <label for="check-${index}">Feito</label>
            </div>
        `;

        container.appendChild(div);
    });
}

function startTimer(index) {
    const timer = document.getElementById(`timer-${index}`);
    const button = document.getElementById(`btn-${index}`);
    let time = 180;
    button.disabled = true;

    const interval = setInterval(() => {
        const min = String(Math.floor(time / 60)).padStart(2, '0');
        const sec = String(time % 60).padStart(2, '0');
        timer.textContent = `${min}:${sec}`;
        time--;

        if (time < 0) {
            clearInterval(interval);
            button.disabled = false;
        }
    }, 1000);
}

async function markDone(index) {
    await fetch(`http://localhost:3000/exercises/${index}/done`, {
        method: 'POST'
    });
    loadExercises();
}

loadExercises();
