const time={
    'hour' : 0,
    'minute' : 0,
    'second' : 0,
    'millisecond' : 0
};

const startBtn = document.querySelector('#start-timer');
const recordBtn = document.querySelector('#record-lap');
const resetBtn = document.querySelector('#reset-timer');
const timerDis = document.querySelector('#timer-display');
const lapTable = document.querySelector('#lap');

let intervalId = null;
let lapCount = 0;
let prevLapTime = 0;

resetTimer();

startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
recordBtn.addEventListener('click', recordLap);

function toggleTimer() {
    if (startBtn.value === 'start') {
        startBtn.value = 'pause';
        startBtn.textContent = 'PAUSE';
        startBtn.style.backgroundColor = 'red';
        recordBtn.disabled = false;
        resetBtn.disabled = false;
        intervalId = setInterval(display, 1);
    } else {
        startBtn.value = 'start';
        startBtn.textContent = 'START';
        recordBtn.disabled = true;
        startBtn.style.backgroundColor = 'rgb(22, 220, 22)';
        clearInterval(intervalId);
    }
}

function display() {
    incrementTime();
    timerDis.textContent = formatTime(hour, minute, second, millisecond);
}

function incrementTime() {
    millisecond++;
    if (millisecond === 100) {
        millisecond = 0;
        second++;
        if (second === 60) {
            second = 0;
            minute++;
            if (minute === 60) {
                minute = 0;
                hour++;
                if (hour === 25) {
                    hour = 0;
                }
            }
        }
    }
}

function formatTime(hour, minute, second, millisecond) {
    let hr = hour < 10 ? '0' + hour : hour;
    let min = minute < 10 ? '0' + minute : minute;
    let sec = second < 10 ? '0' + second : second;
    let msec = millisecond < 10 ? '0' + millisecond : millisecond;
    return `${hr} : ${min} : ${sec} : ${msec}`;
}

function resetTimer() {
    clearInterval(intervalId);
    startBtn.value = 'start';
    startBtn.textContent = 'START';
    startBtn.style.backgroundColor = 'rgb(22, 220, 22)';
    recordBtn.disabled = true;
    resetBtn.disabled = true;
    hour = minute = second = millisecond = 0;
    clearTable();
    timerDis.textContent = '00:00:00:00';
}

function recordLap() {
    const currentLapTime = millisecond + second * 100 + minute * 60 * 100 + hour * 60 * 60 * 100;
    const lapTime = currentLapTime - prevLapTime;
    prevLapTime = currentLapTime;

    if (!lapTable.querySelector('tr')) {
        addTableHeader();
    }

    const lapRecord = document.createElement('tr');
    const lapNumberCell = document.createElement('td');
    lapNumberCell.textContent = 'Lap ' + (++lapCount);
    const lapTimeCell = document.createElement('td');
    lapTimeCell.textContent = calculateTime(lapTime);
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

function calculateTime(milliseconds){
    let hours = Math.floor(milliseconds / (100 * 60 * 60));
    milliseconds %= (1000 * 60 * 60);
    let minutes = Math.floor(milliseconds / (100 * 60));
    milliseconds %= (1000 * 60);
    let seconds = Math.floor(milliseconds / 100);
    milliseconds = milliseconds % 100;
    return formatTime(hours, minutes, seconds, milliseconds);
}

function clearTable() {
    lapTable.querySelectorAll('tr').forEach(row => row.remove());
    lapCount = 0;
    prevLapTime = 0;
}