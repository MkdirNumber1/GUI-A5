/**
 * Author: [Evan Kuczynski]
 Email: evan_kuczynski@student.uml.edu
 * Description: js file for the project. This JavaScript file controls the main parts of a Scrabble-like game,
 * including the player's tile rack, placing tiles on the board, and keeping track of the score.
 * It updates the tile rack to make sure the player has enough tiles and allows tiles to be moved
 * around using drag-and-drop. The file also tracks the words created on the board and calculates
 * the score based on the tiles used. It lets the player reset the game, clearing the board and
 * giving them new tiles. In short, it handles the game's tile management, score updates,
 * and resetting the board.
 *
 * Additional notes: []
 */


$(document).ready(function () {

    /*  File:  /~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
    *  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
    *  Copyright (c) 2015 by Jesse M. Heines.  All rights reserved.  May be freely
    *    copied or excerpted for educational purposes with credit to the author.*/
    const ScrabbleTiles = {
        "A": {"value": 1, "original-distribution": 9, "number-remaining": 9},
        "B": {"value": 3, "original-distribution": 2, "number-remaining": 2},
        "C": {"value": 3, "original-distribution": 2, "number-remaining": 2},
        "D": {"value": 2, "original-distribution": 4, "number-remaining": 4},
        "E": {"value": 1, "original-distribution": 12, "number-remaining": 12},
        "F": {"value": 4, "original-distribution": 2, "number-remaining": 2},
        "G": {"value": 2, "original-distribution": 3, "number-remaining": 3},
        "H": {"value": 4, "original-distribution": 2, "number-remaining": 2},
        "I": {"value": 1, "original-distribution": 9, "number-remaining": 9},
        "J": {"value": 8, "original-distribution": 1, "number-remaining": 1},
        "K": {"value": 5, "original-distribution": 1, "number-remaining": 1},
        "L": {"value": 1, "original-distribution": 4, "number-remaining": 4},
        "M": {"value": 3, "original-distribution": 2, "number-remaining": 2},
        "N": {"value": 1, "original-distribution": 6, "number-remaining": 6},
        "O": {"value": 1, "original-distribution": 8, "number-remaining": 8},
        "P": {"value": 3, "original-distribution": 2, "number-remaining": 2},
        "Q": {"value": 10, "original-distribution": 1, "number-remaining": 1},
        "R": {"value": 1, "original-distribution": 6, "number-remaining": 6},
        "S": {"value": 1, "original-distribution": 4, "number-remaining": 4},
        "T": {"value": 1, "original-distribution": 6, "number-remaining": 6},
        "U": {"value": 1, "original-distribution": 4, "number-remaining": 4},
        "V": {"value": 4, "original-distribution": 2, "number-remaining": 2},
        "W": {"value": 4, "original-distribution": 2, "number-remaining": 2},
        "X": {"value": 8, "original-distribution": 1, "number-remaining": 1},
        "Y": {"value": 4, "original-distribution": 2, "number-remaining": 2},
        "Z": {"value": 10, "original-distribution": 1, "number-remaining": 1},
        "Blank": {"value": 0, "original-distribution": 2, "number-remaining": 2}
    };

    const rackSize = 7; // The number of tiles that should be in the rack at all times
    let score = 0; // Initialize score to 0 at the start of the game
    let currentWord = []; // An array to keep track of the current word being formed
    let currentHand = []; // An array to hold the tiles in the player's hand
    let placedTiles = []; // Array to track tiles that are placed on the board

    // Function to reset or deal tiles to the player
    function resetOrDealTiles() {
        score = 0; // Reset the score
        currentWord = []; // Clear the current word
        currentHand = []; // Clear the player's hand
        placedTiles = []; // Clear placed tiles on the board
        resetBoard(); // Reset the board to its initial state
        populateRack(); // Refill the player's rack with tiles
        updateScore(); // Update the displayed score on the UI
    }

    // Function to update the score displayed in the UI
    function updateScore() {
        $("#score").text(score); // Set the score element's text to the current score
    }

    // Function to populate the rack with tiles
    function populateRack() {
        const rack = $("#rack");
        rack.empty(); // Clear the rack element before populating it with tiles

        // Determine how many more tiles are needed to fill the rack to 7
        let tilesNeeded = rackSize - currentHand.length;
        pickTiles(tilesNeeded); // Call pickTiles to pick the necessary tiles

        // Iterate through the current hand and add each tile to the rack in the UI
        currentHand.forEach(letter => {
            const tile = ScrabbleTiles[letter]; // Get the tile data for the current letter
            const tileDiv = $(`
            <div class="tile" 
                 data-letter="${letter}" 
                 data-value="${tile.value}">
                <img src="graphics_data/Scrabble_Tiles/Scrabble_Tile_${letter}.jpg" alt="${letter}">
            </div>
        `); // Create the HTML for the tile
            rack.append(tileDiv); // Add the tile to the rack element
        });

        enableDrag(); // Enable drag functionality for the newly added tiles
    }

    // Function to pick tiles for the player's hand
    function pickTiles(tilesNeeded) {
        while (tilesNeeded > 0) {
            // Get the list of letters that still have available tiles
            const availableLetters = Object.keys(ScrabbleTiles).filter(letter => ScrabbleTiles[letter]["number-remaining"] > 0);

            // If there are no available tiles left to pick, show an alert and stop
            if (availableLetters.length === 0) {
                alert("No more tiles available to pick.");
                break;
            }

            // Randomly pick a letter from the available tiles
            const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

            // Ensure that the letter hasn't already been picked for the hand
            if (!currentHand.includes(randomLetter)) {
                currentHand.push(randomLetter); // Add the picked letter to the hand
                ScrabbleTiles[randomLetter]["number-remaining"]--; // Decrease the available tile count for that letter
                tilesNeeded--; // Decrease the number of tiles needed
            }
        }
    }

// Function to enable dragging functionality for tiles
    function enableDrag() {
        $(".tile").draggable({
            revert: "invalid", // If the tile is not dropped in a valid place, revert it to its original position
            start: function () {
                $(this).addClass("dragging"); // Add a class when dragging starts
            },
            stop: function () {
                $(this).removeClass("dragging"); // Remove the dragging class when dragging stops
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
            droppedTile.css({top: 0, left: 0}); // Reset the position if zone is occupied
        }
    }

    function handleTileReturn(event, ui) {
        const returnedTile = ui.helper;
        const tileLetter = returnedTile.data("letter");
        const tileValue = getTileValue(tileLetter); // Get the tile's score value

        // Deduct the tile's value from the score
        score -= tileValue;
        updateScore();

        // Remove the specific tile from the current word
        const tileIndex = currentWord.indexOf(tileLetter);
        if (tileIndex !== -1) {
            currentWord.splice(tileIndex, 1); // Remove the letter from the word
        }

        // Add the tile back to the rack
        if (!currentHand.includes(tileLetter)) {
            currentHand.push(tileLetter);
            ScrabbleTiles[tileLetter]["number-remaining"]++; // Increment the count for this letter
        }

        // Remove the tile from the `placedTiles` array
        placedTiles = placedTiles.filter(tile => tile[0] !== returnedTile[0]);

        // Find the drop zone this tile occupied and clear its content
        const dropZone = returnedTile.closest(".drop-zone");
        if (dropZone.length) {
            dropZone.text(""); // Clear the specific drop zone
            dropZone.droppable("enable"); // Re-enable dropping into this zone
        }

        // Reset the position of the returned tile
        returnedTile.css({top: 0, left: 0});

        // Update the rack to show the returned tile
        updateRack();
    }


    // Function to update the player's tile rack
    function updateRack() {
        const rack = $("#rack"); // Get the rack element from the DOM
        rack.empty(); // Clear the existing tiles from the rack

        // Loop through the current hand (array of letters) and add each tile to the rack
        currentHand.forEach(letter => {
            const tile = ScrabbleTiles[letter]; // Get the tile data for the current letter
            const tileDiv = $(`
            <div class="tile" 
                 data-letter="${letter}" 
                 data-value="${tile.value}">
                <img src="graphics_data/Scrabble_Tiles/Scrabble_Tile_${letter}.jpg" alt="${letter}">
            </div>
        `); // Create a new div element for the tile, containing the letter and value data attributes

            rack.append(tileDiv); // Append the new tile div to the rack element
        });

        enableDrag(); // Enable the drag functionality for the newly added tiles
    }

    // Function to update the current word being formed with the dropped tile
    function updateCurrentWord(tileDiv) {
        currentWord.push(tileDiv.data("letter")); // Add the letter of the dropped tile to the current word
        calculateScore(currentWord); // Recalculate the score after adding the tile to the word
    }

    // Function to calculate the score for a given word
    function calculateScore(word) {
        let wordScore = 0; // Initialize the score for the word

        // Loop through each letter in the word and add its value to the word score
        word.forEach(letter => {
            wordScore += getTileValue(letter); // Get the value of the tile for each letter and add it to wordScore
        });

        score += wordScore; // Add the word score to the total score
        updateScore(); // Update the displayed score in the UI
    }

    // Function to get the value of a tile based on its letter
    function getTileValue(letter) {
        return ScrabbleTiles[letter].value; // Return the value of the tile from the ScrabbleTiles data
    }

    // Function to reset the game board (clear placed tiles and drop zones)
    function resetBoard() {
        $(".drop-zone").text(""); // Clear the text inside all drop zones (reset them)
        placedTiles = []; // Reset the list of placed tiles
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
