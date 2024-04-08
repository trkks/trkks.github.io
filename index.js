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
                    <label>
                        <input
                            type="radio"
                            id={x}
                            value={x}
                            name={name}
                            checked={x == selectedValue}
                            readOnly={true}
                        />
                        {x}
                    </label>
                </div>
            )
        }
    </fieldset>;
}

function SettingsBar({
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
            options={["FI", "RU"]}
            selectedValue={sourceLang}
            onSelectedValueChange={setSourceLang}
        />
        <RadioSelector
            name="target language"
            options={["FI", "RU"]}
            selectedValue={targetLang}
            onSelectedValueChange={setTargetLang}
        />
   </div>;
}

function TranslationArea({
    sourceWord,
    targetWord,
    onSourceWordChange,
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
                onChange={e => onSourceWordChange(e.target.value)}
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
    checkSourceWord
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
            onKeyInput={_ => checkSourceWord()}
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
    const LANGS = ["FI", "RU"];
    const DICTIONARIES = {};
    DICTIONARIES[LANGS[0]] = {};
    DICTIONARIES[LANGS[1]] = {};
    DICTIONARIES[LANGS[0]][LANGS[1]] = {
        "moro": "privjet"
    };
    DICTIONARIES[LANGS[1]][LANGS[0]] = {
        "privjet": "moro"
    };

    const [sourceLang, setSourceLang] = useState(LANGS[1]);
    const [targetLang, setTargetLang] = useState(LANGS[0]);
    const [sourceWord, setSourceWord] = useState("privjet");
    const [targetWord, setTargetWord] = useState("");
    const [points, setPoints] = useState(0);

    return <div>
        <SettingsBar
            sourceLang={sourceLang}
            targetLang={targetLang}
            setSourceLang={setSourceLang}
            setTargetLang={setTargetLang}
        />
        <TranslationArea
            sourceWord={sourceWord}
            targetWord={targetWord}
            onSourceWordChange={setSourceWord}
            onTargetWordChange={setTargetWord}
            points={points}
        />
        <VirtualKeyboard
            charactersString="qwertyuiopåasdfghjklöäzxcvbnm"
            targetWord={targetWord}
            setTargetWord={setTargetWord}
            checkSourceWord={() => {
                if (targetWord == DICTIONARIES[sourceLang][targetLang][sourceWord]) {
                    setPoints(points + 1);
                }
            }}
        />
    </div>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Page />);
