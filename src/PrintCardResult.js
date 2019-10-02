import React from 'react'

export default function PrintCardResult(props){
    var printOutArray = (suit) => {
        return props[suit].map(card => {
            return(
                <p>{card}</p>
            )
        })
    }
    return(
        <div>
            <h1>We've drawn all four queens!</h1>
            <div>{printOutArray("SPADES")} Spades</div>
            <div>{printOutArray("CLUBS")} Clubs</div>
            <div>{printOutArray("HEARTS")} Hearts</div>
            <div>{printOutArray("DIAMONDS")} Diamonds</div>
        </div>
    )
}