var simulationInterval;
var currentPageIndex = 0;
var isPaused = false;

// Function sa pagsugod sa LRU simulation
function startSimulation() {
    var input = document.getElementById('pageSequence').value;
    var frames = parseInt(prompt("Enter the number of frames:"), 10);

    if (input === "" || isNaN(frames)) {
        alert("Please enter valid input!");
        return;
    }

    var pageSequence = input.split(',').map(Number);
    var frameContainer = document.getElementById('frameContainer');
    var animationContainer = document.getElementById('animationContainer');
    var tableBody = document.querySelector('#simulationTable tbody');
    var successCount = document.getElementById('successCount');
    var failureCount = document.getElementById('failureCount');
    var summary = document.getElementById('summary');
    var finalSuccessCount = document.getElementById('finalSuccessCount');
    var finalFailureCount = document.getElementById('finalFailureCount');

    // Limpyo sa dati nga simulation
    frameContainer.innerHTML = '';
    animationContainer.innerHTML = '';
    tableBody.innerHTML = '';
    successCount.textContent = 'Successful Page Accesses: 0';
    failureCount.textContent = 'Page Faults: 0';
    summary.style.display = 'none';
    currentPageIndex = 0;
    isPaused = false;

    // Paghimo og frames
    for (var i = 0; i < frames; i++) {
        var frame = document.createElement('div');
        frame.classList.add('frame', 'empty');
        frame.textContent = '-';
        frameContainer.appendChild(frame);
    }

    var memory = [];
    var pageFaults = 0;
    var successfulAccesses = 0;

    function simulateStep() {
        if (currentPageIndex >= pageSequence.length) {
            clearInterval(simulationInterval);
            summary.style.display = 'block';
            finalSuccessCount.textContent = "Successful Page Accesses: " + successfulAccesses;
            finalFailureCount.textContent = "Page Faults: " + pageFaults;
            return;
        }

        var page = pageSequence[currentPageIndex];
        var pageInMemory = memory.indexOf(page) !== -1;
        var pageReplaced = null;

        if (!pageInMemory) {
            pageFaults++;
            animationContainer.innerHTML += `<p>Page ${page} not found in memory.</p>`;

            if (memory.length === frames) {
                pageReplaced = memory.shift(); // Kuhaa ang pinakagulang nga page
                animationContainer.innerHTML += `<p>Replacing page ${pageReplaced} with page ${page}.</p>`;
            }

            memory.push(page);
        } else {
            successfulAccesses++;
            animationContainer.innerHTML += `<p>Page ${page} found in memory.</p>`;
            memory.splice(memory.indexOf(page), 1);
            memory.push(page);
        }

        updateFrames(memory, frameContainer, pageInMemory);
        highlightCurrentPage(page, frameContainer, pageInMemory);
        currentPageIndex++;
    }

    simulationInterval = setInterval(function() {
        if (!isPaused) {
            simulateStep();
        }
    }, 1000);
}

// Function sa pag-pause sa simulation
function pauseSimulation() {
    isPaused = true;
}

// Function sa pag-resume sa simulation
function resumeSimulation() {
    isPaused = false;
}

// Function sa pag-reset sa simulation
function resetSimulation() {
    clearInterval(simulationInterval);
    currentPageIndex = 0;
    isPaused = false;

    var frameContainer = document.getElementById('frameContainer');
    var animationContainer = document.getElementById('animationContainer');
    var tableBody = document.querySelector('#simulationTable tbody');
    var successCount = document.getElementById('successCount');
    var failureCount = document.getElementById('failureCount');
    var summary = document.getElementById('summary');

    frameContainer.innerHTML = '';
    animationContainer.innerHTML = '';
    tableBody.innerHTML = '';
    successCount.textContent = 'Successful Page Accesses: 0';
    failureCount.textContent = 'Page Faults: 0';
    summary.style.display = 'none';
}

// Function sa pag-update sa frames sa UI
function updateFrames(memory, frameContainer, pageInMemory) {
    var frames = frameContainer.querySelectorAll('.frame');
    frames.forEach(function(frame, index) {
        if (index < memory.length) {
            frame.classList.remove('empty', 'active', 'fault');
            frame.classList.add(pageInMemory ? 'active' : 'fault');
            frame.textContent = memory[index];
        } else {
            frame.classList.remove('active', 'fault');
            frame.classList.add('empty');
            frame.textContent = '-';
        }
    });
}

// Function sa pag-highlight sa page nga gi-access
function highlightCurrentPage(page, frameContainer, pageInMemory) {
    var frames = frameContainer.querySelectorAll('.frame');
    frames.forEach(function(frame) {
        if (parseInt(frame.textContent, 10) === page) {
            frame.classList.add('highlight');
            setTimeout(() => frame.classList.remove('highlight'), 500);
        }
    });
}