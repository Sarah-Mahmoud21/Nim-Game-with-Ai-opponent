let numberOfRows = 0;
let sticksInRows = [];
let selectedDifficulty = '';
let selectedVersion = '';
let selectedFirstPlayer = '';
let selectedRow = 1;
let selectedShapes = 1;
let text = 'Your Moves text here';
let PcMoveNot = 'PC Moves text here';
let blockedRow = null;
let flag = false;
let blockedRowGen = false;
// To prepare the game page
function selectSticks() {
    const modal = document.getElementById('sticksModal');
    modal.style.display = 'block';

    const sticksForm = document.getElementById('sticksForm');
    sticksForm.innerHTML = '';

    const rows = document.getElementById('rows').value;

    for (let i = 1; i <= rows; i++) {
        const stickLabel = document.createElement('label');
        stickLabel.textContent = `Row ${i}:`;

        const stickInput = document.createElement('input');
        stickInput.type = 'number';
        stickInput.min = '1';
        stickInput.value = '3';

        sticksForm.appendChild(stickLabel);
        sticksForm.appendChild(stickInput);
    }
}

function closeModal() {
    const modal = document.getElementById('sticksModal');
    modal.style.display = 'none';
}

function applySticks() {
    closeModal();

    numberOfRows = parseInt(document.getElementById('rows').value);
    sticksInRows = [];

    const difficultyRadioButtons = document.getElementsByName('difficulty');
    const versionRadioButtons = document.getElementsByName('version');
    const firstPlayerRadioButtons = document.getElementsByName('whoIsFirst');

    for (let i = 1; i <= numberOfRows; i++) {
        const stickInput = document.getElementById('sticksForm').querySelector(`input:nth-child(${i * 2})`);
        sticksInRows.push(parseInt(stickInput.value));
    }

    // Store values in sessionStorage
    sessionStorage.setItem('sticksInRows', JSON.stringify(sticksInRows));

    for (let i = 0; i < difficultyRadioButtons.length; i++) {
        if (difficultyRadioButtons[i].checked) {
            selectedDifficulty = difficultyRadioButtons[i].value;
            break;
        }
    }

    for (let i = 0; i < versionRadioButtons.length; i++) {
        if (versionRadioButtons[i].checked) {
            selectedVersion = versionRadioButtons[i].value;
            break;
        }
    }

    for (let i = 0; i < firstPlayerRadioButtons.length; i++) {
        if (firstPlayerRadioButtons[i].checked) {
            selectedFirstPlayer = firstPlayerRadioButtons[i].value;
            break;
        }
    }

    // Store radio button values in sessionStorage
    sessionStorage.setItem('selectedDifficulty', selectedDifficulty);
    sessionStorage.setItem('selectedVersion', selectedVersion);
    sessionStorage.setItem('selectedFirstPlayer', selectedFirstPlayer);
}

function initializeGame() {
    blockedRow = null;

    const storedSticks = sessionStorage.getItem('sticksInRows');
    const storedDifficulty = sessionStorage.getItem('selectedDifficulty');
    const storedVersion = sessionStorage.getItem('selectedVersion');
    const storedFirstPlayer = sessionStorage.getItem('selectedFirstPlayer');

    if (storedSticks && storedDifficulty && storedVersion && storedFirstPlayer) {
        sticksInRows = JSON.parse(storedSticks);
        selectedDifficulty = storedDifficulty;
        selectedVersion = storedVersion;
        selectedFirstPlayer = storedFirstPlayer;
        generatePyramid();

    }

    whoIsFirst();
}

function generatePyramid() {
    const resultDiv = document.body;
    resultDiv.innerHTML = '';
    const maxShapes = Math.max(...sticksInRows);

    // Input fields for human player
    const rowInput = document.createElement('input');
    rowInput.type = 'text';
    rowInput.id = 'rowInput';
    rowInput.placeholder = 'Row Number';
    rowInput.style.margin = '5px';
    rowInput.style.padding = '8px';
    rowInput.style.border = '1px solid #ccc';
    rowInput.style.borderRadius = '4px';
    resultDiv.appendChild(rowInput);

    const shapesInput = document.createElement('input');
    shapesInput.type = 'text';
    shapesInput.id = 'shapesInput';
    shapesInput.placeholder = 'Number of Shapes';
    shapesInput.style.margin = '5px';
    shapesInput.style.padding = '8px';
    shapesInput.style.border = '1px solid #ccc';
    shapesInput.style.borderRadius = '4px';
    resultDiv.appendChild(shapesInput);

    // Button for human player to submit move
    const humanTurnButton = document.createElement('button');
    humanTurnButton.textContent = 'PC Turn';
    humanTurnButton.addEventListener('click', handleHumanButtonClick);
    humanTurnButton.style.margin = '5px';
    humanTurnButton.style.padding = '10px';
    humanTurnButton.style.backgroundColor = '#ff66b2';
    humanTurnButton.style.color = 'white';
    humanTurnButton.style.border = 'none';
    humanTurnButton.style.borderRadius = '4px';
    humanTurnButton.style.cursor = 'pointer';

    resultDiv.appendChild(humanTurnButton);

    //Go Back to the confegration
    const GoBack = document.createElement('button');
    GoBack.textContent = 'Go Back To The Home Page';
    GoBack.addEventListener('click', GoBackToHome);
    GoBack.style.margin = '5px';
    GoBack.style.padding = '10px';
    GoBack.style.backgroundColor = '#ff66b2';
    GoBack.style.color = 'white';
    GoBack.style.border = 'none';
    GoBack.style.borderRadius = '4px';
    GoBack.style.cursor = 'pointer';

    resultDiv.appendChild(GoBack);

    // Notification label 
    const notificationLabel = document.createElement('div');
    notificationLabel.textContent = text;
    notificationLabel.id = 'notificationLabel';
    notificationLabel.style.margin = '10px 0';
    notificationLabel.style.padding = '12px';
    notificationLabel.style.backgroundColor = '#FFC0CB'; // Cold pink color
    notificationLabel.style.color = '#333';
    notificationLabel.style.borderRadius = '4px';
    resultDiv.appendChild(notificationLabel);

    //pc move
    const pcMove = document.createElement('div');
    pcMove.textContent = PcMoveNot;
    pcMove.id = 'pcMove';
    pcMove.style.margin = '10px 0';
    pcMove.style.padding = '12px';
    pcMove.style.backgroundColor = '#FFC0CB'; // Cold pink color
    pcMove.style.color = '#333';
    pcMove.style.borderRadius = '4px';
    resultDiv.appendChild(pcMove);


    // rule label 
    if (selectedVersion == 'nim') {
        const rule = document.createElement('p');
        rule.textContent = "Game rules :" +
            "Nim Game is an interactive game that enables you to play with a computer, where each player must remove a number of circles from only one row at a time, and the goal is to force your opponent to take the last circle." + "                  "
            + "Note: You must select which row and how many circles you want to remove from the text field above, and then click on “PC Turn”";
        rule.id = 'rule';
        rule.style.margin = '10px 0';
        rule.style.padding = '12px';
        rule.style.backgroundColor = '#FFC0CB'; // Cold pink color
        rule.style.color = '#333';
        rule.style.borderRadius = '4px';
        resultDiv.appendChild(rule);
    }
    if (selectedVersion == 'Tricky') {
        const rule = document.createElement('p');
        rule.textContent = "Game rules :" + "Tricky Nim is another version of regular Nim, as this game relies on other rules, which are that at the beginning of the game there is a trap room (that is temporarily frozen) from which it is forbidden to remove circles, and if your choice falls on it, you will fall into the trap and lose your current role, and after this row is chosen The ice will dislodge and return to normal!";
        rule.id = 'rule';
        rule.style.margin = '10px 0';
        rule.style.padding = '12px';
        rule.style.backgroundColor = '#FFC0CB'; // Cold pink color
        rule.style.color = '#333';
        rule.style.borderRadius = '4px';
        resultDiv.appendChild(rule);


    }

    for (let rowIndex = 0; rowIndex < sticksInRows.length; rowIndex++) {
        groupDiv = document.createElement('div');
        groupDiv.classList.add('group');


        // Add row number label
        const labelDiv = document.createElement('div');
        labelDiv.classList.add('group-label');
        labelDiv.textContent = `Row ${rowIndex + 1}`;
        groupDiv.appendChild(labelDiv);

        for (let i = 0; i < maxShapes; i++) {
            const shapesInRow = sticksInRows[rowIndex];
            const circleDiv = document.createElement('div');

            if (i < shapesInRow) {
                circleDiv.classList.add('circle');
                circleDiv.style.transform = 'translateY(20px)';
                circleDiv.addEventListener('click', () => handleHumanMove(rowIndex, i + 1));
            }
            groupDiv.appendChild(circleDiv);
        }

        resultDiv.appendChild(groupDiv);
    }
}
//go back to home page
function GoBackToHome() {
    window.location.href = 'index.html';
}
// To know whi will play first
function whoIsFirst() {

    if (selectedFirstPlayer === 'pc') {
        pcTurnFunction();
    }
    else {
        handleHumanMove();
    }
}
// Human Turn
function handleHumanMove(rowIndex, move) {
    if (blockedRowGen === false || flag === true) {
        if (flag === false) {
            if (selectedVersion == 'Tricky') {
                blockedRow = generateRandomInt();
                blockedRowGen = true;
            }
            // if it's tricky a row will be blocked if not then the regular nim
            else if (selectedVersion == 'nim') {
                blockedRow = null;
            }
        }
        else {
            blockedRow = null;
        }
    }
    console.log(blockedRow);

    if (rowIndex === blockedRow) {
        flag = true;
        console.log("true");
        text = `Human attempts to remove from a blocked row (Row ${rowIndex + 1})`;
        //console.log(`PC attempts to remove from a blocked row (Row ${rowIndex + 1})`);
        generatePyramid();
        checkWinning();

    }
    else {
        // To check if it's a valid move
        if (move > 0 && move <= sticksInRows[rowIndex]) {
            //console.log(`Human removes ${move} stick(s) from Row ${rowIndex + 1}`);
            text = `Human removes ${move} stick(s) from Row ${rowIndex + 1}`;
            sticksInRows[rowIndex] -= move;
            generatePyramid();
            checkWinning();
            //pcTurnFunction();
        }
        // else {
        //     text = "Invalid move. Please choose a valid number of sticks to remove.";

        //     //console.log("Invalid move. Please choose a valid number of sticks to remove.");

        // }
    }


}

function handleHumanButtonClick() {
    if (selectedFirstPlayer === 'human') {
        const rowIndex = parseInt(document.getElementById('rowInput').value);
        const shapesToRemove = parseInt(document.getElementById('shapesInput').value);

        if (!isNaN(rowIndex) && !isNaN(shapesToRemove) && rowIndex >= 1 && rowIndex <= sticksInRows.length && shapesToRemove > 0) {
            // Update the display and let the PC take its turn
            handleHumanMove(rowIndex - 1, shapesToRemove);
        }
        // else {
        //     //console.log("Invalid input. Please enter valid row and shapes values.");
        //     text = "Invalid input. Please enter valid row and shapes values.";

        // }
    }
}
// End Human Turn
//PC Turn


function generateRandomInt() {
    let nonEmptyRows = sticksInRows.reduce((acc, row, index) => {
        if (row > 0) {
            acc.push(index);
        }
        return acc;
    }, []);

    if (nonEmptyRows.length === 0) {
        return; 
    }

    let randomRowIndex = nonEmptyRows[Math.floor(Math.random() * nonEmptyRows.length)];

    return randomRowIndex;
}
function pcTurnFunction() {
    // PC's turn logic
    if (blockedRowGen === false || flag === true) {
        if (flag === false) {
            if (selectedVersion == 'Tricky') {
                blockedRow = generateRandomInt();
                blockedRowGen = true;
            }
            // if it's tricky a row will be blocked if not then the regular nim
            else if (selectedVersion == 'nim') {
                blockedRow = null;
            }
        }
        else {
            blockedRow = null;
        }
    }

    console.log(blockedRow);

    if (selectedDifficulty === 'hard') {
        console.log("hard mode");
        const bestMove = findBestMove(sticksInRows);
        const rowIndex = bestMove[0];
        const move = bestMove[1];

        if (rowIndex === blockedRow) {
            flag = true;
            console.log('true');
            PcMoveNot = `PC attempts to remove from a blocked row (Row ${rowIndex + 1})`;
            //console.log(`PC attempts to remove from a blocked row (Row ${rowIndex + 1})`);
            generatePyramid();
            checkWinning();

        } else {
            //console.log(`PC chooses to remove ${move} stick(s) from Row ${rowIndex + 1}`);
            PcMoveNot = `PC chooses to remove ${move} stick(s) from Row ${rowIndex + 1}`;

            sticksInRows[rowIndex] -= move;
            generatePyramid();
            checkWinning();
        }
    }

    else if (selectedDifficulty === 'easy') {
        console.log("easy mode");
        makeRandomMove();

    }
    else if (selectedDifficulty === 'medium') {
        console.log("medium mode");
        const bestMove = GreedyMove();
        const rowIndex = bestMove[0];
        const move = bestMove[1];

        if (rowIndex === blockedRow) {
            flag = true;
            console.log('true');
            //console.log(`PC attempts to remove from a blocked row (Row ${rowIndex + 1})`);
            PcMoveNot = `PC attempts to remove from a blocked row (Row ${rowIndex + 1})`;
            generatePyramid();
            checkWinning();
        } else {
            //console.log(`PC chooses to remove ${move} stick(s) from Row ${rowIndex + 1}`);
            PcMoveNot = `PC chooses to remove ${move} stick(s) from Row ${rowIndex + 1}`;
            sticksInRows[rowIndex] -= move;
            generatePyramid();
            checkWinning();
        }
    }
}
// medium
function GreedyMove() {
    let bestMove = null;
    let maxSticks = 0;

    for (let i = 0; i < sticksInRows.length; i++) {
        if (sticksInRows[i] > maxSticks) {
            maxSticks = sticksInRows[i];
            bestMove = [i, 1];
        }
    }

    return bestMove;
}
//hard
function findBestMove(currentState) {
    const initialAlpha = Number.MIN_SAFE_INTEGER;
    const initialBeta = Number.MAX_SAFE_INTEGER;
    const isMaxPlayer = true;

    const result = alphaBeta(currentState, initialAlpha, initialBeta, isMaxPlayer);

    return result.move;
}

function alphaBeta(state, alpha, beta, isMaxPlayer) {
    let bestMove = null;

    if (isMaxPlayer) {
        let maxEval = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < state.length; i++) {
            for (let j = 1; j <= state[i]; j++) {
                const newState = [...state];
                newState[i] -= j;

                const eval = alphaBeta(newState, alpha, beta, false).score;

                if (bestMove === null || eval > maxEval) {
                    maxEval = eval;
                    bestMove = [i, j];
                }

                alpha = Math.max(alpha, eval);

                if (beta <= alpha) {
                    break;
                }
            }
        }

        return { score: maxEval, move: bestMove };
    } else {
        let minEval = Number.MIN_SAFE_INTEGER;

        for (let i = 0; i < state.length; i++) {
            for (let j = 1; j <= state[i]; j++) {
                const newState = [...state];
                newState[i] -= j;

                const eval = alphaBeta(newState, alpha, beta, true).score;

                if (bestMove === null || eval < minEval) {
                    minEval = eval;
                    bestMove = [i, j];
                }

                beta = Math.min(beta, eval);

                if (beta <= alpha) {
                    break;
                }
            }
        }

        return { score: minEval, move: bestMove };
    }
}
//easy 
function makeRandomMove() {
    // Choose a random non-empty row
    let nonEmptyRows = sticksInRows.reduce((acc, row, index) => {
        if (row > 0) {
            acc.push(index);
        }
        return acc;
    }, []);

    if (nonEmptyRows.length === 0) {
        return; // No valid moves
    }

    let randomRowIndex = nonEmptyRows[Math.floor(Math.random() * nonEmptyRows.length)];

    // Choose a random number of sticks to remove from the selected row
    let sticksToRemove = Math.floor(Math.random() * sticksInRows[randomRowIndex]) + 1;

    // Make the move

    if (randomRowIndex === blockedRow) {
        flag = true;
        console.log('true');
        PcMoveNot = `PC attempts to remove from a blocked row (Row ${randomRowIndex + 1})`;
        //console.log(`PC attempts to remove from a blocked row (Row ${randomRowIndex + 1})`);
        generatePyramid();
        checkWinning();
    } else {
        PcMoveNot = `PC chooses to remove ${sticksToRemove} stick(s) from Row ${randomRowIndex + 1}`;
        //console.log(`PC chooses to remove ${sticksToRemove} stick(s) from Row ${randomRowIndex + 1}`);
        sticksInRows[randomRowIndex] -= sticksToRemove;
        generatePyramid();
        checkWinning();
    }
}

//To see If The game is Over
function checkWinning() {
    const isHumanTurn = (selectedFirstPlayer === 'human');
    const isLastMove = sticksInRows.every(row => row === 0);

    if (isLastMove) {
        if (isHumanTurn) {
            text = 'PC wins!';
            PcMoveNot = 'PC wins!';
            console.log('PC wins!');
            generatePyramid();
        } else {
            text = 'Human wins!';
            PcMoveNot = 'Human wins!';
            generatePyramid();
            console.log('Human wins!');
        }
    } else {
        selectedFirstPlayer = isHumanTurn ? 'pc' : 'human';
        whoIsFirst();
    }
}

