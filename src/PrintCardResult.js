import React from 'react'
import "./PrintCardResult.css"

export default function PrintCardResult(props){
    var printOutArray = (suit) => {
        return props[suit].map((card, i) => {
            return(
                <div key={i}>
                    <img src={card.image} alt="Card"/>
                    <p>{typeof card.value === "string" ? card.value.toLowerCase() : card.value}</p>
                </div>
            )
        })
    }
    return(
        <div className="card-results">
            <h1>We've drawn all four queens!</h1>
            <div>
                <div>
                    <h4>Spades: </h4>
                    {printOutArray("SPADES")} 
                </div>
                <div>
                    <h4>Clubs: </h4>
                    {printOutArray("CLUBS")} 
                </div>
                <div>
                    <h4>Hearts: </h4>
                    {printOutArray("HEARTS")} 
                </div>
                <div>
                    <h4>Diamonds: </h4>
                    {printOutArray("DIAMONDS")} 
                </div>
            </div>
            <button onClick={() => props.drawAgain()}>
                <h4>Draw Again</h4>
            </button>
        </div>
    )
}