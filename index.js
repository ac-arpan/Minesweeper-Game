//  web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDl07_YNPYiIuCnXMAJXp3iRnq1eoHICiA",
    authDomain: "mine-sweeper-scorecard.firebaseapp.com",
    databaseURL: "https://mine-sweeper-scorecard.firebaseio.com",
    projectId: "mine-sweeper-scorecard",
    storageBucket: "mine-sweeper-scorecard.appspot.com",
    messagingSenderId: "310669506906",
    appId: "1:310669506906:web:d1f773f5ebde661a79db63"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// reference the scores collection
let scoresRef = firebase.database().ref()


// Picking Up DOM elements
const grid = document.querySelector('.grid')
const flagsContainer = document.querySelector('.flags')
const message = document.querySelector('.message')
const tableBody = document.querySelector('.tbody')
const refresh = document.querySelector('.icon')

// musics
let winAudio = new Audio('./musics/win.mp3')
let bombAudio = new Audio('./musics/bomb.mp3')
let bgAudio = new Audio('./musics/bg.mp3')


let username
let width = 10
let bombAmount = 20
let flags = 0
let squares = []
let isGameOver = false
let scores = {}



// Take user name input
window.addEventListener('load', () => {
    username = prompt('Please enter a username')

    if (!username) username = 'user'
    // console.log(username)

})

// Get the scorecard
 scoresRef.child('scores').on('value', snapshot => {
    if (snapshot.val()) {
            scores = {...snapshot.val()}
            // console.log(scores)
            let expScores = []

            // Array of scores
            Object.keys(scores).forEach(scoreId => expScores.push(scores[scoreId]))

            // Sort the array by desceding order and take first 7 values
            expScores = expScores.sort( (a,b) => a.score < b.score ? 1 : -1).slice(0,7)
            tableBody.innerHTML = ''
            expScores.map(score => {
                let tableRow = `<tr>
                                    <td>${score.username}</td>
                                    <td>${score.score}</td>
                                </tr>`
                
                tableBody.innerHTML += tableRow
            })

     }
 })

// Refresh page
refresh.addEventListener('click', () => {
    window.location.reload(0,0)
})

// Create Board Function
function createBoard() {

    // Get the shuffled game array with random bomb
    const bombArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width * width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)  // shuffling logic ;)

    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', i)
        square.classList.add(shuffledArray[i])
        grid.appendChild(square)

        squares.push(square)

        // Normal Click(Left Click)
        square.addEventListener('click', e => {
            click(square)
        })

        // Right Click
        square.oncontextmenu = function (e) {
            e.preventDefault()
            addFlag(square)
        }
    }



    // Add total numbers of bombs in the neighbourghing squares(east,west,north,south,north-east,north-west,south-east,south-west) to the valid squares

    for (let i = 0; i < squares.length; i++) {
        let total = 0
        const isLeftEdge = i % width === 0            // 0%10 = 0, 10%10 = 0, 20%10 = 0,......,90%10 = 0....
        const isRightEdge = i % width === width - 1  // 9%10 = 9, 19%10 = 9, 29%10 = 9,......, 99%10 = 9 ...[9 = 10 - 1 = width - 1]

        if (squares[i].classList.contains('valid')) {
            // Chechking the left(west) square for a bomb
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {
                total++
            }
            // Chechking the top-right(north-east) sqaure for a bomb
            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) {
                total++
            }
            // Checking the top(north) square for a bomb
            if (i >= 10 && squares[i - width].classList.contains('bomb')) {
                total++
            }
            // Chechking the top-left(north-west) square for a bomb
            if (i >= 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) {
                total++
            }
            // Checking the right(east) square for a bomb
            if (i <= 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) {
                total++
            }
            // Chechking the bottom-left(south-west) square for a bomb
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) {
                total++
            }
            // Chechking the bottom-right(south-east) square for a bomb
            if (i <= 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) {
                total++
            }
            // Chechking the down(south) square for a bomb
            if (i <= 89 && squares[i + width].classList.contains('bomb')) {
                total++
            }

            squares[i].setAttribute('data', total)


        }

    }


}

// Invoke createBoard
createBoard()

// Add flag with right click
function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
            square.classList.add('flag')
            square.innerHTML = '&#128681;'
            flags++
            flagsContainer.innerHTML = `${20 - flags}`
            checkForWin()
        } else {
            square.classList.remove('flag')
            square.innerHTML = ' '
            flags--
            flagsContainer.innerHTML = `${20 - flags}`
        }

    }
    else if (!square.classList.contains('checked') && (flags == bombAmount)) {
        if (square.classList.contains('flag')) {
            square.classList.remove('flag')
            square.innerHTML = ' '
            flags--
            flagsContainer.innerHTML = `${20 - flags}`
        }
    }

}

// Click on square actions
function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return

    if (square.classList.contains('bomb')) {
        gameOver(square)
    } else {
        let total = square.getAttribute('data')
        if (total != 0) {
            square.classList.add('checked')
            if (total == 1) square.classList.add('one')
            if (total == 2) square.classList.add('two')
            if (total == 3) square.classList.add('three')
            if (total == 4) square.classList.add('four')
            if (total == 5) square.classList.add('five')
            if (total == 6) square.classList.add('six')
            if (total == 7) square.classList.add('seven')
            if (total == 8) square.classList.add('eight')
            square.innerHTML = total
            return
        }
        checkSquare(square, currentId)
        square.classList.add('checked')
    }


}

// Check the neighbouring squares once one square is clicked, recursion is going on here
function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0
    const isRightEdge = currentId % width === width - 1

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > 9 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId >= 10) {
            const newId = squares[parseInt(currentId) - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId >= 11 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1 - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId <= 98 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < 90 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId <= 88 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId <= 89) {
            const newId = squares[parseInt(currentId) + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
    }, 10)
}


// gaveOver Function
function gameOver(square) {
    // console.log('BOOM! Game Over...')
    bombAudio.play()
    message.innerHTML = 'BOOM! Game Over!'
    message.style.fontSize = '30px'
    message.style.color = 'red'
    isGameOver = true

    //show all the bomb location
    squares.forEach(square => {
        if (square.classList.contains('bomb')) {
            square.innerHTML = '&#128163;'
            square.style.boxShadow = `inset 6px 6px 10px 0 rgba(0, 0, 0, 0.2),
            inset -6px -6px 10px 0 rgba(255, 255, 255, 0.5)`
            square.style.border = 'none'
        }
    })

    // get the flagged bomb number
    let matches = 0
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches++
        }
    }
    // Create the user's scorecard
    let obj = {
        username: username,
        score: matches
    }
    // add the score to the database
    scoresRef.child('scores').push(obj, err => err ? console.log(err) : '')
}

// Check for the win
function checkForWin() {
    let matches = 0
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches++
        }
        if (matches === bombAmount) {
            winAudio.play()
            message.innerHTML = "You WON!"
            message.style.fontSize = '40px'
            message.style.color = 'green'
            isGameOver = true

            let obj = {
                username: username,
                score: 20
            }
            scoresRef.child('scores').push(obj, err => err ? console.log(err) : '')
        }
    }
}