import hiragana from './hiragana.json' assert {type: 'json'};


let questions = []; // keys: letters, choices, answer

let numCorrect = 0;
let numWrong = 0;

// UTIL FUNCTIONS

function shuffleArray(arr) {
    // shuffles/randomize order of an array
    return arr.sort(() => 0.5 - Math.random());
}

// END UTIL FUNCTIONS

function renderResults() {
    // show the results modal

    // src (bootstrap docs): https://getbootstrap.com/docs/5.2/components/modal/#via-javascript
    let resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
    let resultsModalText = document.getElementById("results");

    // create message based on the score
    let score = numCorrect / questions.length;
    let message;
    if(score < 0.4) {
        message = "Try better next time!";
    } else if(score < 0.6) {
        message = "Nice job!"
    } else if(score < 0.8) {
        message = "Doing great!"
    } else {
        message = "WOW!"
    }
    
    resultsModalText.innerHTML = `<h4>${message}</h4> <p class="text-primary">Score: ${numCorrect}/${questions.length}</p> <p class="text-success">Correct: ${numCorrect}</p><p class="text-danger">Wrong: ${numWrong}</p>`;
    resultModal.show();
}

function updateStats() {
    // update the stats shown on the screen with the global variables numCorrect and numWrong
    let stats = document.getElementById("stats");
    stats.innerHTML = `correct: ${numCorrect} &emsp; wrong: ${numWrong}`;
}

function displayQuestionModal(idx, correct) {
    // display the modal
    let resultModal = new bootstrap.Modal(document.getElementById("questionResultModal"));
    let resultsModalText = document.getElementById("questionResults");
    let questionResultButton = document.getElementById("questionResultButton");

    // display the correct answer
    let question = questions[idx];
    console.log(question)
    // TODO: show correct/incorrect, add pronounciations (audio)
    resultsModalText.innerHTML = `${correct ? "<h3 class='text-success'>Correct!</h3>" : "<h3 class='text-danger'>Incorrect</h3>"} <h4>${question.letter} -> ${question.answer}</h4>`;
    
    questionResultButton.onclick = () => {renderQuestion(idx+1)} // display the next question when user clicks "OK" button

    resultModal.show()
}

function disableButtons() {
    // disable buttons
    document.querySelectorAll(".letterChoices").forEach(button => {button.disabled=true});
}



function renderQuestion(idx) {
    // create the components the current question
    let question = questions[idx];
    if (question == undefined) {
        // ran out of questions, render results
        renderResults();
        return
    };
    let letterQuestion = document.getElementById("letterQuestion");
    let choicesDiv = document.getElementById("choices");
    letterQuestion.innerHTML = question.letter;
    
    choicesDiv.innerHTML = ""; // remove last choices
    question.choices.forEach(letter => {
        // for each letter, add a button/choice
        let correct = letter == question.answer;
        let letterButton = document.createElement("button");
        letterButton.innerHTML = letter;
        letterButton.className = "letterChoices btn btn-primary col-sm-4";
        letterButton.onclick = () => {
            // on click function 
            // we're going to define the function here so that we can directly validate the answer
            if (correct) {
                // alert('correct!');
                numCorrect++;
            } else {
                // alert('incorrect');
                numWrong++;
            }

            // set buttons to disabled
            disableButtons();

            // color the right and wrong answer by changing the class to correctChoice/incorrectChoice
            letterButton.classList.add(correct ? "correctChoice" : "incorrectChoice");
            console.log(letterButton.classList);

            updateStats();
            
            // and switch to the next question after X seconds (x=0.5s)
            setTimeout(() => {displayQuestionModal(idx, correct)}, 500);

        } 
        choicesDiv.appendChild(letterButton);
    });
}

window.onload = () => {
    // get the picked values (group idx) stored in localStorage

    updateStats();
    let pickedStr = localStorage['picked'];
    pickedStr.split(';').forEach((groupIdx) => {
        if (groupIdx == "") {
            return;
        }
        groupIdx = parseInt(groupIdx);

        let group = hiragana.groups[groupIdx]; // index the group

        // iterate all letters and select those that have the given group
        let letters = hiragana.letters.filter(l => l.group == group.name) // letters in the given group

        letters.forEach(l1 => {
            // l1: letter selected
            // l2: letter being iterated/compared

            // generate a list of choices

            // from the same group
            let otherChoices = shuffleArray(letters.filter(l2 => l2.letter != l1.letter));

            if(otherChoices.length < 3) {
                // if not enough letters in group, add more random letters
                let numMoreNeeded = 3 - otherChoices.length;
                otherChoices = otherChoices.concat(shuffleArray(hiragana.letters).filter(l2 => l2.letter != l1.letter).splice(0,numMoreNeeded))
            } else {
                otherChoices = otherChoices.splice(0,3);
            }

            otherChoices = otherChoices.map(l2 => l2.romaji);

            questions.push({
                letter: l1.letter,
                choices: shuffleArray([
                    l1.romaji,
                    ...otherChoices
                ]),
                answer: l1.romaji
            })
        })
    })

    // randomize question order
    questions = shuffleArray(questions);

    // render first question
    renderQuestion(0);
}

// since it's a module, it is not directly accessable in html
// so we'll have to define the event listeners in javacsript
document.getElementById("back").addEventListener('click', () => {window.location.href = "./"}); // set the back button to redirect to the first page
