import { useState, useEffect } from "react"
import "./App.css"

export default function App(){

const [tab,setTab] = useState("home")

const [ballY,setBallY] = useState(0)
const [velocity,setVelocity] = useState(0)

const [obstacleX,setObstacleX] = useState(600)

const [coinX,setCoinX] = useState(350)
const [showCoin,setShowCoin] = useState(true)

const [score,setScore] = useState(0)

const [coins,setCoins] = useState(
Number(localStorage.getItem("coins")) || 0
)

const [highScore,setHighScore] = useState(
Number(localStorage.getItem("highscore")) || 0
)

const [gameOver,setGameOver] = useState(false)

const gravity = -0.7
const baseSpeed = 6
const speed = baseSpeed + Math.floor(score / 10)

function jump(){

if(tab !== "play") return
if(gameOver) return

setVelocity(12)

}

useEffect(()=>{

function handleTouch(){
jump()
}

window.addEventListener("touchstart",handleTouch)

return ()=>window.removeEventListener("touchstart",handleTouch)

})

useEffect(()=>{

const loop = setInterval(()=>{

if(tab !== "play") return
if(gameOver) return

// BALL PHYSICS
setBallY(prev=>{

let newY = prev + velocity
let newVel = velocity + gravity

setVelocity(newVel)

if(newY <= 0){
newY = 0
}

return newY

})

// MOVE OBSTACLE
setObstacleX(prev=>{

let newX = prev - speed

if(newX < -40){

setScore(s=>s+1)

return 700

}

return newX

})

// MOVE COIN
setCoinX(prev=>{

let newX = prev - speed

if(newX < -30){

setShowCoin(true)
return 750

}

return newX

})

// COIN COLLISION
if(coinX < 140 && coinX > 80 && ballY > 40 && showCoin){

setCoins(c=>{

let newCoins = c + 5
localStorage.setItem("coins",newCoins)
return newCoins

})

setShowCoin(false)

}

// OBSTACLE COLLISION
if(obstacleX < 140 && obstacleX > 80 && ballY < 40){

setGameOver(true)

let newHigh = Math.max(score,highScore)

setHighScore(newHigh)

localStorage.setItem("highscore",newHigh)

}

},30)

return ()=>clearInterval(loop)

},[velocity,ballY,obstacleX,coinX,score,tab,gameOver])

function startGame(){

setTab("play")
setScore(0)
setGameOver(false)
setBallY(0)
setObstacleX(600)

}

function restart(){
startGame()
}

return(

<div className="app">

{/* HOME */}

{tab==="home" && (

<div className="menu">

<h1>Ball Jump</h1>

<p>Coins: {coins}</p>

<button onClick={startGame}>
Play
</button>

<button onClick={()=>setTab("leaderboard")}>
Leaderboard </button>

<button onClick={()=>setTab("privacy")}>
Privacy Policy </button>

</div>

)}

{/* GAME */}

{tab==="play" && (

<div className="game" onClick={jump}>

<div className="background"></div>

<div className="topbar">

<span>Score: {score}</span>

<span>Coins: {coins}</span>

</div>

<div
className="ball"
style={{bottom:ballY}}
></div>

<div
className="obstacle"
style={{left:obstacleX}}
></div>

{showCoin && (

<div
className="coin"
style={{left:coinX}}
></div>

)}

{gameOver && (

<div className="gameover">

<h2>Game Over</h2>

<p>Score: {score}</p>

<button onClick={restart}>
Restart
</button>

</div>

)}

</div>

)}

{/* LEADERBOARD */}

{tab==="leaderboard" && (

<div className="menu">

<h2>Leaderboard</h2>

<p>High Score: {highScore}</p>

<button onClick={()=>setTab("home")}>
Back </button>

</div>

)}

{/* PRIVACY */}

{tab==="privacy" && (

<div className="privacy">

<h2>Privacy Policy</h2>

<p>
Ball Jump does not collect personal information.
</p>

<p>
Game data like score and coins are stored locally on your device.
</p>

<p>
No personal data such as name, email, or location is collected.
</p>

<button
onClick={() =>
window.open("/privacy-policy.html")
}
>
View Full Privacy Policy
</button>

<button onClick={()=>setTab("home")}>
Back
</button>

</div>

)}

{/* NAVBAR */}

<div className="navbar">

<button onClick={()=>setTab("home")}>
Home </button>

<button onClick={()=>setTab("play")}>
Play </button>

<button onClick={()=>setTab("leaderboard")}>
Leaderboard </button>

<button onClick={()=>setTab("privacy")}>
Privacy </button>

</div>

</div>

)

}
