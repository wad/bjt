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
    const surrenderSelect = document.getElementById('surrenderPermitted');
    const dasSelect = document.getElementById('doubleAfterSplitPermitted');
    const hardModeSelect = document.getElementById('hardMode');

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

    const actions = [
        'buttonHit',
        'buttonStand',
        'buttonDoubleHit',
        'buttonDoubleStand',
        'buttonSplitHit',
        'buttonSplitStand',
        'buttonSplitDoubleHit',
        'buttonSurrenderHit',
        'buttonSurrenderStand',
        'buttonSurrenderSplit'];

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

    const codeColors = {
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

    const TABLE_6D_H17_SUR_DAS_nADV = {
        '22': 'PhPhPhPhPhPhH H H H ',
        '23': 'H H H H H H H H H H ',
        '24': 'H H H H H H H H H H ',
        '25': 'H H H H H H H H H H ',
        '26': 'H H H H H H H H H H ',
        '27': 'H DhDhDhDhH H H H H ',
        '28': 'DhDhDhDhDhDhDhDhH H ',
        '29': 'DhDhDhDhDhDhDhDhDhDh',
        '2X': 'H H S S S H H H H H ',
        '2A': 'H H H DhDhH H H H H ',
        '33': 'PhPhPhPhPhPhH H H H ',
        '34': 'H H H H H H H H H H ',
        '35': 'H H H H H H H H H H ',
        '36': 'H DhDhDhDhH H H H H ',
        '37': 'DhDhDhDhDhDhDhDhH H ',
        '38': 'DhDhDhDhDhDhDhDhDhDh',
        '39': 'H H S S S H H H H H ',
        '3X': 'S S S S S H H H H H ',
        '3A': 'H H H DhDhH H H H H ',
        '44': 'H H H PhPhH H H H H ',
        '45': 'H DhDhDhDhH H H H H ',
        '46': 'DhDhDhDhDhDhDhDhH H ',
        '47': 'DhDhDhDhDhDhDhDhDhDh',
        '48': 'H H S S S H H H H H ',
        '49': 'S S S S S H H H H H ',
        '4X': 'S S S S S H H H H H ',
        '4A': 'H H DhDhDhH H H H H ',
        '55': 'DhDhDhDhDhDhDhDhH H ',
        '56': 'DhDhDhDhDhDhDhDhDhDh',
        '57': 'H H S S S H H H H H ',
        '58': 'S S S S S H H H H H ',
        '59': 'S S S S S H H H H H ',
        '5X': 'S S S S S H H H UhUh',
        '5A': 'H H DhDhDhH H H H H ',
        '66': 'PhPhPsPsPsH H H H H ',
        '67': 'S S S S S H H H H H ',
        '68': 'S S S S S H H H H H ',
        '69': 'S S S S S H H H UhUh',
        '6X': 'S S S S S H H UhUhUh',
        '6A': 'H DhDhDhDhH H H H H ',
        '77': 'PsPsPsPsPsPhH H H H ',
        '78': 'S S S S S H H H UhUh',
        '79': 'S S S S S H H UhUhUh',
        '7X': 'S S S S S S S S S Us',
        '7A': 'DsDsDsDsDsS S H H H ',
        '88': 'PsPsPsPsPsPhPhPhPhUp',
        '89': 'S S S S S S S S S Us',
        '8X': 'S S S S S S S S S S ',
        '8A': 'S S S S DsS S S S S ',
        '99': 'PsPsPsPsPsS PsPsS S ',
        '9X': 'S S S S S S S S S S ',
        '9A': 'S S S S S S S S S S ',
        'XX': 'S S S S S S S S S S ',
        'AA': 'PhPhPsPsPdPhPhPhPhPh'
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

    function addCardValues(hand) {
        const cardValueOfDeuce = 2;
        return cardIndexes[hand[0]] + cardValueOfDeuce + cardIndexes[hand[1]] + cardValueOfDeuce;
    }

    function getCellColor(actionCode) {
        return ' background-color: ' + codeColors[actionCode] + '; color: black;'
    }

    function convertRuleRowToTableRow(simplifiedHand, ruleRow) {
        let result = '<tr><td>' + simplifiedHand + '</td>';
        for (let i = 0; i < ruleRow.length; i += 2) {
            const actionCode = ruleRow[i] + ruleRow[i + 1];
            result += '<td style="' + getCellColor(actionCode) + '">' + actionCode + '</td>'
        }
        return result + '</tr>';
    }

    function showTable() {
        let splitHands = '';
        let softHands = '';
        let hardHandsMap = new Map();
        const map = Object.entries(TABLE_6D_H17_SUR_DAS_nADV);
        for (const [simplifiedHand, ruleRow] of map) {
            if (simplifiedHand[0] === simplifiedHand[1]) {
                splitHands += convertRuleRowToTableRow(simplifiedHand, ruleRow);
            } else {
                if (simplifiedHand[1] === 'A') {
                    softHands += convertRuleRowToTableRow(simplifiedHand, ruleRow);
                } else {
                    let sum = addCardValues(simplifiedHand);
                    if (!hardHandsMap.has(sum)) {
                        hardHandsMap.set(sum, convertRuleRowToTableRow(sum, ruleRow));
                    }
                }
            }
        }

        let hardHands = '';
        for (let i = 0; i < 21; i++) {
            if (hardHandsMap.has(i)) {
                hardHands += hardHandsMap.get(i);
            }
        }
        const dealerCardHeader = '<td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>A</td>';
        tableDiv.innerHTML = '<table border="1"><tr><td>SPLIT HANDS</td>' + dealerCardHeader + '</tr>' + splitHands
            + '<tr><td style="text-align: left;">SOFT HANDS</td>' + dealerCardHeader + '</tr>' + softHands
            + '<tdr><td style="text-align: left;">HARD HANDS</td>' + dealerCardHeader + '</tr>' + hardHands + '</table>';
    }

    function showTableKey() {
        const tableKey = Object.entries(actionNamesByActionCode);
        let table = '<table border="1">';
        for (let [actionCode, actionCodeMeaning] of tableKey) {
            table += '<tr>'
                + '<td style="text-align: left;' + getCellColor(actionCode) + '">' + actionCode + '</td>'
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
        if (0 === getRandomInteger(2)) {
            return [convertCardForDisplay(hand[0]), convertCardForDisplay(hand[1])];
        } else {
            return [convertCardForDisplay(hand[1]), convertCardForDisplay(hand[0])];
        }
    }

    function determineFrequencyOfSituation(dealerCardFrequencyCode) {
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

    function selectSituation() {
        const situationsEntries = Object.entries(situations);
        const availableSituations = [];
        let numTimesToInclude = 0;
        for (let [handCards, frequenciesByDealerCard] of situationsEntries) {
            for (let dealerCardIndex = 0; dealerCardIndex < frequenciesByDealerCard.length; dealerCardIndex++) {
                const situation = handCards + cards[dealerCardIndex];
                numTimesToInclude = determineFrequencyOfSituation(frequenciesByDealerCard[dealerCardIndex]);
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

    function deal() {
        const selectedSituation = selectSituation();

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

    function getCorrectPlayCode(ruleRow, dealerCard) {
        const i = cardIndexes[dealerCard] * 2;
        return ruleRow[i] + ruleRow[i + 1];
    }

    function lookupCorrectPlayCode(
        dealerCard,
        hand,
        decks,
        soft17,
        surrenderAllowed,
        dasAllowed,
        hardMode) {
        const ruleRow = TABLE_6D_H17_SUR_DAS_nADV[hand[0] + hand[1]];
        return getCorrectPlayCode(ruleRow, dealerCard);
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

    function handleAction(action) {
        const dealerCard = standardizeCard(dealerCardTextDiv.textContent);
        const hand = standardizeHand([playerCard1TextDiv.textContent, playerCard2TextDiv.textContent]);

        const correctPlayCode = lookupCorrectPlayCode(
            dealerCard,
            hand,
            decksSelect.value,
            soft17Select.value,
            surrenderSelect.value === 'checked',
            dasSelect.value === 'checked',
            hardModeSelect.value === 'checked');
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
        showTable();
        deal();
    }

    function initialSetup() {
        actions.forEach(action => {
            const button = document.getElementById(action);
            button.style.backgroundColor = codeColors[actionCodesByAction[action]];
            button.addEventListener('click', () => handleAction(action));
        });

        resultSuccessDiv.style.display = "none";
        resultCloseDiv.style.display = "none";
        resultFailureDiv.style.display = "none";

        showScore();
        showTable();
        showTableKey();
        deal();
    }

    initialSetup();
});
