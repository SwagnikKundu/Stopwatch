const time = {
    'hour': 0,
    'minute': 0,
    'second': 0,
    'millisecond': 0
};

const startBtn = document.querySelector('#start-timer');
const recordBtn = document.querySelector('#record-lap');
const resetBtn = document.querySelector('#reset-timer');
const timerDis = document.querySelector('#timer-display');
const lapTable = document.querySelector('#lap');

let intervalId = null;
let lapCount = 0;
let prevTime = 0;
let prevLap =0;

function resetTimer() {
    clearInterval(intervalId);
    startBtn.value = 'start';
    startBtn.textContent = 'START';
    startBtn.style.backgroundColor = 'rgb(22, 220, 22)';
    recordBtn.disabled = true;
    resetBtn.disabled = true;
    time.hour = time.minute = time.second = time.millisecond = 0;
    clearTable();
    updateDisplay();
}

function toggleTimer() {
    if (startBtn.value === 'start') {
        startBtn.value = 'pause';
        startBtn.textContent = 'PAUSE';
        startBtn.style.backgroundColor = 'red';
        recordBtn.disabled = false;
        resetBtn.disabled = false;
        prevTime = Date.now();
        intervalId = setInterval(updateTimer, 10); // Update every 10 milliseconds
    } else {
        startBtn.value = 'start';
        startBtn.textContent = 'START';
        recordBtn.disabled = true;
        startBtn.style.backgroundColor = 'rgb(22, 220, 22)';
        clearInterval(intervalId);
    }
}

function updateTimer() {
    const currentTime = Date.now();
    const deltaTime = currentTime - prevTime;
    prevTime = currentTime;
    incrementTime(deltaTime);
    updateDisplay();
}

function incrementTime(deltaTime) {
    time.millisecond += deltaTime;
    if (time.millisecond >= 1000) {
        const secondsToAdd = Math.floor(time.millisecond / 1000);
        time.millisecond %= 1000;
        time.second += secondsToAdd;
        if (time.second >= 60) {
            const minutesToAdd = Math.floor(time.second / 60);
            time.second %= 60;
            time.minute += minutesToAdd;
            if (time.minute >= 60) {
                const hoursToAdd = Math.floor(time.minute / 60);
                time.minute %= 60;
                time.hour += hoursToAdd;
            }
        }
    }
}

function updateDisplay() {
    timerDis.textContent = formatTime(time.hour, time.minute, time.second, time.millisecond);
}

function formatTime(hour, minute, second, millisecond) {
    let hr = hour < 10 ? '0' + hour : hour;
    let min = minute < 10 ? '0' + minute : minute;
    let sec = second < 10 ? '0' + second : second;
    let msec = millisecond < 10 ? '00' + millisecond : millisecond < 100 ? '0' + millisecond : millisecond;
    return `${hr}:${min}:${sec}:${msec}`;
}

function recordLap() {
    const currentLapTime = time.millisecond + time.second * 1000 + time.minute * 60 * 1000 + time.hour * 60 * 60 * 1000;
    const lapTime = currentLapTime-prevLap;
    prevLap=currentLapTime;


    if (!lapTable.querySelector('tr')) {
        addTableHeader();
    }

    const lapRecord = document.createElement('tr');
    const lapNumberCell = document.createElement('td');
    lapNumberCell.textContent = 'Lap ' + (++lapCount);
    const lapTimeCell = document.createElement('td');
    lapTimeCell.textContent = formatTime(Math.floor(lapTime / (60 * 60 * 1000)), Math.floor((lapTime % (60 * 60 * 1000)) / (60 * 1000)), Math.floor((lapTime % (60 * 1000)) / 1000), lapTime % 1000);
    const totalTimeCell = document.createElement('td');
    totalTimeCell.textContent = timerDis.textContent;
    lapRecord.appendChild(lapNumberCell);
    lapRecord.appendChild(lapTimeCell);
    lapRecord.appendChild(totalTimeCell);
    lapTable.appendChild(lapRecord);
}


function addTableHeader() {
    const headerRow = document.createElement('tr');
    const lapHeader = document.createElement('th');
    lapHeader.textContent = 'Lap';
    const lapTimeHeader = document.createElement('th');
    lapTimeHeader.textContent = 'Lap Time';
    const totalTimeHeader = document.createElement('th');
    totalTimeHeader.textContent = 'Total Time';
    headerRow.appendChild(lapHeader);
    headerRow.appendChild(lapTimeHeader);
    headerRow.appendChild(totalTimeHeader);
    lapTable.appendChild(headerRow);
}

function clearTable() {
    lapTable.querySelectorAll('tr').forEach(row => row.remove());
    lapCount = 0;
}

startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
recordBtn.addEventListener('click', recordLap);

resetTimer();
