import React from 'react'

export default function DrawingCards(props){
    return(
        <div>
            <h1>Drawing...</h1>
            <p>We have drawn:</p>
            <p>{props.SPADES.num.length + props.SPADES.face.length} Spades</p>
            <p>{props.CLUBS.num.length + props.CLUBS.face.length} Clubs</p>
            <p>{props.HEARTS.num.length + props.HEARTS.face.length} Hearts</p>
            <p>{props.DIAMONDS.num.length + props.DIAMONDS.face.length} Diamonds</p>
            <p>And {props.Queens} Queens</p>
        </div>
    )
}