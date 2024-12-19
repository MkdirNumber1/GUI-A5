/**
 * Author: [Evan Kuczynski]
 Email: evan_kuczynski@student.uml.edu
 * Description: js file for the project.
 *
 * Additional notes: []
 */


$(document).ready(function () {

/*  File:  /~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
*  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
*  Copyright (c) 2015 by Jesse M. Heines.  All rights reserved.  May be freely
*    copied or excerpted for educational purposes with credit to the author.*/
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
    "Blank": { "value": 0, "original-distribution": 2, "number-remaining": 2 }
};

const rackSize = 7;
let score = 0;
let currentWord = [];
let currentHand = [];
let placedTiles = []; // Track placed tiles

function resetOrDealTiles() {
    score = 0;
    currentWord = [];
    currentHand = [];
    placedTiles = []; // Clear placed tiles
    resetBoard();
    populateRack();
    updateScore();
}

function updateScore() {
    $("#score").text(score);
}

function populateRack() {
    const rack = $("#rack");
    rack.empty();

    // Deal tiles to fill up the rack to 7 tiles
    let tilesNeeded = rackSize - currentHand.length;
    pickTiles(tilesNeeded);

    currentHand.forEach(letter => {
        const tile = ScrabbleTiles[letter];
        const tileDiv = $(`
            <div class="tile" 
                 data-letter="${letter}" 
                 data-value="${tile.value}">
                <img src="graphics_data/Scrabble_Tiles/Scrabble_Tile_${letter}.jpg" alt="${letter}">
            </div>
        `);
        rack.append(tileDiv);
    });

    enableDrag();
}

function pickTiles(tilesNeeded) {
    while (tilesNeeded > 0) {
        const availableLetters = Object.keys(ScrabbleTiles).filter(letter => ScrabbleTiles[letter]["number-remaining"] > 0);

        if (availableLetters.length === 0) {
            alert("No more tiles available to pick.");
            break;
        }

        const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

        if (!currentHand.includes(randomLetter)) {
            currentHand.push(randomLetter);
            ScrabbleTiles[randomLetter]["number-remaining"]--;
            tilesNeeded--;
        }
    }
}

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

function enableDrop() {
    $(".drop-zone").droppable({
        accept: ".tile",
        drop: handleTileDrop
    });

    $("#rack").droppable({
        accept: ".tile",
        drop: handleTileReturn
    });
}

function handleTileDrop(event, ui) {
    const droppedTile = ui.helper;
    const targetZone = $(this);

    // Ensure the zone is empty (or can be overwritten with the same letter)
    if (targetZone.text() === "") {
        placedTiles.push(droppedTile); // Track the placed tile
        updateCurrentWord(droppedTile);
    } else {
        droppedTile.css({ top: 0, left: 0 }); // Reset the position if zone is occupied
    }
}

function handleTileReturn(event, ui) {
    const returnedTile = ui.helper;
    const tileLetter = returnedTile.data("letter");

    // Remove the specific tile being returned from the current word
    const tileIndex = currentWord.indexOf(tileLetter);
    if (tileIndex !== -1) {
        currentWord.splice(tileIndex, 1); // Remove the tile from the word
    }

    // Add the tile back to the player's hand
    if (!currentHand.includes(tileLetter)) {
        currentHand.push(tileLetter);
        ScrabbleTiles[tileLetter]["number-remaining"]++; // Increase the remaining count
    }

    // Remove the tile from the placedTiles array
    placedTiles = placedTiles.filter(tile => tile.data("letter") !== tileLetter);

    // Reset the position of the tile when it’s returned
    returnedTile.css({ top: 0, left: 0 });

    // Clear the drop zone text when a tile is removed
    $(".drop-zone").each(function () {
        if ($(this).text() === tileLetter) {
            $(this).text(""); // Clear the text (letter) from the drop zone
        }
    });

    // Re-enable the drop functionality for that zone after clearing
    enableDrop();

    // Update the rack after removing the tile
    updateRack();
    updateScore();
}

function updateRack() {
    const rack = $("#rack");
    rack.empty();

    currentHand.forEach(letter => {
        const tile = ScrabbleTiles[letter];
        const tileDiv = $(`
            <div class="tile" 
                 data-letter="${letter}" 
                 data-value="${tile.value}">
                <img src="graphics_data/Scrabble_Tiles/Scrabble_Tile_${letter}.jpg" alt="${letter}">
            </div>
        `);
        rack.append(tileDiv);
    });

    enableDrag();
}

function updateCurrentWord(tileDiv) {
    currentWord.push(tileDiv.data("letter"));
    calculateScore(currentWord);
}

function calculateScore(word) {
    let wordScore = 0;

    word.forEach(letter => {
        wordScore += getTileValue(letter);
    });

    score += wordScore;
    updateScore();
}

function getTileValue(letter) {
    return ScrabbleTiles[letter].value;
}

function resetBoard() {
    $(".drop-zone").text(""); // Clears the board (resets drop zones)
    placedTiles = []; // Reset placed tiles list
}

// Add the "Next Word" button functionality
$("#nextWord").click(function () {
    // Reset the board and score for the next word
    resetBoard();
    currentWord = [];
    score += calculateScore(currentWord);  // Update score for the current word
    updateScore();

    // Deal tiles to fill up the player's hand to 7
    let tilesNeeded = rackSize - currentHand.length;
    pickTiles(tilesNeeded);
    populateRack();
});

$("#restartGame").click(resetOrDealTiles);
$("#dealTiles").click(resetOrDealTiles);

resetOrDealTiles(); // Initialize the game on page load
enableDrop(); // Enable dropping tiles into drop zones
});
