"use strict";

/* 
 * TERMLIST:
 * "Source language" = The language to translate from
 * "Target language" = The language to translate into
 */

const activateButton = (button) => {
    button.classList.add("button-active");
    setTimeout(
        () => { button.classList.remove("button-active"); },
        100
    );
};

let sourceLangIdx = data["columns"].indexOf("finnish");
let targetLangIdx = data["columns"].indexOf("russian");
const columns = data["columns"].length;
let wordMap = Object.fromEntries(
    data["words"]
        .filter((_, i) =>
            sourceLangIdx == (i % columns) ||
            targetLangIdx == (i % columns))
        .flatMap((_, i, a) => i % 2 == 0 ? [a.slice(i, i + 2)] : [])
);
console.log(wordMap);

/**
 * Shuffle words (Fisher-Yates).
 */
const shuffle = (xs) => {
    for (let i = xs.length - 1; 0 <= i; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const x = xs[i];
        xs[i] = xs[j];
        xs[j] = x;
    }
    return xs;
};

let sourceWords = shuffle(Object.keys(wordMap));
console.log(sourceWords);

let wordElem;
const setNextWord = () => {
    wordElem.value = sourceWords.pop();
};

let points = 0;

const putPoints = (n) => {
    const pointsElem = document.getElementById("pointsText");

    points += n;

    pointsElem.classList.remove("error");
    pointsElem.classList.remove("good");

    if (n > 0) {
        pointsElem.classList.add("good");
    } else if (n < 0) {
        pointsElem.classList.add("error");
    }

    pointsElem.textContent = `${points}p`;
};

let inputField;

const handleEnter = () => {
    const answer = inputField.value;
    if (wordMap[wordElem.value] == answer) {
        putPoints(10);

        // TODO: Play the word spoken.

        inputField.value = "";
        setNextWord();
        return;
    } else {
        putPoints(-3);

        inputField.classList.add("error");
    }
};

const handleTab = () => {
    putPoints(-5);

    alert(`${wordElem.value} = ${wordMap[wordElem.value]}`);
    inputField.value = "";
    setNextWord();
};

window.onload = () => {
    // Add virtual key listeners for mobile layout.
    document.getElementById("enter").addEventListener("click", handleEnter);
    document.getElementById("tab").addEventListener("click", handleTab);

    // Show the characters on keys that are subject for translation (keys
    // belonging to selected language pair).
    const keys = document.querySelectorAll("#keyboardArea button");
    for (const key of keys) {
        if (key.classList.contains("static")) {
            continue;
        }
        const langKeys = key.querySelectorAll("div");
        for (const langKey of langKeys) {
            langKey.classList.add("hidden");
        }
        langKeys[sourceLangIdx].classList.remove("hidden");
        langKeys[targetLangIdx].classList.remove("hidden");
        // Set the styling of the key based on source and target language
        // (target language should be highlighted to help user navigate the
        // target keyboard).
        langKeys[sourceLangIdx].classList.add("sourceLang");
        langKeys[targetLangIdx].classList.add("targetLang");
    }

    wordElem = document.getElementById("wordText");
    inputField = document.getElementById("answerInput");
    // Set first word.
    setNextWord();

    putPoints(0);

    document.addEventListener(
        "keydown",
        (e) => {
            inputField.classList.remove("error");

            switch (e.code) {
                case "CapsLock":
                    for (const button of document.querySelectorAll("#keyboardArea button div")) {
                        if (!["caps", "space"].includes(button.textContent)) {
                            const inUpperCase = button.textContent.toUpperCase();
                            button.textContent = button.textContent != inUpperCase
                                ? inUpperCase
                                : button.textContent.toLowerCase();
                        }
                    }
                    break;
                case "Enter":
                    handleEnter();
                    break;
                case "Tab":
                    handleTab();
                    break;
            }

            // Animate the key press on screen.
            const button = document.getElementById(e.code);
            if (button != null) {
                activateButton(button);
            }
        });

    document.addEventListener("keyup", () => {
        // Always focus on the input box.
        inputField.focus();
    });
};
