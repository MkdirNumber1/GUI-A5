$(document).ready(function () {
    const ScrabbleTiles = {
        "A": { "value": 1, "original-distribution": 9, "number-remaining": 9 },
        "B": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "C": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "D": { "value": 2, "original-distribution": 4, "number-remaining": 4 },
        "E": { "value": 1, "original-distribution": 12, "number-remaining": 12 },
        "F": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "G": { "value": 2, "original-distribution": 3, "number-remaining": 3 },
        "H": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "I": { "value": 1, "original-distribution": 9, "number-remaining": 9 },
        "J": { "value": 8, "original-distribution": 1, "number-remaining": 1 },
        "K": { "value": 5, "original-distribution": 1, "number-remaining": 1 },
        "L": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
        "M": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "N": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
        "O": { "value": 1, "original-distribution": 8, "number-remaining": 8 },
        "P": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "Q": { "value": 10, "original-distribution": 1, "number-remaining": 1 },
        "R": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
        "S": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
        "T": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
        "U": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
        "V": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "W": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "X": { "value": 8, "original-distribution": 1, "number-remaining": 1 },
        "Y": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "Z": { "value": 10, "original-distribution": 1, "number-remaining": 1 },
        "_": { "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2 } 
    };

    const rackSize = 7;
    let score = 0;
    let currentWord = [];

    function resetGame() {
        score = 0;
        currentWord = [];
        populateRack();
        updateScore();
        resetBoard();
    }

    function updateScore() {
        $("#score").text(score);
    }

    function populateRack() {
        const rack = $("#rack");
        rack.empty();

        for (let i = 0; i < rackSize; i++) {
            const tile = getRandomTile();
            if (tile) {
                const tileDiv = $(`
                    <div class="tile" 
                         data-letter="${tile.letter}" 
                         data-value="${tile.value}">
                        <img src="graphics_data/Scrabble_Tiles/Scrabble_Tile_${tile.letter}.jpg" alt="${tile.letter}">
                    </div>
                `);
                rack.append(tileDiv);
            }
        }
        enableDrag();
    }

    function getRandomTile() {
        const availableTiles = Object.keys(ScrabbleTiles).filter(letter => ScrabbleTiles[letter]["number-remaining"] > 0);
        if (availableTiles.length === 0) return null;

        const randomLetter = availableTiles[Math.floor(Math.random() * availableTiles.length)];
        const tile = ScrabbleTiles[randomLetter];
        tile["number-remaining"]--;
        return { letter: randomLetter, value: tile.value };
    }

    // Enable drag functionality
    function enableDrag() {
        $(".tile").draggable({
            revert: "invalid",
            start: function () {
                $(this).addClass("dragging");
            },
            stop: function () {
                $(this).removeClass("dragging");
            }
        });
    }

    // Enable drop functionality only on valid squares (drop zones)
    function enableDrop() {
        $(".drop-zone").droppable({
            accept: ".tile",
            drop: handleTileDrop
        });
    }

    // Handle dropping a tile on a drop zone
    function handleTileDrop(event, ui) {
        const droppedTile = ui.helper;
        const targetZone = $(this);

        // Ensure the zone is empty (or can be overwritten with the same letter)
        if (targetZone.text() === "") {
            targetZone.text(droppedTile.data("letter"));
            updateCurrentWord(droppedTile);
        } else {
            droppedTile.css({ top: 0, left: 0 });
        }
    }

    // Update the current word and calculate the score
    function updateCurrentWord(tileDiv) {
        currentWord.push(tileDiv.data("letter"));
        calculateScore(currentWord);
    }

    function calculateScore(word) {
        let wordScore = 0;
        let multiplier = 1;

        word.forEach(letter => {
            wordScore += getTileValue(letter);
            // Apply bonus square multipliers if necessary
            if (isBonusSquare(letter)) {
                multiplier *= 2; // Example of bonus multiplier
            }
        });

        wordScore *= multiplier;
        score += wordScore;
        updateScore();
    }

    function getTileValue(letter) {
        return ScrabbleTiles[letter].value;
    }

    function isBonusSquare(letter) {
        // Placeholder logic for bonus squares
        return false; // Modify to handle bonus squares (e.g., double word, triple letter)
    }

    function resetBoard() {
        $(".drop-zone").text(""); // Clears the board (resets drop zones)
    }

    $("#restartGame").click(function () {
        Object.keys(ScrabbleTiles).forEach(letter => {
            ScrabbleTiles[letter]["number-remaining"] = ScrabbleTiles[letter]["original-distribution"];
        });
        resetGame();
    });

    $("#dealTiles").click(function () {
        populateRack();
    });

    resetGame();
    enableDrop();
});