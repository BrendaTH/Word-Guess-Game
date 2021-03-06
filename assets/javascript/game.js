    // Word guess game by Brenda Thompson April 8, 2019
    
    // VARIABLES
    // ==========================================================================
    // Create variables that hold references to the places in the HTML where we want to display things.

    // grab all the Element IDs we need
    var directionsTextID = document.getElementById("directions-text");
    var wordDisplayID = document.getElementById("word-display-text");
    var numberOfChoicesID = document.getElementById("remaining-choices-count");
    var alreadyChosenLettersID = document.getElementById("chosen-letters");
    var winsTextID = document.getElementById("wins-text");
    var lossesTextID = document.getElementById("losses-text");
    var mainImageID = document.getElementById("main-image");

    var wordList = [ "dinosaur", "jurassic", "genetics", "paleontology", "velociraptor"];

    // generate a randon number of the integer flavor
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    var myGame = {
        isStarted: false,
        wordToGuess: "",
        lengthOfWord: 0,
        displayedWord: [],
        matchedLetterCount: 0,
        numberOfChoices: 0,
        alreadyChosenLetters: [],
        wins: 0,
        losses: 0,

        // select a new word from the wordList array
        chooseNewWord: function() {
            var wordListIndex = getRndInteger(0, wordList.length);
            console.log("your word is: " + wordList[wordListIndex]);
            return wordList[wordListIndex];
        },

        // init all the stuff we need for the game
        setUpGame: function() {
            this.wordToGuess = this.chooseNewWord();
            
            // display dashes for words at beginning of game
            this.lengthOfWord = this.wordToGuess.length;
            this.displayedWord = [];
            for (var i = 0; i < this.lengthOfWord; i++) {
                this.displayedWord.push("_");
            }
            wordDisplayID.textContent = "the word is: " + this.displayedWord;
            this.matchedLetterCount = 0;

            // now that game has started or restarted erase old directions and replace 
            // with the game directions, put in normal-play color, and put the JP logo poster up
            directionsTextID.textContent = "Your word is " + this.lengthOfWord + " letters long. Please choose a letter";
            directionsTextID.className = "play-color";
            
            mainImageID.className = "gates-image";
            mainImageID.src = "assets/images/JPGates.jpg";


            // display numberOfChoices remaining to user
            this.numberOfChoices = this.lengthOfWord * 2;
            numberOfChoicesID.textContent = "You have " + this.numberOfChoices + " more choices left";

            //    display alredyChosenLetters to user
            this.alreadyChosenLetters = [];
            alreadyChosenLettersID.textContent = "Letters already chosen are: " + this.alreadyChosenLetters;

            // display wins and losses
            lossesTextID.textContent = "Number of loses: " + this.losses;
            winsTextID.textContent = "Number of wins: " + this.wins;
        },  // end setupGame method

        // Captures the key press, converts it to lowercase, and saves it to a variable.
        // returns true if received a valid letter. false if no letter
        gotValidLetter: function(letter) {
            // verify that char chosen is a letter
            var regex = /^[a-z]+$/
            if (letter.match(regex) === null) {
                var audio = new Audio('assets/sounds/iHateComputers.mp3');
                alert("The character " + letter + " is invalid. Don't you hate computers?");
                audio.play();
                return false;
            }
            return true;
        },

        // if letter was already picked return true otherwise return false
        letterAlreadyChosen: function(letter) {
            if (this.alreadyChosenLetters.indexOf(letter) !== -1) {
                alert("you've already chosen this letter. Please choose another letter");
                return true;
            }
            return false;
        },

    };  // end myGame object

    // MAIN PROCESS
    // ==============================================================================
    // Captures keyboard input. Depending on the letter pressed it will "call" (execute) different functions.
    document.onkeyup = function(event) {
        if (!myGame.isStarted) {
            var audio = new Audio('assets/sounds/imFairlyAlarmedHere.mp3');
            audio.play();
            myGame.isStarted = true;
            myGame.setUpGame();
        } else {
            var letter = event.key.toLowerCase();
            // validate the letter typed in
            if (!myGame.gotValidLetter(letter)) {
                return;
            }
            // if letter already chosen return
            if (myGame.letterAlreadyChosen(letter)) {
                return;
            } else {
            // else 
            //    add letter to already-chose-letters
            //    decrement number-of-choices
            //    display alredyChosenLetters to user
            //    display numberOfChoices remaining to user
                myGame.alreadyChosenLetters.push(letter);
                alreadyChosenLettersID.textContent = "Letters already chosen are: " + myGame.alreadyChosenLetters;
    
                myGame.numberOfChoices--;
                numberOfChoicesID.textContent = "You have " + myGame.numberOfChoices + " more choices left";

                if (myGame.numberOfChoices <= 2 && myGame.numberOfChoices > 0) {
                    console.log( "only " + myGame.numberOfChoices + " choices left. Don't you hate computers?");
                    alert("only " + myGame.numberOfChoices + " choices left. Don't you hate computers?");
                    var audio = new Audio('assets/sounds/iHateComputers.mp3');
                    audio.play();
                }            
            }
            //
            // if letter matches in word-choice 
            //    add letter to matched-letters
            //    notify user by displaying new letter in appropriate spot
            var indexOfLetter = myGame.wordToGuess.indexOf(letter);
            while (indexOfLetter !== -1) {
                // got a match on the letter in the word, save it and show user
                myGame.displayedWord[indexOfLetter] = letter;
                wordDisplayID.textContent = "the word is: " + myGame.displayedWord;
                myGame.matchedLetterCount++;
                // search for the next occurance of letter if any
                // but first make sure we don't exceed the end of the array
                indexOfLetter++;
                if (indexOfLetter >= myGame.lengthOfWord) {
                    // too far exit this loop
                    break;
                } 
                indexOfLetter = myGame.wordToGuess.indexOf(letter, indexOfLetter);
            }
            //
            // if all letters are matched 
            //    increment win, 
            //    update win id 
            if (myGame.matchedLetterCount >= myGame.lengthOfWord) {
                myGame.wins++;
                winsTextID.textContent = "Number of wins: " + myGame.wins;
                // WE WON! tell the world
                directionsTextID.textContent = "You've won! Press any letter to continue.";
                directionsTextID.className = "win-color";
                var audio = new Audio('assets/sounds/iveDecidedNotTo.mp3');
                audio.play();
                mainImageID.className = "poster-image";
                mainImageID.src = "assets/images/JurrasicParkLayou.jpg";
                myGame.isStarted = false;
            } else if (myGame.numberOfChoices === 0) {
                // else
                //    if (number-of-choices is zero) 
                //        increment losses, 
                //        update loss id, 
                myGame.losses++;
                lossesTextID.textContent = "Number of loses: " + myGame.losses;
                directionsTextID.textContent = "You've been eaten by a dinosaur. Press any letter to continue.";
                directionsTextID.className = "loss-color";
                var audio = new Audio('assets/sounds/tRexGrowls.mp3');
                audio.play();
                mainImageID.src = "assets/images/tyrannosaurus-rex-isolated-white.jpg";
                myGame.isStarted = false;

    
            }
        }
      };