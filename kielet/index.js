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

let sourceLangIdx = data["columns"].indexOf("english");
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

    // Mapping of key-IDs to characters to input.
    const characters = {
        "russian": {
            "§": "ё",
            "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г", "i": "ш", "o": "щ", "p": "з", "å": "х", "¨": "ъ",
            "a": "ф", "s": "ы", "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д", "ö": "ж", "ä": "э",
            "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и", "n": "т", "m": "ь", ",": "б", ".": "ю",
            " ": " "
        },
        "finnish": {},
    };

    let compositionUpdateData = "";
    // This is needed to identify "Dead" keys (e.g., pressing '^' key once in
    // order to type 'â').
    document.addEventListener(
        "compositionupdate",
        (e) => {
            compositionUpdateData = e.data;
        });

    const inputField = document.querySelector("input");
    let inputBuffer = "";

    document.addEventListener(
        "keydown",
        (e) => {
            inputField.classList.remove("error");

            var key = e.key.toLowerCase();

            switch (key) {
                case "backspace":
                    inputBuffer = inputBuffer.slice(0, -1);
                    break;
                case "capslock":
                    for (const button of document.querySelectorAll("button")) {
                        if (!["caps", "space"].includes(button.textContent)) {
                            const inUpperCase = button.textContent.toUpperCase();
                            button.textContent = button.textContent != inUpperCase
                                ? inUpperCase
                                : button.textContent.toLowerCase();
                        }
                    }
                    break;
                case "dead":
                    // Try to sync the keypress to the "compositionupdate" event.
                    let compositionCharacter = compositionUpdateData;
                    compositionUpdateData = "";
                    if (["¨"].includes(compositionCharacter)) {
                        key = compositionCharacter;
                    }
                case "enter":
                    if (wordMap[wordElem.textContent] == inputBuffer) {
                        // TODO: Play the word spoken.
                        inputBuffer = "";
                        setNextWord();
                        return;
                    }
                    inputField.classList.add("error");
                    break;
                case "shift":
                    if (e.location == 0x01) {
                        key = "shiftleft";
                    } else if (e.location == 0x02) {
                        key = "shiftright";
                    }
                    break;
                case "tab":
                    alert(`${wordElem.textContent} = ${wordMap[wordElem.textContent]}`);
                    inputBuffer = "";
                    setNextWord();
                    break;
            }

            // if control is pressed do not add stuff to buffer in order to for
            // example allow Ctrl-A+C copying the text.
            if (!e.ctrlKey) {
                const inputCharacter = characters["russian"][key];
                if (inputCharacter != undefined) {
                    inputBuffer += (e.shiftKey || e.getModifierState("CapsLock"))
                        ? inputCharacter.toUpperCase()
                        : inputCharacter;
                }
            }

            // Animate the key press on screen.
            const button = document.getElementById(key);
            if (button != null) {
                activateButton(button);
            }
        });

    document.addEventListener("keyup", () => {
        // Always focus on the input box.
        inputField.focus();

        // Update on keyup to prevent input field showing "real" input
        // character in last position.
        inputField.value = inputBuffer;
    });
};
