import { grommet, Grommet } from 'grommet';
import { useRef, useState, useEffect } from 'react';
import './App.css';
import Login from './Components/Login';

const sentence = [
  "Sometimes I'll start a sentence and I don't even know where it's going. I just hope I find it along the way.",
  "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.",
  "I'm not superstitious, but I am a little stitious.",
  "Identity theft is not a joke, Jim! Millions of families suffer every year.",
  "If I were buying my coffin, I would get one with thicker walls so you couldn't hear the other dead people."
];
export function App() {
  const textInputRef = useRef(null);
  const times = useRef({
    startTime: null,
    endTime: null,
    timeDifference: null
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: '' })
  const [sentenceArray, setSentenceArray] = useState([]);
  const [typedWord, setTypedWord] = useState("");
  const [currentWord, setCurrentWord] = useState(0);
  const [correctLettersArray, setCorrectLettersArray] = useState([]);
  const [result, setResult] = useState(null);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    getRandomSentence();
  }, []);

  const getRandomSentence = () => {
    let tempArray = sentence[Math.floor(Math.random() * sentence.length)].split(
      " "
    );
    tempArray = tempArray.map((word) => word.split(""));
    for (let i = 0; i < tempArray.length - 1; i++) {
      tempArray[i].push(" ");
    }
    console.log(tempArray);
    setSentenceArray(tempArray);
  };

  useEffect(() => {
    if (currentWord === sentenceArray.length && sentenceArray.length !== 0) {
      textInputRef.current.blur();
      times.current.endTime = performance.now();
      times.current.timeDifference =
        (times.current.endTime - times.current.startTime) / 1000;
      const wordsPerMinute =
        (60 * sentenceArray.length) / times.current.timeDifference;
      console.log(times.current.timeDifference);
      setResult(Math.round(wordsPerMinute));
      return;
    }
  }, [currentWord, sentenceArray.length]);

  const newLetter = (event) => {
    if (event.target.value.length > sentenceArray[currentWord].length) return;
    setTypedWord(event.target.value);

    let tempArray = [];
    for (let i = 0; i < event.target.value.length; i++) {
      if (event.target.value[i] === sentenceArray[currentWord][i])
        tempArray.push("correct");
      else tempArray.push("wrong");
    }
    setCorrectLettersArray(tempArray);
    if (
      tempArray.length === sentenceArray[currentWord].length &&
      !tempArray.includes("wrong")
    ) {
      setCurrentWord(currentWord + 1);
      setTypedWord("");
      setCorrectLettersArray([]);
    }
  };

  const startTest = () => {
    setIsStarted(true);
    textInputRef.current.focus();
    times.current.startTime = performance.now();
  };

  const refreshTest = () => {
    setTypedWord("");
    setCurrentWord(0);
    setCorrectLettersArray([]);
    setResult(null);
    getRandomSentence();
    setIsStarted(false);
  };

  if (!isLoggedIn) {
    return (
      <Login
        user={user}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />
    )
  }

  return (
    <Grommet theme={grommet}>
      <div className="App">
        <h1>Test your Typing Speed</h1>
        {isStarted && <p>Start typing now!</p>}
        <div className="textArea">
          {sentenceArray.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className={wordIndex < currentWord ? "correct" : ""}
            >
              {word.map((letter, letterIndex) => (
                <span
                  key={letterIndex}
                  className={
                    wordIndex === currentWord
                      ? correctLettersArray[letterIndex]
                        ? correctLettersArray[letterIndex]
                        : letterIndex === correctLettersArray.length
                          ? "currentLetter"
                          : ""
                      : ""
                  }
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </div>
        <div>
          <input
            id="textInput"
            type="text"
            ref={textInputRef}
            value={typedWord}
            onChange={(e) => newLetter(e)}
            style={{ width: "0", opacity: "0" }}
          />
        </div>
        {!isStarted && (
          <button onClick={() => startTest()} className="startButton">
            Start
          </button>
        )}
        <button onClick={() => refreshTest()} className="startButton">
          Refresh
      </button>
        {result && <h1>{`${result} WPM`}</h1>}
      </div>
    </Grommet>
  );
}

export default App;
