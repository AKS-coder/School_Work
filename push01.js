var input = require('readline-sync')

// Importing the JSON file that contains the Word and definition
/*
url: https://github.com/matthewreagan/WebstersEnglishDictionary
Original repository and Julia script provided by https://github.com/adambom/dictionary
Webster's Unabridged English Dictionary provided by Project Gutenberg
The original dictionary text file is covered by The Gutenberg Project's licensing, 
please see the file headers for more details. 
The Swift parsing tool and example output files in this repository are free and distributed under the GNU General Public License, Version 2.
*/
var wordDB = require('./dictionary.json')

// Contains all the instances of the Class Word(Array of all the words)
var WordObjs = []

class Word {
    constructor(word, definition) {
        this.word = word.toUpperCase()
        this.definition = "The definition of the word is: " + definition
        this.length = this.word.length
        this.char = this.word.split("")
    }
    // Returns all the vowels present in the Word
    getVowels() {
        var vowels = ["A", "E", "I", "O", "U"]
        var vowelPresent = []
        for (var letter in this.char) {
            if (vowels.indexOf(this.char[letter]) > -1) {
                vowelPresent.push(this.char[letter])
            }
        }
        return vowelPresent
    }
    // Prints out the underlines for each character of the word
    showBlanks(arr) {
        var printedStr = ""
        for (var letters in this.char) {
            if (arr.includes(letters)){
                printedStr += `${this.char[letters]} `
                // process.stdout.write(this.char[letters] + " ")
            }
            else{
                printedStr += "_ "
                // process.stdout.write("_ ")
            }
            
        }
        printedStr += "\n"
        return printedStr
        // console.log("\n")
    }
    // Validator to check if the letter guessed is in the word
    // It will return a list of index of the position of the letter present.
    check(guess) {
        var indices = []
        for (var i = 0; i < this.char.length; i++){
            if (this.char[i] === guess){
                indices.push(i.toString())
            }
        }
        
        return indices
    }

}

class Player {
    constructor(name) {
        this.name = name
        this.score = 0
        this.Hscore = 0
        this.abilityPoint = [1, 1, 1]
        this.lvl = 20
    }
    // Used to debug and to check the profile of the Player
    profile() {
        console.log(`Name: ${this.name}\nScore: ${this.score}\nHigh Score: ${this.Hscore}`)

    }
    // To check if the Player has a new high score
    checkHscore() {
        if (this.score > this.Hscore) {
            this.Hscore = this.score
            console.log(`\n\n~~~Congratulations~~~\n\n${this.name} has a new HIGH SCORE of ${this.Hscore}!!!`)
        }
    }

    // function used to calculate Player's points when they win
    wins(len) {
        this.score += Math.floor(len * this.lvl * 0.4)
        this.lvl = Math.floor(this.lvl * 0.2)
    }

}

// Function to draw Hangman
function Hangman(round){
    var hangman = [`
  +---+
      |
      |
      |
      |
      |
=========
`, `
  +---+
  |   |
      |
      |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
      |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
 /|\\\  |
      |
      |
=========
`, `
  +---+
  |   |
  O   |
 /|\\\  |
 /    |
      |
=========
`, `
  +---+
  |   |
  O   |
 /|\\\  |
 / \\\  |
      |
=========
`]

return hangman[round]
}

// Funtion to Process and add each word in the database into a local word List and assigning the words as instances of the class Words
function getWords() {
    console.log('Loading word Database...')
    // Since the Dictionary keys in the json file are representing the words and the definiton of the word is its value, use Object.keys() method to obtain the word from the dictionary.
    var wordList = Object.keys(wordDB)
    // Adding each word into the Word class
    for (var i = 0; i < 40; i++) {
        var word = wordList[i]
        var def = wordDB[`${wordList[i]}`]
        WordObjs[i] = new Word(word, def)
    }
    console.log('Database successfully loaded!')

}

// Function for the new Player to input their username(can refer back to here to develop on multi-player profiles)
function buildProf() {
    var name = input.question("What would you like to be called?\t")
    var choice = input.question(`Do you want to be called ${name}? (Type y to confirm)\t`)
    if (choice === "y") {
        console.log(name)
        return name
    }

    else {
        console.log('Let\'s try that again...')
        buildProf()
    }
}

// The 3 lifelines for the player, each ability can only be used once
// *** Needs to figure out how to keep track of used abilities
function abilities(word) {

    var abilitychoice = input.question('Your abilities are:\n1. Show all Vowels\n2. Show the Definition\n3. Skip this word\n\n> ')
    switch (abilitychoice) {
        case '1':
            if (player.abilityPoint[0] == 0) {
                console.log('Oops, you have already used this ability previously')
                abilities()
            }
            else {
                player.abilityPoint[0] = 0
                console.log(word.getVowels())
            }
            break;
        case '2':
            if (player.abilityPoint[1] == 0) {
                console.log('Oops, you have already used this ability previously')
                abilities()
            }
            else {
                player.abilityPoint[1] = 0
                console.log(word.definition)
            }
            break;
        case '3':
            if (player.abilityPoint[2] == 0) {
                console.log('Oops, you have already used this ability previously')
                abilities()
            }
            else {
                player.abilityPoint[2] = 0
                player.wins()
            }
            break;
        default:
            console.log("Please input a valid option.")
            abilities()
    }
}

function lost(WORD){
    // Game over screen, consolidate the player's score and checks if player has a new High-Score
    console.log('\n\n\n\n\n=========\nGame Over\n=========\n')
    console.log(`The word was: ${WORD.word}.`)

    // player.score += 1000
    console.log(`Your Final Score is: ${player.score}`)
    player.checkHscore()
}

// Main Game loop
function gamePlay(WORD, round) {
    // Some variables used to keep track of the rounds, words guesssed
    var guesses = 8
    var guessedWords = []
    var pos = []
    var incorrect = 0
    while (guesses > 0) {
        console.log(`Round ${round}:`)
        
        // Basic statistics such as ROund number, Player current score and number of guesses
        console.log(`${player.name}'s current score is: ${player.score}`)
        console.log(`${player.name}'s number of guesses left: ${guesses}`) 
        // Use username $DEV during debugging/programming phase to reveal statistics of the game.
        if (player.name == "$DEV") {
            console.log("*** " + WORD.word + "***")
        }
        // Used to generate the word
        var secret_word = console.log(WORD.showBlanks(pos))
        
        //Function to draw the Hangman (MOST DIFFICULT PART OF THIS WHOLE PROGRAM)
        console.log(Hangman(incorrect))
        

        // Input control to get input from player
        var choice = input.question(`${player.name}'s guess (Type 0 to exit or 1 for special abilities)\t`)

        // check if player wants to quit the game
        if (choice == 0) {
            guesses = 0

        }
        // Leads to the abilities function
        else if (choice == '1') {
            abilities(WORD)
        }


        // Checking the player's guess
        if (!(WORD.word.includes(choice.toUpperCase()))){
            guesses -= 1
            console.log(`The word does not contain ${choice}`)
            guessedWords.push(choice.toUpperCase())
            incorrect += 1
        }
        else{
            console.log(`The word contains ${choice.toUpperCase()}!`)
            var temp = WORD.check(choice.toUpperCase())
            for (elem in temp){
                pos.push(temp[elem])
            }            
        }

        // Check if word is fully guessed
        if (!(WORD.showBlanks(pos).includes("_"))){
            console.log('\n\n********************************\nYou have guessed the whole word!\n********************************n\n')
            player.wins(WORD.length)
            return "win"
        }

        console.clear()
    }
    
    // Have to Push all these statements into another function
    return "lost"
}

// Instance of class Player
var player = new Player()
// Main Function
function Main() {
    console.log("\n=======================")
    console.log("~~ KS\'s Hangman Game ~~")
    console.log("=======================\n")
    // Initializing the player name into the player object
    player.name = buildProf()
    // Shows the Player's current statistics
    console.log(player.profile())
    console.clear()
    // For loop to loop through the amnt of words for the game
    for (var word = 0; word < 3; word++){
        var game = gamePlay(WordObjs[word], (word + 1))
        if (game == 'lost'){
            lost(WordObjs[word])
            break
        }
    }
    


}

// Run the word processing
getWords()


Main()


