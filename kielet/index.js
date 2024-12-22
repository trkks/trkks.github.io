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
let wordShuffle = Object.keys(wordMap);

let wordElem;
const setNextWord = () => {
    wordElem.textContent = wordShuffle.pop();
};

window.onload = () => {
    wordElem = document.getElementById("wordText");
    // Set first word.
    setNextWord();

    let compositionUpdateData = "";
    // This is needed to identify "Dead" keys (e.g., pressing '^' key once in
    // order to type 'â').
    document.addEventListener(
        "compositionupdate",
        (e) => {
            compositionUpdateData = e.data;
        });

    const inputField = document.querySelector("input");

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
                    const answer = document.getElementById("answerInput").value;
                    if (wordMap[wordElem.textContent] == answer) {
                        // TODO: Play the word spoken.
                        document.getElementById("answerInput").value = "";
                        setNextWord();
                        return;
                    }
                    inputField.classList.add("error");
                    break;
                case "Tab":
                    alert(`${wordElem.textContent} = ${wordMap[wordElem.textContent]}`);
                    setNextWord();
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
