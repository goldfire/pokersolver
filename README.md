## Description
pokersolver is a poker hand solver and comparison tool written in Javascript. It was written for and is being used in production on [**CasinoRPG**](http://casinorpg.com), an HTML5 MMORPG that features Texas Hold'em as one of its main casino games. It is designed for use on either the client (browser) or the server (Node.js). This library is capable of:

* Evaluating a hand of up to 7 cards
* Calculating the score of the hand (0-9)
* Returning the name of the hand (Pair, Flush, etc)
* Returning a detailed description (Two Pair, A's & 8's)
* Comparing an array of hands and returning the winner(s)
* Identifying all cards involved in creating the winning hand
* Works in both the browser and Node.js

## Installation
```
npm install pokersolver
```

## Examples
#### Server Usage
```javascript
var Hand = require('pokersolve').Hand;
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
### Methods
#### solve(cards)
Solves the hand passed in, whether 3 cards or 7. Returns various information such as name, description, score and cards involved.
* **cards**: `Array` All cards involved in the hand, example: `['Ad', '2d', '3d', '4d', 'Qc', 'Ks', '7h']`.

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
Ranking of the hand type (0-9, 0 being High Card and 9 being Straight Flush).

## Testing
```
npm install
npm test
```

## License
Copyright (c) 2016 James Simpson and GoldFire Studios, Inc.

Released under the MIT License.