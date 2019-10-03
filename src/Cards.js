import React, {Component} from 'react'
import axios from "axios"
import PrintCardResult from './PrintCardResult';
import DrawingCards from './DrawingCards';
import "./Cards.css"

export default class Cards extends Component{
    constructor(){
        super();
        this.state={
            SPADES: {num: [], face: [], result: []},
            HEARTS: {num: [], face: [], result: []},
            CLUBS: {num: [], face: [], result: []},
            DIAMONDS: {num: [], face: [], result: []},
            Queens: 0,
            deckId: null,
        }
    }
    // STYLE

    componentDidMount(){
        this.getAndSortCards()
    }

    getAndSortCards(){
        // Get the deck of cards shuffled, and draw the first two
        axios.get("https://deckofcardsapi.com/api/deck/new/draw/?count=2").then(res => {
            // Set the deck id for subsequent requests
            this.setState({deckId: res.data.deck_id});
            // Add the two cards to their respective arrays
            this.addCardsToArrays(res);
            // Run an asynchronous function that contains a while loop and a function call
            (async () => {
                // Check our queens counter to see if we still need to make requests
                while(this.state.Queens < 4){
                    // If so, wait for the get cards function to draw two more cards
                    await this.getCards()
                }
                // When we have drawn 4 queens, we sort the arrays
                var suitsArr = ["SPADES", "CLUBS", "HEARTS", "DIAMONDS"]
                // Loop through the array declared above, and sort that object on state
                for(let i = 0; i < suitsArr.length; i ++){
                    // Make a copy of the array
                    let newArr = [...this.state[suitsArr[i]].num]
                    // Sort the copy of the array (this will just be the numbers in the suit)
                    newArr.sort((a, b) => {
                        return a - b
                    })
                    // Now put the face cards in the correct positions in the now sorted numbers array
                    // Ace at the beginning
                    if(this.state[suitsArr[i]].face.includes("ACE")){
                        newArr.unshift("ACE")
                    }
                    // Jack is pushed on to the back first
                    if(this.state[suitsArr[i]].face.includes("JACK")){
                        newArr.push("JACK")
                    }
                    // The queen will always be in the face array, so push that on to the back next
                    newArr.push("QUEEN")
                    // The king is pushed on last
                    if(this.state[suitsArr[i]].face.includes("KING")){
                        newArr.push("KING")
                    }
                    // Now we set state with this updated array, so it can be displayed correctly
                    this.setState((prevState) => {
                        return {[suitsArr[i]]: {...prevState[suitsArr[i]], result: newArr}}
                    })
                }
            })()
        })
    }

    addCardsToArrays(cardArr){
        // Map through the array of two cards
        cardArr.data.cards.map(card => {
            // For each card, add it to its' suits' array
            // If the card value is a number, add it to the num array on the suit object
            if(+card.value){
                this.setState(prevState => {
                    // copy the value of the suits num array and add the new card value to it
                    let newNumArr = [...prevState[card.suit].num, card.value]
                    // Reassign the suit on state to be the copied version of what's already on state, but set the num property to the new array we built above
                    return {[card.suit]: {...prevState[card.suit], num: newNumArr}}
                })
                // If the card value is a Jack, Queen, King or Ace, put it on the face array on the suit object
            } else {
                this.setState(prevState => {
                    let newFaceArr = [...prevState[card.suit].face, card.value]
                    return{[card.suit] : {...prevState[card.suit], face: newFaceArr}}
                })
            }
            // If the card is a queen, add one to the queen counter, which is how we keep track of when to stop running the requests
            if(card.value === "QUEEN"){
                this.setState({Queens: this.state.Queens + 1})
            }
            return card
        })
    }

    getCards(){
        // This promise is returned to make the function asynchronous. Once it resolves, the while loop will stop waiting
        // Set a timeout to make sure we are not making more than one request every 1 second (1000 milliseconds)
        return new Promise(resolve => setTimeout(() => {
            // Draw two more cards, passing the deck id that was saved earlier
            return axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=2`).then(cardArr => {
                // Add the drawn cards to the array
                this.addCardsToArrays(cardArr)
                // When that's done, resolve the proimise so the while loop will stop waiting
                resolve()
            })
        }, 1000))
    }

    drawAgain(){
        this.setState({
            SPADES: {num: [], face: [], result: []},
            HEARTS: {num: [], face: [], result: []},
            CLUBS: {num: [], face: [], result: []},
            DIAMONDS: {num: [], face: [], result: []},
            Queens: 0,
            deckId: null
        })
        this.getAndSortCards()
    }


    render(){
        return(
            <div className="card-container">
                {this.state.Queens < 4 ? 
                <DrawingCards 
                    SPADES={this.state.SPADES}
                    CLUBS={this.state.CLUBS}
                    HEARTS={this.state.HEARTS}
                    DIAMONDS={this.state.DIAMONDS}
                    Queens={this.state.Queens}
                /> : 
                <PrintCardResult 
                    SPADES={this.state.SPADES.result}
                    CLUBS={this.state.CLUBS.result}
                    HEARTS={this.state.HEARTS.result}
                    DIAMONDS={this.state.DIAMONDS.result}
                    drawAgain={() => this.drawAgain()}
                />}
            </div>
        )
    }
}