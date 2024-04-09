const useState = React.useState;


function RadioSelector({
    name,
    options,
    selectedValue,
    onSelectedValueChange
}) {
    return <fieldset onChange={e => onSelectedValueChange(e.target.value)}>
        <legend>Select {name}</legend>
        {
            options.map((x, i) =>
                <div key={x}>
                    <label htmlFor={x}>{x}</label>
                    <input
                        type="radio"
                        id={x}
                        value={x}
                        name={name}
                        checked={x == selectedValue}
                        readOnly={true}
                    />
                </div>
            )
        }
    </fieldset>;
}

function SettingsBar({
    langs,
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang
}) {
    return <div
        style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "10%",
        }}>
        <RadioSelector
            name="source language"
            options={langs}
            selectedValue={sourceLang}
            onSelectedValueChange={setSourceLang}
        />
        <RadioSelector
            name="target language"
            options={langs}
            selectedValue={targetLang}
            onSelectedValueChange={setTargetLang}
        />
   </div>;
}

function TranslationArea({
    sourceWord,
    targetWord,
    onTargetWordChange,
    points
}) {
    return <div
        style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "10%",
        }}>
        <label>
            Source word:
            <input
                type="text"
                value={sourceWord}
                readOnly={true}
            />
        </label>
        <label>
            Target word:
            <input
                type="text"
                value={targetWord}
                onChange={e => onTargetWordChange(e.target.value)}
            />
        </label>
        <label>
            Points:
            <input
                type="number"
                value={points}
                readOnly={true}
            />
        </label>
    </div>;
}

function Keycap({
    character,
    onKeyInput,
    width="60px",
}) {
    return <div
        style={{
            margin: 0,
            padding: 0,
        }}>
        <button
                style={{
                    margin: 0,
                    padding: 0,
                    width: width,
                    height: "60px",
                    fontSize: "20px"
                }}
                onClick={_ => onKeyInput(character)}
            >
            {character}
        </button>
    </div>;
}

function KeycapRow({ caps, leftOffset }) {
    return <div
        style={{
            position: "relative",
            left: leftOffset,
            width: "60%",
            display: "flex",
            flexDirection: "row",
        }}>
        {caps}
    </div>;
}

function VirtualKeyboard({
    charactersString,
    targetWord,
    setTargetWord,
    onEnterKeyInput
}) {
;
    const backSpace = <Keycap
        key={"⌫"}
        character={"⌫"}
        onKeyInput={_ => setTargetWord(
            targetWord.slice(0, targetWord.length - 1)
        )}
        width="80px"
    />

    const row1 = Array.from(charactersString)
        .map(c =>
            <Keycap
                key={c}
                character={c}
                onKeyInput={c => setTargetWord(targetWord + c)}
            />
        );
    const row2 = row1.splice(11);
    const row3 = row2.splice(11);


    // Add enter key (to its place on an ANSI-keyboard) for checking
    // translation.
    row2.push(
        <Keycap
            key={"↵"}
            character={"↵"}
            onKeyInput={onEnterKeyInput}
            width="95px"
        />
    );

    return <div
        style={{
            width: "100%",
            height: "100%",
            marginTop: "10%"
        }}>
        <KeycapRow caps={backSpace} leftOffset={`${13 * 60}px`} />
        <KeycapRow caps={row1} leftOffset="90px" />
        <KeycapRow caps={row2} leftOffset="105px" />
        <KeycapRow caps={row3} leftOffset="135px" />
    </div>;
}

function Page() {
    const EN_RU_WORDS = [
        ["hello"        , "Привет"     ],
        ["dog"          , "собака"     ],
        ["web browser"  , "веб-браузер"],
    ];
    const TRANSLATION_TARGETS = {
        "RU": Object.fromEntries(EN_RU_WORDS),
        "EN": Object.fromEntries(
            EN_RU_WORDS.map(([lhs, rhs]) => [rhs, lhs])
        ),
    }
    // For simplicity, translations from the same language to itself are
    // allowed (prevents having to juggle swapping languages and React
    // re-rendering in between).
    const DICTIONARIES = {
        "EN": TRANSLATION_TARGETS,
        "RU": TRANSLATION_TARGETS
    };

    // The first dimension tells all the available source languages.
    const LANGS = Object.keys(DICTIONARIES);

    // Amount of points is used to select the next word-pair.
    const [points, setPoints] = useState(0);

    const [sourceLang, setSourceLang] = useState(LANGS[0]);
    const [targetLang, setTargetLang] = useState(LANGS[1]);

    const sourceWords = Object.keys(DICTIONARIES[sourceLang][targetLang]);
    const [sourceWord, setSourceWord] = useState(
        sourceWords[points % sourceWords.length]
    );
    const [targetWord, setTargetWord] = useState("");

    const swapLangs = (newSourceLang) => {
        setTargetLang(sourceLang)
        setSourceLang(newSourceLang);
    };

    return <div>
        <SettingsBar
            langs={LANGS}
            sourceLang={sourceLang}
            targetLang={targetLang}
            setSourceLang={setSourceLang}
            setTargetLang={setTargetLang}
        />
        <TranslationArea
            sourceWord={sourceWord}
            targetWord={targetWord}
            onTargetWordChange={setTargetWord}
            points={points}
        />
        <VirtualKeyboard
            charactersString="qwertyuiopåasdfghjklöäzxcvbnm"
            targetWord={targetWord}
            setTargetWord={setTargetWord}
            // NOTE: Just React things (I guess): If this checker-callback
            // took an argument named 'targetWord_' (to show the reader it is
            // the same as 'targetWord' but as the callback argument) the
            // parameter would be undefined and not the input string :----).
            onEnterKeyInput={() => {
                const correctAnswer = DICTIONARIES[sourceLang][targetLang][sourceWord];
                if (targetWord.toLowerCase() === correctAnswer.toLowerCase()) {
                    setPoints(points + 1);
                    // Loop back to start when run out of words.
                    setSourceWord(sourceWords[points % sourceWords.length]);
                }
            }}
        />
    </div>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Page />);
