/**
 * pokersolver
 * Copyright (c) 2016, GoldFire Studios, Inc.
 * http://goldfirestudios.com
 */

(function() {
  'use strict';

  var values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

  /**
   * Base Card class that defines a single card.
   */
  class Card {
    constructor(str) {
      this.value = str.substr(0, 1);
      this.suit = str.substr(1, 1).toLowerCase();
      this.rank = values.indexOf(this.value);
    }

    toString() {
      return this.value + this.suit;
    }
  }

  Card.sort = function(a, b) {
    if (a.rank > b.rank) {
      return -1;
    } else if (a.rank < b.rank) {
      return 1;
    } else {
      return 0;
    }
  };

  /**
   * Base Hand class that handles comparissons of full hands.
   */
  class Hand {
    constructor(cards, rank, name) {
      this.cardPool = [];
      this.cards = [];
      this.suits = {};
      this.values = [];
      this.rank = rank;
      this.name = name;

      // setup the pool of cards
      this.cardPool = cards.map(function(c) {
        return (typeof c === 'string') ? new Card(c) : c;
      }).sort(Card.sort);

      // create the arrays of suits and values
      var obj, obj1, key, key1, card;
      for (var i=0; i<this.cardPool.length; i++) {
        // make sure this value already exists in the object
        card = this.cardPool[i];
        (obj = this.suits)[key = card.suit] || (obj[key] = []);
        (obj1 = this.values)[key1 = card.rank] || (obj1[key1] = []);

        // add the value to the array for that type in the object
        this.suits[card.suit].push(card);
        this.values[card.rank].push(card);
      }

      this.values.reverse();
      this.isPossible = this.solve();
    }

    /**
     * Compare current hand with another to determine which is the winner.
     * @param  {Hand} a Hand to compare to.
     * @return {Number}
     */
    compare(a) {
      if (this.rank < a.rank) {
        return 1;
      } else if (this.rank > a.rank) {
        return -1;
      }

      var result = 0;
      for (var i=0; i<=4; i++) {
        if (this.cards[i].rank < a.cards[i].rank) {
          result = 1;
          break;
        } else if (this.cards[i].rank > a.cards[i].rank) {
          result = -1;
          break;
        }
      }

      return result;
    }

    /**
     * Determine whether a hand loses to another.
     * @param  {Hand} hand Hand to compare to.
     * @return {Boolean}
     */
    loseTo(hand) {
      return (this.compare(hand) > 0);
    }

    /**
     * Highest card comparison.
     * @return {Array} Highest cards
     */
    nextHighest() {
      var picks;
      var excluding = [];
      excluding = excluding.concat(this.cards);

      return picks = this.cardPool.filter(function(card) {
        if (excluding.indexOf(card) < 0) {
          return true;
        }
      });
    }

    /**
     * Return list of contained cards in human readable format.
     * @return {String}
     */
    toString() {
      var cards = this.cards.map(function(c) {
        return c.toString();
      });

      return cards.join(', ');
    }

    /**
     * Return array of contained cards.
     * @return {Array}
     */
    toArray() {
      var cards = this.cards.map(function(c) {
        return c.toString();
      });

      return cards;
    }

    solve() {}
  }

  /**
   * Find highest ranked hands and remove any that lose to another hand.
   * @param  {Array} hands Hands to evaluate.
   * @return {Array}       Winning hands.
   */
  Hand.winners = function(hands) {
    var highestRank = Math.max.apply(Math, hands.map(function(h) {
      return h.rank;
    }));

    hands = hands.filter(function(h) {
      return h.rank === highestRank;
    });

    hands = hands.filter(function(h) {
      var lose = false;
      for (var i=0; i<hands.length; i++) {
        lose = h.loseTo(hands[i]);
        if (lose) {
          break;
        }
      }

      return !lose;
    });

    return hands;
  };

  /**
   * Build and return the best hand.
   * @param  {Array} cards Array of cards (['Ad', '3c', 'Th', ...]).
   * @return {Hand}       Best hand.
   */
  Hand.solve = function(cards) {
    var hands = [StraightFlush, FourOfAKind, FullHouse, Flush, Straight, ThreeOfAKind, TwoPair, OnePair, HighCard];
    var result = null;

    for (var i=0; i<hands.length; i++) {
      result = new hands[i](cards);
      if (result.isPossible) {
        break;
      }
    }

    return result;
  };

  class StraightFlush extends Hand {
    constructor(cards) {
      super(cards, 8, 'Straight Flush');
    }

    solve() {
      var possibleStraight = null;

      for (var suit in this.suits) {
        var cards = this.suits[suit];
        if (cards && cards.length >= 5) {
          possibleStraight = cards;
          break;
        }
      }

      if (possibleStraight) {
        var straight = new Straight(possibleStraight);
        if (straight.isPossible) {
          this.cards = straight.cards;
        }
      }

      if (this.cards[0] && this.cards[0].rank === 13) {
        this.descr = 'Royal Flush';
      } else if (this.cards.length === 5) {
        this.descr = this.name + ', ' + this.cards[0].toString() + ' High';
      }

      return this.cards.length === 5;
    }
  }

  class FourOfAKind extends Hand {
    constructor(cards) {
      super(cards, 7, 'Four of a Kind');
    }

    solve() {
      for (var i=0; i<this.values.length; i++) {
        var cards = this.values[i];
        if (cards && cards.length === 4) {
          this.cards = cards;

          var next = this.nextHighest()[0];
          if (next) {
            this.cards.push(next);
          }

          break;
        }
      }

      if (this.cards.length >= 4) {
        this.descr = this.name + ', ' + this.cards[0].value + '\'s';
      }

      return this.cards.length >= 4;
    }
  }

  class FullHouse extends Hand {
    constructor(cards) {
      super(cards, 6, 'Full House');
    }

    solve() {
      var cards;

      for (var i=0; i<this.values.length; i++) {
        cards = this.values[i];
        if (cards && cards.length === 3) {
          this.cards = cards;
          break;
        }
      }

      if (this.cards.length === 3) {
        for (i=0; i<this.values.length; i++) {
          cards = this.values[i];
          if (cards && cards.length >= 2 && this.cards[0].value !== cards[0].value) {
            this.cards = this.cards.concat(cards.slice(0, 2));
            break;
          }
        }
      }

      if (this.cards.length === 5) {
        var type = this.cards[0].value + '\'s over ' + this.cards[3].value + '\'s';
        this.descr = this.name + ', ' + type;
      }

      return this.cards.length === 5;
    }
  }

  class Flush extends Hand {
    constructor(cards) {
      super(cards, 5, 'Flush');
    }

    solve() {
      for (var suit in this.suits) {
        var cards = this.suits[suit];
        if (cards.length >= 5) {
          this.cards = cards.slice(0, 5);
          break;
        }
      }

      if (this.cards.length === 5) {
        this.descr = this.name + ', ' + this.cards[0].toString() + ' High';
      }

      return this.cards.length === 5;
    }
  }

  class Straight extends Hand {
    constructor(cards) {
      super(cards, 4, 'Straight');
    }

    solve() {
      var card, prevCard, diff;

      for (var i=0; i<this.cardPool.length; i++) {
        card = this.cardPool[i];
        if (card.value === 'A') {
          this.cardPool.push(new Card('1' + card.suit));
        }
      }

      for (i=0; i<this.cardPool.length; i++) {
        card = this.cardPool[i];
        prevCard = this.cards[this.cards.length - 1];
        diff = (prevCard) ? prevCard.rank - card.rank : null;

        if (diff > 1) {
          this.cards = [];
          this.cards.push(card);
        } else if (diff === 1) {
          this.cards.push(card);
        } else if (diff === null) {
          this.cards.push(card);
        }

        if (this.cards.length === 5) {
          break;
        }
      }

      if (this.cards.length === 5) {
        this.descr = this.name + ', ' + this.cards[0].value + ' High';
      }

      return this.cards.length === 5;
    }
  }

  class ThreeOfAKind extends Hand {
    constructor(cards) {
      super(cards, 3, 'Three of a Kind');
    }

    solve() {
      for (var i=0; i<this.values.length; i++) {
        var cards = this.values[i];
        if (cards && cards.length === 3) {
          this.cards = cards;
          this.cards = this.cards.concat(this.nextHighest().slice(0, 2));
          break;
        }
      }

      if (this.cards.length >= 3) {
        this.descr = this.name + ', ' + this.cards[0].value + '\'s';
      }

      return this.cards.length >= 3;
    }
  }

  class TwoPair extends Hand {
    constructor(cards) {
      super(cards, 2, 'Two Pair');
    }

    solve() {
      for (var i=0; i<this.values.length; i++) {
        var cards = this.values[i];
        if (this.cards.length > 0 && cards && cards.length === 2) {
          this.cards = this.cards.concat(cards);
          this.cards.push(this.nextHighest()[0]);
          break;
        } else if (cards && cards.length === 2) {
          this.cards = this.cards.concat(cards);
        }
      }

      if (this.cards.length >= 4) {
        var type = this.cards[0].value + '\'s & ' + this.cards[2].value + '\'s';
        this.descr = this.name + ', ' + type;
      }

      return this.cards.length >= 4;
    }
  }

  class OnePair extends Hand {
    constructor(cards) {
      super(cards, 1, 'Pair');
    }

    solve() {
      for (var i=0; i<this.values.length; i++) {
        var cards = this.values[i];
        if (cards && cards.length === 2) {
          this.cards = this.cards.concat(cards);
          this.cards = this.cards.concat(this.nextHighest().slice(0, 3));
          break;
        }
      }

      if (this.cards.length >= 2) {
        this.descr = this.name + ', ' + this.cards[0].value + '\'s';
      }

      return this.cards.length >= 2;
    }
  }

  class HighCard extends Hand {
    constructor(cards) {
      super(cards, 0, 'High Card');
    }

    solve() {
      this.cards = this.cardPool.slice(0, 5);
      this.descr = this.cards[0].value + ' High';

      return true;
    }
  }

  function exportToGlobal(global) {
    global.Card = Card;
    global.Hand = Hand;
    global.StraightFlush = StraightFlush;
    global.FourOfAKind = FourOfAKind;
    global.FullHouse = FullHouse;
    global.Flush = Flush;
    global.Straight = Straight;
    global.ThreeOfAKind = ThreeOfAKind;
    global.TwoPair = TwoPair;
    global.OnePair = OnePair;
    global.HighCard = HighCard;
  }

  // Export the classes for node.js use.
  if (typeof exports !== 'undefined') {
    exportToGlobal(exports);
  }

  // Add the classes to the window for browser use.
  if (typeof window !== 'undefined') {
    exportToGlobal(window);
  }
})();
