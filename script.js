document.addEventListener('DOMContentLoaded', () => {

    const dealerCardDiv = document.getElementById('dealer-card');
    const dealerCardTextDiv = document.getElementById('dealer-card-text');
    const playerCard1Div = document.getElementById('player-card-1');
    const playerCard1TextDiv = document.getElementById('player-card-1-text');
    const playerCard2Div = document.getElementById('player-card-2');
    const playerCard2TextDiv = document.getElementById('player-card-2-text');
    const resultSuccessDiv = document.getElementById('resultSuccess');
    const resultCloseDiv = document.getElementById('resultClose');
    const resultFailureDiv = document.getElementById('resultFailure');
    const resultDescriptionDiv = document.getElementById('resultDescription');
    const scoreDiv = document.getElementById('score');
    const tableDiv = document.getElementById('table');
    const tableKeyDiv = document.getElementById('tableKey');
    const decksSelect = document.getElementById('decks');
    const soft17Select = document.getElementById('soft17');
    const surrenderPermittedCheckbox = document.getElementById('surrenderPermitted');
    const dasPermittedCheckbox = document.getElementById('doubleAfterSplitPermitted');
    const hardModeCheckbox = document.getElementById('hardMode');

    const suites = ['S', 'H', 'D', 'C'];
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'X', 'A'];
    const cardsValuedTen = ['10', 'J', 'Q', 'K'];

    const cardIndexes = {
        '2': 0,
        '3': 1,
        '4': 2,
        '5': 3,
        '6': 4,
        '7': 5,
        '8': 6,
        '9': 7,
        'X': 8,
        '10': 8,
        'J': 8,
        'Q': 8,
        'K': 8,
        'A': 9
    };

    const actionCodesByAction = {
        'buttonHit': 'H ',
        'buttonStand': 'S ',
        'buttonDoubleHit': 'Dh',
        'buttonDoubleStand': 'Ds',
        'buttonSplitHit': 'Ph',
        'buttonSplitStand': 'Ps',
        'buttonSplitDoubleHit': 'Pd',
        'buttonSurrenderHit': 'Uh',
        'buttonSurrenderStand': 'Us',
        'buttonSurrenderSplit': 'Up'
    };

    const actionNamesByActionCode = {
        'H ': 'Hit',
        'S ': 'Stand',
        'Dh': 'Double down (or hit)',
        'Ds': 'Double down (or stand)',
        'Ph': 'Split (or hit)',
        'Ps': 'Split (or stand)',
        'Pd': 'Split (or double down (or hit))',
        'Uh': 'Surrender (or hit)',
        'Us': 'Surrender (or stand)',
        'Up': 'Surrender (or split)'
    };

    const charsPerActionCode = 2;
    const actionCodeColors = {
        'H ': '#28b463',
        'S ': '#e74c3c',
        'Dh': '#85c1e9',
        'Ds': '#5dade2',
        'Ph': '#f9e79f',
        'Ps': '#f4d03f',
        'Pd': '#d4ac0d',
        'Uh': '#e5e7e9',
        'Us': '#bdc3c7',
        'Up': '#85929e'
    };

    const numCharsInSegment = charsPerActionCode * cards.length;
    const numCharsInSegmentWithDivider = numCharsInSegment + 2;
    const correctPlaySegmentOffsets = {
        '4HUD': 0,
        '4HUd': numCharsInSegmentWithDivider,
        '4HuD': 2 * numCharsInSegmentWithDivider,
        '4Hud': 3 * numCharsInSegmentWithDivider,
        '4hUD': 4 * numCharsInSegmentWithDivider,
        '4hUd': 5 * numCharsInSegmentWithDivider,
        '4huD': 6 * numCharsInSegmentWithDivider,
        '4hud': 7 * numCharsInSegmentWithDivider,
        '2HuD': 8 * numCharsInSegmentWithDivider,
        '2Hud': 9 * numCharsInSegmentWithDivider,
        '2huD': 10 * numCharsInSegmentWithDivider,
        '2hud': 11 * numCharsInSegmentWithDivider,
        '1HuD': 12 * numCharsInSegmentWithDivider,
        '1Hud': 13 * numCharsInSegmentWithDivider,
        '1huD': 14 * numCharsInSegmentWithDivider,
        '1hud': 15 * numCharsInSegmentWithDivider
    };

    // todo: Fill in the rest of this table.
    // The keys of this object are the two player cards, standardized, in ascending value order.
    // Each two characters in the associated strings corresponds to an action code, "--", or "..".
    // The position of these two-character codes indicates the associated dealer card, within each segment.
    // A segment of 10 of these action codes, separated by "--", are here for different options.
    // The value "--" is ignored, it's just to make it easier to work with the table, separating segments.
    // The value ".." (two dots) means "use the default correct play".
    // The default correct play is the first segment, the leftmost 20 characters of each string,
    // corresponding to options: 4 or more decks, H17, surrender is available, double after split is available.
    const correctPlays = { //                                                                                                                                                                                                                                                                                                                                       ################
        //     468,H17,SUR,DS        468,H17,SUR,nDS       468,H17,nSUR,DS       468,H17,nSUR,nDS      468,S17,SUR,DS        468,S17,SUR,nDS       468,S17,nSUR,DS         468,S17,nSUR,nDS      2,H17,nSUR,DS         2,H17,nSUR,nDS        2,S17,nSUR,DS         2,S17,nSUR,nDS        1,H17,nSUR,DS         1,H17,nSUR,nDS        1,S17,nSUR,DS         1,S17,nSUR,nDS
        //     2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A     2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A
        '22': 'PhPhPhPhPhPhH H H H --H H ................--....................--H H ................--....................--H H ................--....................--H H ................--....................--....................--....................--....................--....................--....................--....................--....................',
        '23': 'H H H H H H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '24': 'H H H H H H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '25': 'H H H H H H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '26': 'H H H H H H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '27': 'H DhDhDhDhH H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '28': 'DhDhDhDhDhDhDhDhH H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '29': 'DhDhDhDhDhDhDhDhDhDh--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '2X': 'H H S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '2A': 'H H H DhDhH H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '33': 'PhPhPhPhPhPhH H H H --H H ................--....................--H H ................--....................--H H ................--....................--H H ................--....................--....................--....................--....................--....................--....................--....................--....................',
        '34': 'H H H H H H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '35': 'H H H H H H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '36': 'H DhDhDhDhH H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '37': 'DhDhDhDhDhDhDhDhH H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '38': 'DhDhDhDhDhDhDhDhDhDh--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '39': 'H H S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '3X': 'S S S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '3A': 'H H H DhDhH H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '44': 'H H H PhPhH H H H H --......H H ..........--....................--......H H ..........--....................--......H H ..........--....................--......H H ..........--....................--....................--....................--....................--....................--....................--....................--....................',
        '45': 'H DhDhDhDhH H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '46': 'DhDhDhDhDhDhDhDhH H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '47': 'DhDhDhDhDhDhDhDhDhDh--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '48': 'H H S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '49': 'S S S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '4X': 'S S S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '4A': 'H H DhDhDhH H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        //                                                                                                                                                                                                                                                                                                                                                                                   ################
        //     468,H17,SUR,DS        468,H17,SUR,nDS       468,H17,nSUR,DS       468,H17,nSUR,nDS      468,S17,SUR,DS        468,S17,SUR,nDS       468,S17,nSUR,DS         468,S17,nSUR,nDS      2,H17,nSUR,DS         2,H17,nSUR,nDS        2,S17,nSUR,DS         2,S17,nSUR,nDS        1,H17,nSUR,DS         1,H17,nSUR,nDS        1,S17,nSUR,DS         1,S17,nSUR,nDS
        //     2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A     2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A   2 3 4 5 6 7 8 9 X A
        '55': 'DhDhDhDhDhDhDhDhH H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '56': 'DhDhDhDhDhDhDhDhDhDh--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '57': 'H H S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '58': 'S S S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '59': 'S S S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '5X': 'S S S S S H H H UhUh--....................--................H H --................H H --..................H --..................H --................H H --................H H --................H H --................H H --................H H --................H H --................H H --................H H --................H H --................H H ',
        '5A': 'H H DhDhDhH H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '66': 'PhPhPsPsPsH H H H H --H ..................--....................--H ..................--....................--H ..................--....................--H ..................--....................--....................--....................--....................--....................--....................--....................--....................',
        '67': 'S S S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '68': 'S S S S S H H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '69': 'S S S S S H H H UhUh--....................--................H H --................H H --..................H --..................H --................H H --................H H --................H H --................H H --................H H --................H H --................H H --................H H --................H H --................H H ',
        '6X': 'S S S S S H H UhUhUh--....................--..............H H H --..............H H H --....................--....................--..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H ',
        '6A': 'H DhDhDhDhH H H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '77': 'PsPsPsPsPsPhH H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '78': 'S S S S S H H H UhUh--....................--................H H --................H H --..................H --..................H --................H H --................H H --................H H --................H H --................H H --................H H --................H H --................H H --................H H --................H H ',
        '79': 'S S S S S H H UhUhUh--....................--..............H H H --..............H H H --....................--....................--..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H --..............H H H ',
        '7X': 'S S S S S S S S S Us--....................--..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S ',
        '7A': 'DsDsDsDsDsS S H H H --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '88': 'PsPsPsPsPsPhPhPhPhUp--....................--..................Ph--..................Ph--..................Ph--..................Ph--..................Ps--..................Ps--..................Ph--..................Ph--..................Ph--..................Ph--..................Ph--..................Ph--..................Ph--..................Ph',
        '89': 'S S S S S S S S S Us--....................--..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S --..................S ',
        '8X': 'S S S S S S S S S S --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '8A': 'S S S S DsS S S S S --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '99': 'PsPsPsPsPsS PsPsS S --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '9X': 'S S S S S S S S S S --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        '9A': 'S S S S S S S S S S --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        'XX': 'S S S S S S S S S S --....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................',
        'AA': 'PhPhPsPsPdPhPhPhPhPh--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................--....................'
    };

    // The position in each string corresponds to the dealer card.
    // The value of each number in each string corresponds to the probability that
    // this card combination will be presented.
    // The '@' symbol means it has a 1/2 chance of being included in the selection.
    // The '#' symbol means it has a 1/3 chance of being included in the selection.
    // The '$' symbol means it has a 1/4 chance of being included in the selection.
    // (Why this @#$ thing? Otherwise, hard hands are overrepresented.)
    // 5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 <--- hard hands
    // 1  1  2  2  3  3  4  4  4  3  3  2  2  1  1  1 <--- hard hand frequency
    // 1  1  @  @  #  #  $  $  $  #  #  @  @  1  1  1 <--- symbol to use for baseline
    const situations = {
        '22': '4444674444',
        '23': '1111111111', // 5
        '24': '1111111111', // 6
        '25': '@@@@@@@@@@', // 7
        '26': '@@@11@@@@@', // 8
        '27': '33333#####', // 9
        '28': '@@@@@@@@@@', // 10
        '29': '@@@@@@@@@@', // 11
        '2X': '11@@@$$$$$', // 12
        '2A': '4455533333',
        '33': '4444674444',
        '34': '@@@@@@@@@@', // 7
        '35': '@@@11@@@@@', // 8
        '36': '33333#####', // 9
        '37': '@@@@@@@@@@', // 10
        '38': '@@@@@@@@@@', // 11
        '39': '11@@@$$$$$', // 12
        '3X': '##########', // 13
        '3A': '4455533333',
        '44': '5556666444',
        '45': '33333#####', // 9
        '46': '@@@@@@@@@@', // 10
        '47': '@@@@@@@@@@', // 11
        '48': '11@@@$$$$$', // 12
        '49': '##########', // 13
        '4X': '@@@@@@@@@@', // 14
        '4A': '3555533333',
        '55': '2222222222',
        '56': '@@@@@@@@@@', // 11
        '57': '11@@@$$$$$', // 12
        '58': '##########', // 13
        '59': '@@@@@@@@@@', // 14
        '5X': '#######111', // 15
        '5A': '3555333333',
        '66': '7777754444',
        '67': '##########', // 13
        '68': '@@@@@@@@@@', // 14
        '69': '#######111', // 15
        '6X': '@@@@@@@111', // 16
        '6A': '4444433333',
        '77': '4444794444',
        '78': '#######111', // 15
        '79': '@@@@@@@111', // 16
        '7X': '@@@@@@@@@2', // 17
        '7A': '5555555333',
        '88': '4444444446',
        '89': '@@@@@@@@@2', // 17
        '8X': '1111111111', // 18
        '8A': '3335933333',
        '99': '4444496655',
        '9X': '1111111111', // 19
        '9A': '2222222222',
        'XX': '1111111111', // 20
        'AA': '4477954444'
    };

    // global variables to hold score info.
    let numCorrect = 0;
    let numAlmostCorrect = 0;
    let numIncorrect = 0;

    // Returns an integer >= 0 and < max
    function getRandomInteger(max) {
        return Math.floor(Math.random() * max);
    }

    function getCardImageFilename(card) {
        const suite = suites[getRandomInteger(suites.length)];
        return 'cards/' + card + suite + '.png';
    }

    function sortHand(hand) {
        if (cardIndexes[hand[0]] > cardIndexes[hand[1]]) {
            return [hand[1], hand[0]];
        }
        return hand;
    }

    function standardizeCard(card) {
        switch (card) {
            case '10':
            case 'J':
            case 'Q':
            case 'K':
                return 'X';
        }
        return card;
    }

    function standardizeHand(hand) {
        return sortHand([standardizeCard(hand[0]), standardizeCard(hand[1])]);
    }

    function sumCardValues(hand) {
        const cardValueOfDeuce = 2;
        return cardIndexes[hand[0]] + cardValueOfDeuce + cardIndexes[hand[1]] + cardValueOfDeuce;
    }

    function getCellColorHtml(actionCode) {
        return ' background-color: ' + actionCodeColors[actionCode] + '; color: black;'
    }

    function mergeSegments(base, diff) {
        let newBase = '';
        for (let i = 0; i < numCharsInSegment; i++) {
            if (diff[i] === '.') {
                newBase += base[i];
            } else {
                newBase += diff[i];
            }
        }
        return newBase;
    }

    function getCorrectPlayRowSegment(correctPlayRow, currentOptions) {
        const lookupKey = '' + currentOptions.decks
            + (currentOptions.isH17 ? 'H' : 'h')
            + (currentOptions.canSur ? 'U' : 'u')
            + (currentOptions.canDas ? 'D' : 'd');
        const segmentOffset = correctPlaySegmentOffsets[lookupKey];
        let finalSegment = correctPlayRow.substring(0, numCharsInSegment);
        if (segmentOffset === 0) {
            return finalSegment;
        }
        const specificSegment = correctPlayRow.substring(segmentOffset, segmentOffset + numCharsInSegment);
        return mergeSegments(finalSegment, specificSegment);
    }

    function convertCorrectPlayRowForDisplay(simplifiedHand, correctPlayRowSegment) {
        let result = '<tr><td>' + simplifiedHand + '</td>';
        for (let i = 0; i < numCharsInSegment; i += 2) {
            const actionCode = correctPlayRowSegment[i] + correctPlayRowSegment[i + 1];
            result += '<td style="' + getCellColorHtml(actionCode) + '">' + actionCode + '</td>'
        }
        return result + '</tr>';
    }

    function isHandSplittable(hand) {
        return hand[0] === hand[1];
    }

    function isHandSoft(hand) {
        return hand[1] === 'A';
    }

    function displayCorrectPlays(currentOptions) {
        let splitHandsSection = '';
        let softHandsSection = '';

        // Key is the sum of the card values in the hand. Value is the displayable row of correct plays.
        let hardHandsMap = new Map();

        // Walk through the correct plays, and create displayable rows for the table to display.
        for (const [hand, correctPlayRow] of Object.entries(correctPlays)) {
            const correctPlayRowSegment = getCorrectPlayRowSegment(correctPlayRow, currentOptions);
            if (isHandSplittable(hand)) {
                splitHandsSection += convertCorrectPlayRowForDisplay(hand, correctPlayRowSegment);
            } else {
                if (isHandSoft(hand)) {
                    softHandsSection += convertCorrectPlayRowForDisplay(hand, correctPlayRowSegment);
                } else {
                    let sum = sumCardValues(hand);
                    if (!hardHandsMap.has(sum)) {
                        hardHandsMap.set(sum, convertCorrectPlayRowForDisplay(sum, correctPlayRowSegment));
                    }
                }
            }
        }

        let hardHandsSection = '';
        const smallestHardHandSum = 5;
        const largestHardHandSum = 19;
        for (let i = smallestHardHandSum; i <= largestHardHandSum; i++) {
            if (hardHandsMap.has(i)) {
                hardHandsSection += hardHandsMap.get(i);
            }
        }

        const dealerCardHeader = '<td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>A</td>';
        tableDiv.innerHTML = '<table border="1"><tr><td>SPLIT HANDS</td>' + dealerCardHeader + '</tr>' + splitHandsSection
            + '<tr><td style="text-align: left;">SOFT HANDS</td>' + dealerCardHeader + '</tr>' + softHandsSection
            + '<tdr><td style="text-align: left;">HARD HANDS</td>' + dealerCardHeader + '</tr>' + hardHandsSection + '</table>';
    }

    function showTableKey() {
        const tableKey = Object.entries(actionNamesByActionCode);
        let table = '<table border="1">';
        for (let [actionCode, actionCodeMeaning] of tableKey) {
            table += '<tr>'
                + '<td style="text-align: left;' + getCellColorHtml(actionCode) + '">' + actionCode + '</td>'
                + '<td style="text-align: left;">' + actionCodeMeaning + '</td>'
                + '</tr>';
        }
        tableKeyDiv.innerHTML = table + '</table>';
    }

    function showScore() {
        const totalPlays = numCorrect + numAlmostCorrect + numIncorrect;
        let percentCorrect = 0;
        if (totalPlays > 0) {
            percentCorrect = Math.floor((numCorrect / totalPlays) * 100);
        }
        scoreDiv.innerHTML = 'SCORE: ' + percentCorrect + '%'
            + '<br>Correct plays: ' + numCorrect
            + '<br>Almost correct plays: ' + numAlmostCorrect
            + '<br>Incorrect plays: ' + numIncorrect;
    }

    function convertCardForDisplay(card) {
        if (card === 'X') {
            return cardsValuedTen[getRandomInteger(cardsValuedTen.length)];
        }
        return card;
    }

    function convertHandForDisplay(hand) {
        const randomlySwapOrder = 0 === getRandomInteger(2);
        if (randomlySwapOrder) {
            return [convertCardForDisplay(hand[0]), convertCardForDisplay(hand[1])];
        } else {
            return [convertCardForDisplay(hand[1]), convertCardForDisplay(hand[0])];
        }
    }

    function lookupFrequencyInHardMode(dealerCardFrequencyCode) {
        // The frequency is specified in the table, use the code or the value.
        switch (dealerCardFrequencyCode) {
            case '$':
                return getRandomInteger(4) === 0 ? 1 : 0;
            case '#':
                return getRandomInteger(3) === 0 ? 1 : 0;
            case '@':
                return getRandomInteger(2) === 0 ? 1 : 0;
            default:
                return dealerCardFrequencyCode;
        }
    }

    function computeFlatFrequency(situation) {
        // To achieve parity with random card generation, we must account for the four types of 10-value cards.
        let numTenValueCardsInSituation = 0;
        for (const card of situation) {
            numTenValueCardsInSituation += card === 'X' ? 1 : 0;
        }
        return numTenValueCardsInSituation === 0 ? 1 : numTenValueCardsInSituation * cardsValuedTen.length;
    }

    // A situation includes the two player cards and the dealer card.
    // This method generates every possible situation, duplicating ones that should be more frequently chosen,
    // and randomly selects one from the list.
    function selectSituation(isHardMode) {
        const situationsEntries = Object.entries(situations);
        const availableSituations = [];
        for (let [handCards, frequenciesByDealerCard] of situationsEntries) {
            for (let dealerCardIndex = 0; dealerCardIndex < frequenciesByDealerCard.length; dealerCardIndex++) {
                const situation = handCards + cards[dealerCardIndex];
                const numTimesToInclude = isHardMode
                    ? lookupFrequencyInHardMode(frequenciesByDealerCard[dealerCardIndex])
                    : computeFlatFrequency(situation);
                for (let i = 0; i < numTimesToInclude; i++) {
                    availableSituations.push(situation);
                }
            }
        }
        const chosenSituation = availableSituations[getRandomInteger(availableSituations.length)];
        return {
            hand: convertHandForDisplay(chosenSituation.substring(0, 2)),
            dealerCard: convertCardForDisplay(chosenSituation.substring(2, 3))
        }
    }

    // Randomly choose cards for the player and dealer, and display them.
    function deal(isHardMode) {
        const selectedSituation = selectSituation(isHardMode);

        dealerCardDiv.innerHTML = '<img src="' + getCardImageFilename(
            selectedSituation.dealerCard) + '" alt="' + selectedSituation.dealerCard + '" width="100">';
        dealerCardTextDiv.innerText = selectedSituation.dealerCard;
        playerCard1Div.innerHTML = '<img src="' + getCardImageFilename(
            selectedSituation.hand[0]) + '" alt="' + selectedSituation.hand[0] + '" width="100">';
        playerCard1TextDiv.innerText = selectedSituation.hand[0];
        playerCard2Div.innerHTML = '<img src="' + getCardImageFilename(
            selectedSituation.hand[1]) + '" alt="' + selectedSituation.hand[1] + '" width="100">';
        playerCard2TextDiv.innerText = selectedSituation.hand[1];
    }

    function getActionCodeFromCorrectPlays(correctPlayRow, dealerCard) {
        const i = cardIndexes[dealerCard] * charsPerActionCode;
        return correctPlayRow[i] + correctPlayRow[i + 1];
    }

    function lookupCorrectActionCode(dealerCard, hand, currentOptions) {
        const correctPlayRow = correctPlays[hand[0] + hand[1]];
        const correctPlayRowSegment = getCorrectPlayRowSegment(correctPlayRow, currentOptions);
        return getActionCodeFromCorrectPlays(correctPlayRowSegment, dealerCard);
    }

    function wasPlayAlmostCorrect(chosenPlay, correctPlay) {
        return chosenPlay[0] === correctPlay[0];
    }

    function updatePlayResult(wasSuccess, wasFailure, wasClose) {
        resultSuccessDiv.innerText = wasSuccess ? 'Correct' : '';
        resultSuccessDiv.style.display = wasSuccess ? '' : 'none';
        resultFailureDiv.innerText = wasFailure ? 'Wrong play' : '';
        resultFailureDiv.style.display = wasFailure ? '' : 'none';
        resultCloseDiv.innerText = wasClose ? 'Almost correct!' : '';
        resultCloseDiv.style.display = wasClose ? '' : 'none';
    }

    function playWasCorrect(chosenAction) {
        numCorrect++;
        updatePlayResult(true, false, false);
        resultDescriptionDiv.innerText = playerCard1TextDiv.textContent + ' and ' + playerCard2TextDiv.textContent
            + ' versus ' + dealerCardTextDiv.textContent
            + ', you chose "' + actionNamesByActionCode[chosenAction] + '".';
    }

    function playWasAlmostCorrect(chosenAction, correctPlayCode) {
        numAlmostCorrect++;
        updatePlayResult(false, false, true);
        resultDescriptionDiv.innerText = playerCard1TextDiv.textContent + ' and ' + playerCard2TextDiv.textContent
            + ' versus ' + dealerCardTextDiv.textContent
            + ', you chose "' + actionNamesByActionCode[chosenAction]
            + '", but the correct play was "' + actionNamesByActionCode[correctPlayCode] + '".';
    }

    function playWasIncorrect(chosenAction, correctPlayCode) {
        numIncorrect++;
        updatePlayResult(false, true, false);
        resultDescriptionDiv.innerText = playerCard1TextDiv.textContent + ' and ' + playerCard2TextDiv.textContent
            + ' versus ' + dealerCardTextDiv.textContent
            + ', you chose "' + actionNamesByActionCode[chosenAction]
            + '", but the correct play was "' + actionNamesByActionCode[correctPlayCode] + '".';
    }

    function getNumDecks(selectedValue) {
        switch (selectedValue) {
            case '1-deck':
                return 1;
            case '2-deck':
                return 2;
            case '4,6,8-deck':
                return 4;
        }
    }

    function getCurrentOptions() {
        return {
            decks: getNumDecks(decksSelect.value),
            isH17: soft17Select.value === 'H17',
            canSur: surrenderPermittedCheckbox.checked,
            canDas: dasPermittedCheckbox.checked
        }
    }

    function handleAction(action) {
        const dealerCard = standardizeCard(dealerCardTextDiv.textContent);
        const hand = standardizeHand([playerCard1TextDiv.textContent, playerCard2TextDiv.textContent]);
        const isHardMode = hardModeCheckbox.checked;

        const currentOptions = getCurrentOptions();
        const correctPlayCode = lookupCorrectActionCode(dealerCard, hand, currentOptions);
        const chosenAction = actionCodesByAction[action];
        if (chosenAction === correctPlayCode) {
            playWasCorrect(chosenAction);
        } else {
            if (wasPlayAlmostCorrect(chosenAction, correctPlayCode)) {
                playWasAlmostCorrect(chosenAction, correctPlayCode);
            } else {
                playWasIncorrect(chosenAction, correctPlayCode);
            }
        }

        showScore();
        displayCorrectPlays(currentOptions);
        deal(isHardMode);
    }

    function handleOptionChanged(event) {
        switch (event.target.name) {
            case 'surrenderPermitted':
                if ((decksSelect.value === '1-deck' || decksSelect.value === '2-deck') && surrenderPermittedCheckbox.checked) {
                    surrenderPermittedCheckbox.checked = false;
                }
                break;
            case 'doubleAfterSplitPermitted':
                break;
            case 'hardMode':
                deal(hardModeCheckbox.checked);
                break;
            case 'decks':
                if ((decksSelect.value === '1-deck' || decksSelect.value === '2-deck') && surrenderPermittedCheckbox.checked) {
                    surrenderPermittedCheckbox.checked = false;
                }
                break;
            case 'soft17':
                break;
        }
        displayCorrectPlays(getCurrentOptions());
    }

    function initialSetup() {

        // Clear out anything in the play result area
        updatePlayResult(false, false, false);

        // default options
        decksSelect.value = '4,6,8-deck';
        soft17Select.value = 'H17';
        surrenderPermittedCheckbox.checked = true;
        dasPermittedCheckbox.checked = true;
        hardModeCheckbox.checked = true;

        // button event handlers
        Object.keys(actionCodesByAction).forEach(action => {
            const button = document.getElementById(action);
            button.style.backgroundColor = actionCodeColors[actionCodesByAction[action]];
            button.addEventListener('click', () => handleAction(action));
        });

        // options event handlers
        decksSelect.addEventListener('change', handleOptionChanged);
        soft17Select.addEventListener('change', handleOptionChanged);
        surrenderPermittedCheckbox.addEventListener('change', handleOptionChanged);
        dasPermittedCheckbox.addEventListener('change', handleOptionChanged);
        hardModeCheckbox.addEventListener('change', handleOptionChanged);

        showScore();
        displayCorrectPlays(getCurrentOptions());
        showTableKey();
        deal(hardModeCheckbox.checked);
    }

    initialSetup();
});
