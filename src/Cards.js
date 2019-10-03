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
                        return a.value - b.value
                    })
                    // Now put the face cards in the correct positions in the now sorted numbers array
                    // First we make a copy of the array on state we want to alter
                    let orderedFaceArr = [...this.state[suitsArr[i]].face]
                    // Now we sort it alphabetically. If the array had all the face cards, it would sort: ace, jack, king, queen
                    orderedFaceArr.sort((a, b) => {
                        if(a.value < b.value){
                            return -1
                        }
                        if(a.value > b.value){
                            return 1
                        }
                        return 0
                    })
                    // If the first value in the sorted array is an ace, it goes straight on the front of the ordered array containing the numbers, and then we take if off the array we are currently altering
                    if(orderedFaceArr[0].value === "ACE"){
                        let card = orderedFaceArr.shift()
                        newArr.unshift(card)
                    }
                    // If the first value now or to start with in the sorted face cards array is a jack, that goes straight on the end of the ordered numbers array, and is taken off the array we are currently altering
                    if(orderedFaceArr[0].value === "JACK"){
                        newArr.push(orderedFaceArr[0])
                        orderedFaceArr.shift()
                    }
                    // If the first value now or to start with in the sorted face cards array is a king, we put the queen on the sorted numbers array first (because we know there will always be a queen), and then put the king on the end
                    if(orderedFaceArr[0].value === "KING"){
                        newArr.push(orderedFaceArr[1])
                        newArr.push(orderedFaceArr[0])
                        // If the first value now or to start with in the sorted face cards is array is actually a queen, then there is no king, so we just put the queen on the back of the sorted numbers array
                    } else if(orderedFaceArr[0].value === "QUEEN"){
                        newArr.push(orderedFaceArr[0])
                    }
                    // Now we set state with this updated array, so it can be displayed correctly
                    this.setState((prevState) => {
                        return {[suitsArr[i]]: {...prevState[suitsArr[i]], result: [...newArr]}}
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
                    // Copy the value of the suits num array and add the new card value to it
                    let newNumArr = [...prevState[card.suit].num, card]
                    // Reassign the suit on state to be the copied version of what's already on state, but set the num property to the new array we built above
                    return {[card.suit]: {...prevState[card.suit], num: newNumArr}}
                })
                // If the card value is a Jack, Queen, King or Ace, put it on the face array on the suit object
            } else {
                this.setState(prevState => {
                    let newFaceArr = [...prevState[card.suit].face, card]
                    return{[card.suit]: {...prevState[card.suit], face: newFaceArr}}
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