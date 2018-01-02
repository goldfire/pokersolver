## Description
pokersolver is a poker hand solver and comparison tool written in Javascript. It was written for and is being used in production on [**CasinoRPG**](http://casinorpg.com), an HTML5 MMORPG that features Texas Hold'em as one of its main casino games. It is designed for use on either the client (browser) or the server (Node.js). This library is capable of:

* Evaluating a hand of up to 7 cards
* Calculating the score of the hand (0-9)
* Returning the name of the hand (Pair, Flush, etc)
* Returning a detailed description (Two Pair, A's & 8's)
* Comparing an array of hands and returning the winner(s)
* Identifying all cards involved in creating the winning hand
* Support for wilds and other game types
* Works in both the browser and Node.js

## Installation
```
npm install pokersolver
```

## Examples
#### Server Usage
```javascript
var Hand = require('pokersolver').Hand;
```

#### Browser Usage
```javascript
<script src="/path/to/pokersolver.js"></script>
<script>
  var hand = Hand.solve(['...']);
  ...
</script>
```

Solve two hands and then determine the winner between the two of them.
```javascript
var hand1 = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', '3c', 'Kd']);
var hand2 = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd']);
var winner = Hand.winners([hand1, hand2]); // hand2
```

Solve a hand and return the type and the description.
```javascript
var hand = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd']);
console.log(hand.name); // Two Pair
console.log(hand.descr); // Two Pair, A's & Q's
```

## API
### Hand Methods
#### solve(cards, game, canDisqualify)
Solves the hand passed in, whether 3 cards or 7. Returns various information such as name, description, score and cards involved.
* **cards**: `Array` All cards involved in the hand, example: `['Ad', '2d', '3d', '4d', 'Qc', 'Ks', '7h']`. Note that a `10` should be passed as a `T` (`Th` for example).
* **game**: `String` Which rule set is used, based on the game being played. Default: 'standard'
* **canDisqualify**: `Boolean` Is this hand subject to qualification rules, which some games have? Default: false

#### winners(hands)
Compare the passed hands and determine which is the best hand(s). Can return multiple if there is a tie.
* **hands** `Array` All hands solved with `Hand.solve` that should be compared.

#### toString()
Returns a formatted string of all cards involved in the identified hand type (maximum of 5 cards).

### Solved Hand Properties
#### cardPool `Array`
All of the cards passed into the hand.
#### cards `Array`
All of the cards involved in the identified hand type.
#### descr `String`
Detailed description of the identified hand type (`Two Pair, A's & Q's` for example).
#### name `String`
Type of hand identified (`Two Pair` for example).
#### rank `Number`
Ranking of the hand type (Varies from game to game; 0 being the lowest hand).

### PaiGowPokerHelper Methods
#### solve(cards)
Solves the hand passed in, sets it according to House Way, and solves both hands.
* **cards**: `Array` All cards involved in the hand, example: `['Ad', '2d', '3d', '4d', 'Qc', 'Ks', '7h']`.

#### setHands(hiHand, loHand)
Sets the hands according to the input, and solves both hands.
* **hiHand** `Array` Five cards involved in the high hand, example: `['Ad', '2d', '3d', '4d', '7h']`.
* **loHand** `Array` Two cards involved in the low hand, example: `['Qc', 'Ks']`.

#### winners(player, banker)
Compare the passed PaiGowPokerHelper hands and determine who wins. 1 = Player, -1 = Banker, 0 = Push.
* **player** `PaiGowPokerHelper` Non-banking hand solved with `PaiGowPokerHelper.solve` or `PaiGowPokerHelper.setHands`.
* **banker** `PaiGowPokerHelper` Banking hand solved with `PaiGowPokerHelper.solve` or `PaiGowPokerHelper.setHands`.

### Solved PaiGowPokerHelper Properties
#### baseHand `Hand`
All of the cards passed into the helper, run against `Hand.solve`.
#### hiHand `Hand`
Five card high hand, whether calculated or passed into the helper, run against `Hand.solve`.
#### loHand `Hand`
Two card low hand, whether calculated or passed into the helper, run against `Hand.solve`.

### Games Available
#### standard
Useful for Texas Hold'em, Seven Card Stud, Five Card Draw, and other Standard Poker Games.
#### jacksbetter
Useful for Jacks or Better Video Poker. Use qualification to determine if a hand is a Pair of Jacks or better.
#### joker
Useful for Joker Video Poker. Jokers are notated as `'Or'` and may be anything. Qualification: Kings or better.
#### deuceswild
Useful for Deuces Wild Video Poker. Deuces may be anything. Hands lower than Three of a Kind are `High Card` and not paying hands.
#### threecard
Useful for Three Card Poker. Qualification: Dealer must have Queen High or better.
#### fourcard
Useful for Four Card Poker. No qualifying hand.
#### fourcardbonus
Useful for calculating the Aces Up Bonus for Four Card Poker. Qualification: Pair of Aces or better.
#### paigowpokerfull
HELPER GAME: Used by `PaiGowPokerHelper` to create a hand that will eventually be split.
#### paigowpokeralt
HELPER GAME: Used by `PaiGowPokerHelper` on a straight and/or flush to create another possible hand.
#### paigowpokersf6
HELPER GAME: Used by `PaiGowPokerHelper` to determine if a six-card straight and/or flush is possible.
#### paigowpokersf7
HELPER GAME: Used by `PaiGowPokerHelper` to determine if a seven-card straight and/or flush is possible.
#### paigowpokerhi
Useful for Pai Gow Poker's High Hand. A2345 is the second highest straight. One joker in the deck as `'Or'`; it may be used to complete a straight and/or flush, else is counted as an Ace.
#### paigowpokerlo
Useful for Pai Gow Poker's Low Hand. One joker in the deck as `'Or'`; it is counted as an Ace.

## Testing
```
npm install
npm test
```

## License
Copyright (c) 2016 James Simpson and GoldFire Studios, Inc.

Released under the MIT License.
