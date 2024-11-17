"use strict";

const activateButton =  (button) => {
    button.classList.add("button-active");
    setTimeout(
        () => { button.classList.remove("button-active"); },
        150
    );
};

window.onload = () => {
    let compositionUpdateData = "";
    // This is needed to identify "Dead" keys (e.g., pressing '^' key once in
    // order to type 'â').
    document.addEventListener(
        "compositionupdate",
        (e) => {
            compositionUpdateData = e.data;
        });

    document.addEventListener(
        "keydown",
        (e) => {
            // Always type in the input box.
            document.querySelector("input").focus();

            // Handle special cases.
            let key = e.key.toLowerCase();
            switch (e.key) {
                case "shift":
                    if (e.location == 0x01) {
                        key = "shiftleft";
                    } else if (e.location == 0x02) {
                        key = "shiftright";
                    }
                    break;
                case "dead":
                    // Try to sync the keypress to the "compositionupdate" event.
                    let compositionCharacter = compositionUpdateData;
                    compositionUpdateData = "";
                    if (["´", "¨"].includes(compositionCharacter)) {
                        key = compositionCharacter;
                    }
                    break;
            }

            // Animate the key press on screen.
            const button = document.getElementById(key);
            if (button != null) {
                activateButton(button);
            }
        });
};
