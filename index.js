// Picking Up DOM elements
const grid = document.querySelector('.grid')
const flagsContainer = document.querySelector('.flags')
const message = document.querySelector('.message')

let width = 10
let bombAmount = 20
let flags = 0
let squares = []
let isGameOver = false


// Create Board Function
function createBoard() {

    // Get the shuffled game array with random bomb
    const bombArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombArray)
    const shuffledArray = gameArray.sort( () => Math.random() - 0.5)

    for(let i = 0; i < width*width ; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', i)
        // square.textContent = i
        square.classList.add(shuffledArray[i])
        grid.appendChild(square)

        squares.push(square)

        // Normal Click
        square.addEventListener('click', e => {
            click(square)
        })

        // Right Click
        square.oncontextmenu = function (e){
            e.preventDefault()
            addFlag(square)
        }
    }



    // Add total numbers of bombs in the neighbourghing squares(east,west,north,south,north-east,north-west,south-east,south-west) to the valid squares

    for(let i = 0 ;  i < squares.length ; i++) {
        let total = 0
        const isLeftEdge = i % width === 0            // 0%10 = 0, 10%10 = 0, 20%10 = 0,......,90%10 = 0....
        const isRightEdge = i % width === width - 1  // 9%10 = 9, 19%10 = 9, 29%10 = 9,......, 99%10 = 9 ...[9 = 10 - 1 = width - 1]
        
        if(squares[i].classList.contains('valid')) {
            // Chechking the left(west) square for a bomb
            if(i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) {
                total++
            }
            // Chechking the top-right(north-east) sqaure for a bomb
            if(i > 9 && !isRightEdge && squares[i+1 - width].classList.contains('bomb')) {
                total++
            }
            // Checking the top(north) square for a bomb
            if( i >= 10 && squares[i - width].classList.contains('bomb')) {
                total++
            }
            // Chechking the top-left(north-west) square for a bomb
            if( i >= 11 && !isLeftEdge && squares[i-1-width].classList.contains('bomb')){
                total++
            }
            // Checking the right(east) square for a bomb
            if( i <= 98 && !isRightEdge && squares[i+1].classList.contains('bomb')){
                total++
            }
            // Chechking the bottom-left(south-west) square for a bomb
            if( i < 90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb')){
                total++
            }
            // Chechking the bottom-right(south-east) square for a bomb
            if( i <= 88 && !isRightEdge && squares[i+1+width].classList.contains('bomb')){
                total++
            }
            // Chechking the down(south) square for a bomb
            if( i <= 89 && squares[i+width].classList.contains('bomb')){
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
    if(isGameOver) return
    if(!square.classList.contains('checked') && (flags < bombAmount)) {
        if(!square.classList.contains('flag')) {
            square.classList.add('flag')
            square.innerHTML = '&#128681;'
            flags++
            flagsContainer.innerHTML = `${20-flags}`
            checkForWin()
        } else {
            square.classList.remove('flag')
            square.innerHTML = ' '
            flags--
            flagsContainer.innerHTML = `${20-flags}`
        }

    }
    else if(!square.classList.contains('checked') && (flags == bombAmount)) {
        if(square.classList.contains('flag')) {
            square.classList.remove('flag')
            square.innerHTML = ' '
            flags--
            flagsContainer.innerHTML = `${20-flags}`
        }
    }
    
}

// Click on square actions
function click(square) {
    let currentId = square.id
    if(isGameOver) return
    if(square.classList.contains('checked') || square.classList.contains('flag')) return

    if(square.classList.contains('bomb')) {
        gameOver(square)
    } else {
        let total = square.getAttribute('data')
        if(total != 0) {
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

// Check th neighbouring squares once one square is clicked
function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0
    const isRightEdge = currentId % width === width - 1

    setTimeout(() => {
        if( currentId > 0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if( currentId > 9 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if( currentId >= 10) {
            const newId = squares[parseInt(currentId) - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if( currentId >= 11 && !isLeftEdge){
            const newId = squares[parseInt(currentId) - 1 - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if( currentId <= 98 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if( currentId < 90 && !isLeftEdge ) {
            const newId = squares[parseInt(currentId) -1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if( currentId <= 88 && !isRightEdge ) {
            const newId = squares[parseInt(currentId) +1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if( currentId <= 89 ) {
            const newId = squares[parseInt(currentId)  + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
    }, 10)
}


// gaveOver Function
function gameOver(square) {
    // console.log('BOOM! Game Over...')
    message.innerHTML = 'BOOM! Game Over!'
    message.style.fontSize='30px'
    message.style.color='red'
    isGameOver = true

    //show all the bomb location
    squares.forEach(square => {
        if( square.classList.contains('bomb')) {
            square.innerHTML = '&#128163;'
        }
    })
}

// Check for the win
function checkForWin() {
    let matches = 0
    for(let i = 0; i < squares.length ; i++) {
        if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches++
        }
        if(matches === bombAmount) {
            message.innerHTML="You WON!"
            message.style.fontSize='40px'
            message.style.color='green'
            isGameOver = true
        }
    }
}