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

let sourceLang = "finnish";
let targetLang = "russian";
let sourceLangIdx = data["columns"].indexOf(sourceLang);
let targetLangIdx = data["columns"].indexOf(targetLang);
const columns = data["columns"].length;
let wordMap = Object.fromEntries(
    data["words"]
        .filter((_, i) =>
            sourceLangIdx == (i % columns) ||
            targetLangIdx == (i % columns))
        .flatMap((_, i, a) => i % 2 == 0 ? [a.slice(i, i + 2)] : [])
);
for (let word of data["gpt"]) {
    wordMap[word["FI"]] = word["RU"];
}
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
let prevWordElem;
let oldWordElem;

let inputField;
let prevInputField;
let oldInputField;

const rotateWords = (doPop) => {
    oldWordElem.value = prevWordElem.value;
    prevWordElem.value = wordElem.value;
    if (doPop) {
        wordElem.value = sourceWords.pop();
    }

    oldInputField.value = prevInputField.value;
    prevInputField.value = inputField.value;

    // This also keeps mobile keyboard visible between switches(?).
    inputField.focus();
};

let points = 0;
let pointsElem;
let prevPointsElem;
let oldPointsElem;

const putPoints = (n) => {
    points += n;

    oldPointsElem.classList = prevPointsElem.classList;

    let pointValue = "0p";
    if (n > 0) {
        prevPointsElem.classList.remove("error");
        prevPointsElem.classList.add("good");
        pointValue = `+${n}p`;
    } else if (n < 0) {
        prevPointsElem.classList.remove("good");
        prevPointsElem.classList.add("error");
        pointValue = `${n}p`;
    }

    pointsElem.value = `${points}p`;
    oldPointsElem.value = prevPointsElem.value;
    prevPointsElem.value = pointValue;
};

const handleEnter = () => {
    const answer = inputField.value;
    if (wordMap[wordElem.value].toLowerCase() == answer.toLowerCase()) {
        putPoints(10);
        rotateWords(true);

        // TODO: Play the word spoken.

        inputField.value = "";
    } else {
        putPoints(-3);
        rotateWords();

        inputField.classList.add("error");
    }
};

const handleTab = () => {
    putPoints(-5);

    inputField.value = wordMap[wordElem.value];

    // Put the word back to the deck to try again later.
    const failedWord = wordElem.value;
    rotateWords(true);
    sourceWords.splice(0, 0, failedWord);

    inputField.value = "";
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

    [wordElem, prevWordElem, oldWordElem] =
        document.querySelectorAll(".wordField");
    [inputField, prevInputField, oldInputField] =
        document.querySelectorAll(".answerField");
    [pointsElem, prevPointsElem, oldPointsElem] =
        document.querySelectorAll(".pointsField");


    // Add flag icons next to the language fields.
    wordElem.classList.add(sourceLang);
    prevWordElem.classList.add(sourceLang);
    oldWordElem.classList.add(sourceLang);

    inputField.classList.add(targetLang);
    prevInputField.classList.add(targetLang);
    oldInputField.classList.add(targetLang);

    pointsElem.classList.add(targetLang);


    // Set first word.
    rotateWords(true);

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
