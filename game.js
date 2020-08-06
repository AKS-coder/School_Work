var input = require('readline-sync')
var wordDB = require('./dictionary.json')
var fs = require('fs');
var userData = {}

// Importing the JSON file that contains the Word and definition
/*
url: https://github.com/matthewreagan/WebstersEnglishDictionary
Original repository and Julia script provided by https://github.com/adambom/dictionary
Webster's Unabridged English Dictionary provided by Project Gutenberg
The original dictionary text file is covered by The Gutenberg Project's licensing,
please see the file headers for more details.
The Swift parsing tool and example output files in this repository are free and distributed under the GNU General Public License, Version 2.
*/

class Word{
    constructor(word, definition){
        this.word = word.toUpperCase()
        this.def = definition
        this.char = this.word.split("")
    }

    getWord(){
        return this.word
    }
    define(){
        return `The definition of the word is: ${this.def}.`
    }

    getVowels(){
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
            if (arr.includes(letters)) {
                printedStr += `${this.char[letters]} `
                // process.stdout.write(this.char[letters] + " ")
            }
            else if (this.char[letters] == "-") {
                printedStr += "- "
            }
            else if (this.char[letters] == " "){
                printedStr += " "
            }
            else {
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
        for (var i = 0; i < this.char.length; i++) {
            if (this.char[i] === guess) {
                indices.push(i.toString())
            }
        }

        return indices
    }

}

class WordCollection{
    constructor(){
        this.WordObjs = []
    }

    loadWords(){
        console.log('Loading word Database...')
        var wordList = Object.keys(wordDB)
        for (var index = 0; index < 100; index++){
            var word = wordList[index]
            var definition = wordDB[`${wordList[index]}`]
            this.WordObjs[index] = new Word(word, definition)
        }
        if (wordList.length <= 1){
            return "\n*****Import error. Word bank empty.*****\n"
        }
        else{
            return "Success"
        }
    }

    getWords(){
        var startpoint = Math.round((Math.random()* 50) + 20)

        var gameWords = []
        // Used to control amount of rounds(words) per game
        var amntOfWordsEachGame = 3
        for (var word = startpoint; word < startpoint + amntOfWordsEachGame; word++){
            gameWords.push(this.WordObjs[word])
        }
        return gameWords
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
        this.lvl = Math.floor(this.lvl * 1.2)
    }

    abilities(){
        var abilityOneUse = (this.abilityPoint[0] == 0) ? "[Used]" : "[Available]"
        var abilityTwoUse = (this.abilityPoint[1] == 0) ? "[Used]" : "[Available]"
        var abilityThreeUse = (this.abilityPoint[2] == 0) ? "[Used]" : "[Available]"
        console.log(`Your abilities are:\n1. Show all vowels\t${abilityOneUse}\n2. Show word definition\t${abilityTwoUse}\n3. Skip the word and move on\t${abilityThreeUse}\n4. Back`)
        var abilityChoice = input.questionInt("> ")
        switch (abilityChoice){
            case 1:
                return "vowels"
            case 2:
                return"define"
            case 3:
                return"skip"
            default:
                return"Please choose a valid option."
                
        }
    }

}



function leaderBoard(){
    let rawData = fs.readFileSync("leaderBoard.json")
    let players = JSON.parse(rawData)
    for (var player in players){
        console.log("JSON content: " + player)
        
    }
}


function saveData(){
    var dataName = player.name
    var dataScore = player.Hscore
    userData = {
        dataName : dataScore,
    }
    var dictStr = JSON.stringify(userData)
    fs.writeFile("leaderBoard.json", dictStr, function (err, result) {
        if (err) console.log('error', err);
    });
    console.log('Data successfully saved...')
}



function alphaBank(arr) {
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    if (arr.length != 0) {
        for (var value = 0; value < arr.length; value++) {
            var guessedLetter = arr[value]
            for (var j = 0; j < letters.length; j++) {
                if (letters[j] == guessedLetter) {
                    letters[j] = " "
                }
            }
        }
    }
    console.log('\nUsed words:')
    for (var i = 0; i < 13; i++) {
        process.stdout.write(`${letters[i]} `)
    }
    console.log('')
    for (var z = 13; z < letters.length; z++) {
        process.stdout.write(`${letters[z]} `)
    }
    console.log('')
}


function lost(WORD) {
    console.clear()
    // Game over screen, consolidate the player's score and checks if player has a new High-Score
    console.log('\n\n\n\n\n=========\nGame Over\n=========\n')
    console.log(`The word was: ${WORD.word}.`)

    console.log(`Your Final Score is: ${player.score}`)
    player.checkHscore()
}


// Function to draw Hangman
function Hangman(round) {
    var hangman = [
        `
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


function game(WORD) {
    var round = 1
    var guesses = 8
    var guessedWords = []
    var pos = []
    var incorrect = 0
    while(guesses > 0){
        // console.clear()
        console.log('-------------------------------------------')
        console.log(`Round ${round}:`)

        // Basic statistics such as ROund number, Player current score and number of guesses
        console.log(`${player.name}'s current score is: ${player.score}`)
        console.log(`${player.name}'s number of guesses left: ${guesses}`) 

        // Use username $DEV during debugging/programming phase to reveal statistics of the game.
        if (player.name == "$DEV") {
            console.log("*** " + WORD.word + " ***")
        }

        var secret_word = console.log(WORD.showBlanks(pos))

        console.log(Hangman(incorrect))
        
        var alpabetBank = alphaBank(guessedWords)

        // Input control to get input from player
        var choice = input.question(`${player.name}'s guess (Type 0 to exit or 1 for special abilities)\t`)

        // Using Regular Expression to test input to filter out unwanted inputs.
        var regalpha = /^[A-Za-z]+$/
        var reg = /^\d+$/
        if (reg.test(choice)) {
            // check if player wants to quit the game
            if (choice == 0) {
                guesses = 0
            }
            // Leads to the abilities function
            else if (choice == '1') {
                // Will direct to player Class to handle the picking of the relevant abilities
                var abilityChoice = player.abilities()
                if (abilityChoice == "vowels"){
                    if (player.abilityPoint[0] == 0){
                        console.log('You have used this ability already.')
                        
                    }
                    else{
                        player.abilityPoint[0] = 0
                        console.log(WORD.getVowels())
                    }
                    
                }
                else if (abilityChoice == "define"){
                    if (player.abilityPoint[1] == 0) {
                        console.log('You have used this ability already.')

                    }
                    else{
                        player.abilityPoint[1] = 0
                        console.log(WORD.def)
                    }
                    
                }
                else if (abilityChoice == "skip"){
                    if (player.abilityPoint[2] == 0) {
                        console.log('You have used this ability already.')

                    }
                    else{
                        player.abilityPoint[2] = 0
                        for (var char = 0; char < WORD.word.length; char++) {
                            guessedWords.push(WORD.word[char].toUpperCase())
                        }
                    }
                    
                }
                else{
                    console.log(abilityChoice)
                    
                } 
            }
        }
        
        else if (regalpha.test(choice) && (choice.length < 2)){
            // Checking the player's guess
            if (!(WORD.word.includes(choice.toUpperCase()))) {
                guesses -= 1
                console.log(`The word does not contain ${choice}`)
                guessedWords.push(choice.toUpperCase())
                incorrect += 1
            }
            else {
                console.log(`The word contains ${choice.toUpperCase()}!`)
                guessedWords.push(choice.toUpperCase())
                var temp = WORD.check(choice.toUpperCase())
                for (elem in temp) {
                    pos.push(temp[elem])
                }
            }

            // Check if word is fully guessed
            if (!(WORD.showBlanks(pos).includes("_"))) {
                console.log('\n\n********************************\nYou have guessed the whole word!\n********************************n\n')
                player.wins(WORD.word.length)
                round += 1
                return "win"
            }
        }

        
    }
    round += 1
    return "lost"
}

var player = new Player()
function main(){
    // leaderBoard()
    // Initialize a new wordCollection at the start of the game
    var gameplay = new WordCollection()
    console.log(gameplay.loadWords())
    
    console.log("\n=======================")
    console.log("~~ KS\'s Hangman Game ~~")
    console.log("=======================\n")

    player.name = input.question("What would you like to be called?\t")
    
    console.clear()
    var listOfWords = gameplay.getWords()
    for (var word in listOfWords){
        var gameStatus = game(listOfWords[word])
        if (gameStatus == 'lost'){
            lost(listOfWords[word])
            break
        }
        else if (gameStatus == 'win'){
            console.log("Congrats! You've won!!")
            player.checkHscore()
            console.log(`Your Final Score is: ${player.score}`)
        }
        // player.win()
    }
    saveData()
    // console.log(gameplay.getWords())
    
}







main()

