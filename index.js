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
                        checked={x === selectedValue}
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
            marginTop: "3%",
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
            marginTop: "3%",
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
    alphabetRows,
    targetWord,
    setTargetWord,
    onEnterKeyInput
}) {
    const backSpace = <Keycap
        key={"⌫"}
        character={"⌫"}
        onKeyInput={_ => setTargetWord(
            targetWord.slice(0, targetWord.length - 1)
        )}
        width="80px"
    />

    const keyRows = alphabetRows.map(s =>
        Array.from(s).map(c =>
            <Keycap
                key={c}
                character={c}
                onKeyInput={c => setTargetWord(targetWord + c)}
            />
        )
    );
    const row1 = keyRows[0]
    const row2 = keyRows[1]
    const row3 = keyRows[2]


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
            height: "100%",
            marginTop: "3%"
        }}>
        <KeycapRow caps={backSpace} leftOffset={`${12 * 60}px`} />
        <KeycapRow caps={row1} leftOffset="0px" />
        <KeycapRow caps={row2} leftOffset="15px" />
        <KeycapRow caps={row3} leftOffset="45px" />
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
        "EN": {
            "keys": ["qwertyuiop\0\0", "asdfghjkl\0\0\0", "zxcvbnm\0\0\0"],
            "words": TRANSLATION_TARGETS,
        },
        "RU": {
            // TODO Add "ё"
            "keys": ["йцукенгшщзхъ", "фывапролджэ", "ячсмитьбю"],
            "words": TRANSLATION_TARGETS,
        },
    };

    // The first dimension tells all the available source languages.
    const LANGS = Object.keys(DICTIONARIES);

    // Amount of points is used to select the next word-pair.
    const [points, setPoints] = useState(0);

    const [sourceLang, setSourceLang] = useState(LANGS[0]);
    const [targetLang, setTargetLang] = useState(LANGS[1]);

    const sourceWords = Object.keys(DICTIONARIES[sourceLang]["words"][targetLang]);
    const [sourceWord, setSourceWord] = useState(
        sourceWords[points % sourceWords.length]
    );
    const [targetWord, setTargetWord] = useState("");

    const swapLangs = (newSourceLang) => {
        setTargetLang(sourceLang)
        setSourceLang(newSourceLang);
    };
    console.log(DICTIONARIES);

    return <>
        <label>
            Points:
            <input
                type="number"
                value={points}
                readOnly={true}
            />
        </label>
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10%",
            }}>
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
        </div>
        <VirtualKeyboard
            alphabetRows={DICTIONARIES[sourceLang]["keys"]}
            targetWord={targetWord}
            setTargetWord={setTargetWord}
            // NOTE: Just React things (I guess): If this checker-callback
            // took an argument named 'targetWord_' (to show the reader it is
            // the same as 'targetWord' but as the callback argument) the
            // parameter would be undefined and not the input string :----).
            onEnterKeyInput={() => {
                const correctAnswer = DICTIONARIES[sourceLang]["words"][targetLang][sourceWord];
                if (targetWord.toLowerCase() === correctAnswer.toLowerCase()) {
                    setPoints(points + 1);
                    // Loop back to start when run out of words.
                    setSourceWord(sourceWords[points % sourceWords.length]);
                }
            }}
        />
    </>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Page />);
