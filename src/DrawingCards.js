import React from 'react'
import "./PrintCardResult.css"

export default function DrawingCards(props){
    return(
        <div className="card-results">
            <h1>Drawing...</h1>
            <div>
                <p>We have drawn:</p>
                <p>{props.SPADES.num.length + props.SPADES.face.length} Spades</p>
                <p>{props.CLUBS.num.length + props.CLUBS.face.length} Clubs</p>
                <p>{props.HEARTS.num.length + props.HEARTS.face.length} Hearts</p>
                <p>{props.DIAMONDS.num.length + props.DIAMONDS.face.length} Diamonds</p>
                <p>And {props.Queens} Queens</p>
            </div>
        </div>
    )
}