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
    const buttonSurrenderHit = document.getElementById('buttonSurrenderHit');
    const buttonSurrenderStand = document.getElementById('buttonSurrenderStand');
    const buttonSurrenderSplit = document.getElementById('buttonSurrenderSplit');
    const decksSelect = document.getElementById('decks');
    const soft17Select = document.getElementById('soft17');
    const surrenderSelect = document.getElementById('surrenderPermitted');
    const dasSelect = document.getElementById('doubleAfterSplitPermitted');
    const advantageSelect = document.getElementById('advantageHeld');

    const suites = ['S', 'H', 'D', 'C'];
    const cardsPerSuite = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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
        'buttonSplitHit',
        'buttonSplitStand',
        'buttonSplitDoubleHit',
        'buttonDoubleHit',
        'buttonDoubleStand',
        'buttonSurrenderHit',
        'buttonSurrenderStand',
        'buttonSurrenderSplit'];

    const actionCodesByAction = {
        'buttonHit': 'H ',
        'buttonStand': 'S ',
        'buttonSplitHit': 'Ph',
        'buttonSplitStand': 'Ps',
        'buttonSplitDoubleHit': 'Pd',
        'buttonDoubleHit': 'Dh',
        'buttonDoubleStand': 'Ds',
        'buttonSurrenderHit': 'Uh',
        'buttonSurrenderStand': 'Us',
        'buttonSurrenderSplit': 'Up'
    };

    const actionNamesByActionCode = {
        'H ': 'Hit',
        'S ': 'Stand',
        'Ph': 'Split (or hit)',
        'Ps': 'Split (or stand)',
        'Pd': 'Split (or double down (or hit))',
        'Dh': 'Double down (or hit)',
        'Ds': 'Double down (or stand)',
        'Uh': 'Surrender (or hit)',
        'Us': 'Surrender (or stand)',
        'Up': 'Surrender (or split)'
    };

    const codeColors = {
        'H ': '#28b463',
        'S ': '#e74c3c',
        'Ph': '#f9e79f',
        'Ps': '#f4d03f',
        'Pd': '#d4ac0d',
        'Dh': '#85c1e9',
        'Ds': '#5dade2',
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

    const trickyPlays = {
        '22': '1111111111',
        '23': '0000000000',
        '24': '0000000000',
        '25': '0000000000',
        '26': '1111100000',
        '27': '1111100000',
        '28': '1111111111',
        '29': '0000000000',
        '2X': '1111111111',
        '2A': '1111111111',
        '33': '1111111111',
        '34': '0000000000',
        '35': '0000000000',
        '36': '1111100000',
        '37': '1111111111',
        '38': '1111111111',
        '39': '1111111111',
        '3X': '0000000000',
        '3A': '1111111111',
        '44': '1111111111',
        '45': '1111100000',
        '46': '1111111111',
        '47': '0000000000',
        '48': '1111100000',
        '49': '0000000000',
        '4X': '0000000000',
        '4A': '1111111111',
        '55': '1111111111',
        '56': '0000000000',
        '57': '1111111111',
        '58': '0000000000',
        '59': '0000000000',
        '5X': '0000011111',
        '5A': '1111111111',
        '66': '1111111111',
        '67': '0000000000',
        '68': '0000000000',
        '69': '0000011111',
        '6X': '0000011111',
        '6A': '1111111111',
        '77': '1111111111',
        '78': '0000011111',
        '79': '0000011111',
        '7X': '0000000111',
        '7A': '1111111111',
        '88': '1111111111',
        '89': '0000000111',
        '8X': '0000000000',
        '8A': '1111111111',
        '99': '1111111111',
        '9X': '0000000000',
        '9A': '1111111111',
        'XX': '0000000000',
        'AA': '1111111111'
    };

    let numCorrect = 0;
    let numAlmostCorrect = 0;
    let numIncorrect = 0;

    function getCardImageFilename(card) {
        const suite = suites[Math.floor(Math.random() * suites.length)];
        return 'cards/' + card + suite + '.png';
    }

    function getRandomCard() {
        return cardsPerSuite[Math.floor(Math.random() * cardsPerSuite.length)];
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

    function getTableLookupForHand(hand) {
        const standardizedHand = standardizeHand(hand);
        return standardizedHand[0] + standardizedHand[1];
    }

    function isBlackjack(hand) {
        const standardizedHand = standardizeHand(hand);
        return standardizedHand[0] === 'X' && standardizedHand[1] === 'A';
    }

    function generateHand() {
        const hand = [getRandomCard(), getRandomCard()];
        if (!isBlackjack(hand)) {
            return hand;
        }
        return generateHand();
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

    function isTrickyPlay(dealerCard, hand) {
        const simplifiedHand = sortHand([standardizeCard(hand[0]), standardizeCard(hand[1])]);
        const cardLookup = simplifiedHand[0] + simplifiedHand[1];
        const ruleRow = trickyPlays[cardLookup];
        return ruleRow[cardIndexes[standardizeCard(dealerCard)]] === '1';
    }

    function deal() {
        let dealerCard = getRandomCard();
        let hand = generateHand();
        let useTheseCards = isTrickyPlay(dealerCard, hand);
        while (!useTheseCards) {
            dealerCard = getRandomCard();
            hand = generateHand();
            useTheseCards = isTrickyPlay(dealerCard, hand) || Math.random() < 0.15;
        }

        dealerCardDiv.innerHTML = '<img src="' + getCardImageFilename(dealerCard) + '" alt="' + dealerCard + '" width="100">';
        dealerCardTextDiv.innerText = dealerCard;
        playerCard1Div.innerHTML = '<img src="' + getCardImageFilename(hand[0]) + '" alt="' + hand[0] + '" width="100">';
        playerCard1TextDiv.innerText = hand[0];
        playerCard2Div.innerHTML = '<img src="' + getCardImageFilename(hand[1]) + '" alt="' + hand[1] + '" width="100">';
        playerCard2TextDiv.innerText = hand[1];
    }

    function getCorrectPlayCode(ruleRow, dealerCard) {
        const i = cardIndexes[standardizeCard(dealerCard)] * 2;
        return ruleRow[i] + ruleRow[i + 1];
    }

    function lookupCorrectPlayCode(
        dealerCard,
        hand,
        decks,
        soft17,
        surrenderAllowed,
        dasAllowed,
        hasAdvantage) {
        const ruleRow = TABLE_6D_H17_SUR_DAS_nADV[getTableLookupForHand(hand)];
        return getCorrectPlayCode(ruleRow, dealerCard);
    }

    function wasPlayAlmostCorrect(chosenPlay, correctPlay) {
        return chosenPlay[0] === correctPlay[0];
    }

    function playWasCorrect(chosenAction) {
        numCorrect++;
        resultFailureDiv.innerText = "";
        resultFailureDiv.style.display = "none";
        resultCloseDiv.innerText = "";
        resultCloseDiv.style.display = "none";
        resultSuccessDiv.style.display = "";
        resultSuccessDiv.innerText = "Correct";
        resultDescriptionDiv.innerText = playerCard1TextDiv.textContent + ' and ' + playerCard2TextDiv.textContent
            + ' versus ' + dealerCardTextDiv.textContent
            + ', you chose "' + actionNamesByActionCode[chosenAction] + '".';
    }

    function playWasAlmostCorrect(chosenAction, correctPlayCode) {
        numAlmostCorrect++;
        resultSuccessDiv.innerText = "";
        resultSuccessDiv.style.display = "none";
        resultFailureDiv.innerText = "";
        resultFailureDiv.style.display = "none";
        resultCloseDiv.style.display = "";
        resultCloseDiv.innerText = "Almost correct!";
        resultDescriptionDiv.innerText = playerCard1TextDiv.textContent + ' and ' + playerCard2TextDiv.textContent
            + ' versus ' + dealerCardTextDiv.textContent
            + ', you chose "' + actionNamesByActionCode[chosenAction]
            + '", but the correct play was "' + actionNamesByActionCode[correctPlayCode] + '".';
    }

    function playWasIncorrect(chosenAction, correctPlayCode) {
        numIncorrect++;
        resultSuccessDiv.innerText = "";
        resultSuccessDiv.style.display = "none";
        resultCloseDiv.innerText = "";
        resultCloseDiv.style.display = "none";
        resultFailureDiv.style.display = "";
        resultFailureDiv.innerText = "Wrong play";
        resultDescriptionDiv.innerText = playerCard1TextDiv.textContent + ' and ' + playerCard2TextDiv.textContent
            + ' versus ' + dealerCardTextDiv.textContent
            + ', you chose "' + actionNamesByActionCode[chosenAction]
            + '", but the correct play was "' + actionNamesByActionCode[correctPlayCode] + '".';
    }

    function handleAction(action) {
        const correctPlayCode = lookupCorrectPlayCode(
            dealerCardTextDiv.textContent,
            [playerCard1TextDiv.textContent, playerCard2TextDiv.textContent],
            decksSelect.value,
            soft17Select.value,
            surrenderSelect.value === 'yes',
            dasSelect.value === 'yes',
            advantageSelect.value === 'yes');
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

    actions.forEach(action => {
        const button = document.getElementById(action);
        button.addEventListener('click', () => handleAction(action));
    });

    surrenderSelect.addEventListener('change', () => {
        buttonSurrenderHit.disabled = surrenderSelect.value === 'no';
        buttonSurrenderStand.disabled = surrenderSelect.value === 'no';
        buttonSurrenderSplit.disabled = surrenderSelect.value === 'no';
    });
    buttonSurrenderHit.disabled = surrenderSelect.value === 'no';
    buttonSurrenderStand.disabled = surrenderSelect.value === 'no';
    buttonSurrenderSplit.disabled = surrenderSelect.value === 'no';

    resultSuccessDiv.style.display = "none";
    resultCloseDiv.style.display = "none";
    resultFailureDiv.style.display = "none";

    showScore();
    showTable();
    showTableKey();
    deal();
});
