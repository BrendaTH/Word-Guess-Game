    // Word guess game by Brenda Thompson April 8, 2019
    
    // VARIABLES
    // ==========================================================================
    var isStarted = false;
    var wordToGuess = "";
    var lengthOfWord = 0;
    var displayedWord = [];
    var matchedLetterCount = 0;
    var numberOfChoices = 0;
    var alreadyChosenLetters = [];
    var wordList = [ "variable", "computer", "norad"];
    var wins = 0;
    var losses = 0;

    // Create variables that hold references to the places in the HTML where we want to display things.
    var directionsTextID = document.getElementById("directions-text");
    var wordDisplayID = document.getElementById("word-display-text");
    var numberOfChoicesID = document.getElementById("remaining-choices-count");
    var alreadyChosenLettersID = document.getElementById("chosen-letters");
    var winsTextID = document.getElementById("wins-text");
    var lossesTextID = document.getElementById("losses-text");

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    function chooseNewWord() {
        var wordListIndex = getRndInteger(0, wordList.length);
        console.log("your index is: " + wordListIndex);
        console.log("your word is: " + wordList[wordListIndex]);
        return wordList[wordListIndex];
    }

    function setUpGame() {
            // choose a word
            // bjt build a list of valid words
            wordToGuess = chooseNewWord();
            // wordToGuess = "variable"; // for now make it static
            console.log("word is: " + wordToGuess);
            
            // display dashes for words
            lengthOfWord = wordToGuess.length;
            console.log("word length is: " + lengthOfWord);
            displayedWord = [];
            for (var i = 0; i < lengthOfWord; i++) {
                displayedWord.push("_");
            }
            wordDisplayID.textContent = "the word is: " + displayedWord;
            matchedLetterCount = 0;


            // print new directions
            directionsTextID.textContent = "Your word is " + lengthOfWord + " letters long. Please choose a letter";


            // set number of choices
            // display numberOfChoices remaining to user
            numberOfChoices = lengthOfWord * 2;
            console.log("number of choices for this turn: " + numberOfChoices);
            numberOfChoicesID.textContent = "You have " + numberOfChoices + " more choices left";

            // empty array of already chosen letter
            //    display alredyChosenLetters to user
            alreadyChosenLetters = [];
            console.log(" already chosen letters: " + alreadyChosenLetters);
            alreadyChosenLettersID.textContent = "Letters already chosen are: " + alreadyChosenLetters;
            lossesTextID.textContent = "Number of loses: " + losses;
            winsTextID.textContent = "Number of wins: " + wins;
    } // end set up game

    // MAIN PROCESS
    // ==============================================================================
    // Captures keyboard input. Depending on the letter pressed it will "call" (execute) different functions.
      document.onkeyup = function(event) {
        if (!isStarted) {
            isStarted = true;
            setUpGame();
        } else {
            // Captures the key press, converts it to lowercase, and saves it to a variable.
            var letter = event.key.toLowerCase();
            console.log(" the next key chose is: " + letter);
            // verify that this is a letter
            var regex = /^[a-z]+$/
            if (letter.match(regex) === null) {
                alert(letter + " is invalid. Try again");
                return;
            }


            // if match in already chosen letter -  
            //    notify user (alert? or maybe just skip or play a sound)
            //    return;
            if (alreadyChosenLetters.indexOf(letter) !== -1) {
                alert("you've already chosen this letter. Please choose another letter");
                return;
            } else {
            // else 
            //    add letter to already-chose-letters
            //    decrement number-of-choices
            //    display alredyChosenLetters to user
            //    display numberOfChoices remaining to user
                alreadyChosenLetters.push(letter);
                alreadyChosenLettersID.textContent = "Letters already chosen are: " + alreadyChosenLetters;
    
                numberOfChoices--;
                numberOfChoicesID.textContent = "You have " + numberOfChoices + " more choices left";
            }
            //
            // if letter matches in word-choice 
            //    add letter to matched-letters
            //    notify user by displaying new letter in appropriate spot
            var indexOfLetter = wordToGuess.indexOf(letter);
            while (indexOfLetter !== -1) {
                // got a match on the letter in the word save it and show user
                displayedWord[indexOfLetter] = letter;
                wordDisplayID.textContent = "the word is: " + displayedWord;
                matchedLetterCount++;
                // set up to search for the next occurance if any
                // but first make sure we don't exceed the end of the array
                indexOfLetter++;
                if (indexOfLetter >= lengthOfWord) {
                    break;
                } 
                indexOfLetter = wordToGuess.indexOf(letter, indexOfLetter);
            }
            //
            // if all letters are matched 
            //    increment win, 
            //    notify user with stats, 
            //    set isStarted to false
            if (matchedLetterCount >= lengthOfWord) {
                // its a win
                wins++;
                winsTextID.textContent = "Number of wins: " + wins;
                // reset all the vars, etc.. to begin again
                setUpGame();
            } else if (numberOfChoices === 0) {
                // else
                //    if (number-of-choices is zero) 
                //        increment losses, 
                //        notify user with stats, 
                //        set isStarted to false
                losses++;
                lossesTextID.textContent = "Number of loses: " + losses;
                setUpGame();
            }
        }
      };