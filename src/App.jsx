import {useState} from 'react'
import './app.css'


function Square({value,onSquareClick,winningSquare}){  
    let squareWinnerStyle = ''
    if(winningSquare){
        squareWinnerStyle = 'squareHighlight'
    }
    
    return (
        <button className={'square '+ squareWinnerStyle} onClick={onSquareClick}>{value} </button>
    );
}

function Board({ xIsNext, squares, onPlay}){ 
    
    let winner = calculateWinner(squares);
    const arrStatus = (element) => element !== null;
    let status
    if(winner){
        status = 'winner:'+ winner.next;
    }else if(!winner && squares.every(arrStatus)){
        status = 'draw';
    }else{
        status = 'next player: '+(xIsNext ?'X':'O')
    }

    
    
    function handleClick(i) {

        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        const nextValue = xIsNext ? 'X' : 'O';

        nextSquares[i] = nextValue;
        onPlay(nextSquares, i);
    }

    
    let winningSquare = false;
    const row = [];
    for(let i = 0;i<3;i++){
        const column = [];
        row.push(<div className={'board-row'}>{column}</div>)
        for(let j = 0;j< 3;j++){
            const squareIndex = i * 3 + j;
            if(winner){
                winningSquare = winner.lines.some((winnerValue)=>{
                return squareIndex === winnerValue
            })
            }
            column.push(<Square value={squares[squareIndex]}
                key={squareIndex} 
                onSquareClick ={() => handleClick(squareIndex)}
                winningSquare={winningSquare}
            />)
        }
    }

    


    return(
        <> 
            <div className="status">{status}</div>
            {row}
        </>
        
    ); 
}

export default function Game() {
    const [history, setHistory] = useState([{
        moveNumber: 0,
        squares: Array(9).fill(null),
        position: null
        }]
    );
    const [currentMove, setCurrentMove] = useState(0);
    const [forwardDirection, setForwardDirection] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    
    const currentSquares = history[currentMove]?.squares;

    function handlePlay(nextSquares, currentMoveIndex) {
        const nextMove = {
            moveNumber: currentMove+1,
            squares: nextSquares,
            position: {
                x: (currentMoveIndex % 3),
                y: Math.floor(currentMoveIndex / 3) +1
            }
        }
        const nextHistory = [
            ...history.slice(0, currentMove + 1), nextMove
        ];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length-1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove)
    }
    console.log(history)
    const moves = history.map((currentMoveSet, historyIndex, historyArray) => {
        let description;
        let squareToDisplay = currentMoveSet;
        if (!forwardDirection) {
            const reversedIndex = historyArray.length - historyIndex -1;
            squareToDisplay = historyArray[reversedIndex];
        }
        let location = '';
        if (currentMoveSet.position) {
            location = `(COLUMN:${currentMoveSet.position.x+1}, ROW:${currentMoveSet.position.y})`
        }
        const move = squareToDisplay.moveNumber
        if (currentMove === move) {
            description = `You are at move ${move} ${location}`;
        } else {
            if (move > 0) {
                description = `Go to Move # ${move} ${location}`;
            } else {
                description = 'Go to Game Start';
            }
            description = <button onClick={() => jumpTo(move)}>{description}</button>
        }
        return (
            <li key={move}>
                {description}
            </li>
        )
    })



    function onReverseMoveDisplayRequest() {
        console.log('in on reverse move display request')
        setForwardDirection(!forwardDirection);
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}/>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
                <button className = "reverse-button"onClick={onReverseMoveDisplayRequest}>Reverse Move Display</button>
            </div>
        </div>

    )
}


function calculateWinner(squares){


    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]


    for(let i = 0; i<lines.length;i++){
        const [a,b,c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            console.log(lines[i])
            return {
                lines:lines[i],
                next:squares[a]
            }
        }
    }
    return null;
}
