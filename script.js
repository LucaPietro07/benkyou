document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('flashcard-container');
    const displayModeSelect = document.getElementById('display-mode');
    const testContainer = document.getElementById('test-container');

    function renderFlashcards(displayMode) {
        container.innerHTML = '';
        flashcardData.sets.forEach(set => {
            set.cards.forEach(card => {
                const flashcard = document.createElement('div');
                flashcard.className = 'flashcard';
                let term, definition;

                switch (displayMode) {
                    case 'kanji-hiragana':
                        term = card.kanji;
                        definition = card.hiragana;
                        break;
                    case 'hiragana-definition':
                        term = card.hiragana;
                        definition = card.definition;
                        break;
                    case 'kanji-hiragana-definition':
                        term = `${card.kanji} (${card.hiragana})`;
                        definition = card.definition;
                        break;
                }

                flashcard.innerHTML = `
                    <div class="term">${term}</div>
                    <div class="definition" style="display: none;">${definition}</div>
                `;
                flashcard.addEventListener('click', () => {
                    const termElement = flashcard.querySelector('.term');
                    const definitionElement = flashcard.querySelector('.definition');
                    if (termElement.style.display === 'none') {
                        termElement.style.display = 'block';
                        definitionElement.style.display = 'none';
                    } else {
                        termElement.style.display = 'none';
                        definitionElement.style.display = 'block';
                    }
                });
                container.appendChild(flashcard);
            });
        });
    }

    displayModeSelect.addEventListener('change', (event) => {
        renderFlashcards(event.target.value);
    });

    renderFlashcards(displayModeSelect.value);

    function createTest() {
        testContainer.innerHTML = '';

        const allCards = flashcardData.sets.flatMap(set => set.cards);
        const randomCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 10);

        const testTable = document.createElement('table');
        testTable.className = 'test-table';
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Kanji</th>
            <th>Hiragana</th>
            <th>Definition</th>
        `;
        testTable.appendChild(headerRow);

        randomCards.forEach((card, index) => {
            const testRow = document.createElement('tr');
            testRow.innerHTML = `
                <td>${card.kanji}</td>
                <td><input type="text" id="hiragana-${index}" class="hiragana-input"></td>
                <td><input type="text" id="definition-${index}" class="definition-input"></td>
            `;
            testTable.appendChild(testRow);
        });

        testContainer.appendChild(testTable);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.addEventListener('click', () => {
            randomCards.forEach((card, index) => {
                document.getElementById(`hiragana-${index}`).style.borderColor = '';
                document.getElementById(`definition-${index}`).style.borderColor = '';
            });

            let score = 0;
            randomCards.forEach((card, index) => {
                const hiraganaInput = document.getElementById(`hiragana-${index}`).value;
                const definitionInput = document.getElementById(`definition-${index}`).value;
                const hiraganaCorrect = hiraganaInput === card.hiragana;
                const definitionCorrect = definitionInput === card.definition;

                if (hiraganaCorrect) {
                    score++;
                } else {
                    document.getElementById(`hiragana-${index}`).style.borderColor = 'red';
                }

                if (definitionCorrect) {
                    score++;
                } else {
                    document.getElementById(`definition-${index}`).style.borderColor = 'red';
                }
            });
            alert(`Your score: ${score}/20`);
        });
        testContainer.appendChild(submitButton);
    }

    const testButton = document.getElementById('generate-test-button');
    testButton.addEventListener('click', createTest);
});
