import { useCallback, useEffect, useRef, useReducer } from 'react'
import Header from './components/Header'
import Stats from './components/Stats'
import TypingContent from './components/TypingContent'
import ResultsScreen from './components/ResultsScreen'
import passageData from '../data.json'
import type { Difficulty, Mode, PassageData } from './types'

const data = passageData as PassageData

function getRandomPassage(difficulty: Difficulty): string {
  const passages = data[difficulty]
  const index = Math.floor(Math.random() * passages.length)
  return passages[index].text
}

function getStoredPersonalBest(): number | null {
  const stored = localStorage.getItem('personalBest')
  return stored ? Number(stored) : null
}

function savePersonalBest(wpm: number) {
  if (wpm <= 0) return
  const current = getStoredPersonalBest()
  if (current === null || wpm > current) {
    localStorage.setItem('personalBest', String(wpm))
  }
}

// --- State & Reducer ---
interface AppState {
  difficulty: Difficulty
  mode: Mode
  currentText: string
  userInput: string
  correctChars: number
  totalTyped: number
  timeLeft: number
  timeElapsed: number
  isStarted: boolean
  isFinished: boolean
  personalBest: number | null
  isNewPersonalBest: boolean
  isFirstTest: boolean
}

type AppAction =
  | { type: 'START' }
  | { type: 'INPUT'; char: string }
  | { type: 'BACKSPACE' }
  | { type: 'TICK' }
  | { type: 'RESTART' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'SET_MODE'; mode: Mode }

function getInitialState(): AppState {
  const storedPB = getStoredPersonalBest()
  return {
    difficulty: 'medium',
    mode: 'timed',
    currentText: getRandomPassage('medium'),
    userInput: '',
    correctChars: 0,
    totalTyped: 0,
    timeLeft: 60,
    timeElapsed: 0,
    isStarted: false,
    isFinished: false,
    personalBest: storedPB,
    isNewPersonalBest: false,
    isFirstTest: storedPB === null,
  }
}

function getResetFields(difficulty: Difficulty): Partial<AppState> {
  return {
    currentText: getRandomPassage(difficulty),
    userInput: '',
    correctChars: 0,
    totalTyped: 0,
    timeLeft: 60,
    timeElapsed: 0,
    isStarted: false,
    isFinished: false,
    isNewPersonalBest: false,
    isFirstTest: false,
  }
}

function computeWpm(correctChars: number, mode: Mode, timeLeft: number, timeElapsed: number): number {
  const elapsed = mode === 'timed' ? 60 - timeLeft : timeElapsed
  const minutes = elapsed / 60
  return minutes > 0 && correctChars > 0
    ? Math.round((correctChars / 5) / minutes)
    : 0
}

function maybeUpdatePB(state: AppState, finalWpm: number): { personalBest: number | null; isNewPersonalBest: boolean } {
  if (finalWpm > 0 && (state.personalBest === null || finalWpm > state.personalBest)) {
    savePersonalBest(finalWpm)
    return { personalBest: finalWpm, isNewPersonalBest: true }
  }
  return { personalBest: state.personalBest, isNewPersonalBest: false }
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START':
      return { ...state, isStarted: true }

    case 'INPUT': {
      if (state.isFinished) return state
      const idx = state.userInput.length
      const isCorrect = action.char === state.currentText[idx]
      const newCorrectChars = isCorrect ? state.correctChars + 1 : state.correctChars
      const newInput = state.userInput + action.char
      const passageComplete = state.mode === 'passage' && idx + 1 >= state.currentText.length

      let newState: AppState = {
        ...state,
        isStarted: true,
        userInput: newInput,
        totalTyped: state.totalTyped + 1,
        correctChars: newCorrectChars,
      }

      if (passageComplete) {
        const elapsedSec = state.timeElapsed > 0 ? state.timeElapsed : 1
        const finalWpm = Math.round((newCorrectChars / 5) / (elapsedSec / 60))
        const pb = maybeUpdatePB(state, finalWpm)
        newState = {
          ...newState,
          isFinished: true,
          personalBest: pb.personalBest,
          isNewPersonalBest: pb.isNewPersonalBest,
          isFirstTest: state.personalBest === null,
        }
      }
      return newState
    }

    case 'BACKSPACE': {
      if (state.isFinished || state.userInput.length === 0) return state
      const lastIdx = state.userInput.length - 1
      const removedChar = state.userInput[lastIdx]
      const expectedChar = state.currentText[lastIdx]
      return {
        ...state,
        userInput: state.userInput.slice(0, -1),
        totalTyped: state.totalTyped - 1,
        correctChars: removedChar === expectedChar ? state.correctChars - 1 : state.correctChars,
      }
    }

    case 'TICK': {
      if (state.mode === 'timed') {
        if (state.timeLeft <= 1) {
          const finalWpm = computeWpm(state.correctChars, 'timed', 0, 0)
          const pb = maybeUpdatePB(state, finalWpm)
          return {
            ...state,
            timeLeft: 0,
            isFinished: true,
            personalBest: pb.personalBest,
            isNewPersonalBest: pb.isNewPersonalBest,
            isFirstTest: state.personalBest === null,
          }
        }
        return { ...state, timeLeft: state.timeLeft - 1 }
      } else {
        return { ...state, timeElapsed: state.timeElapsed + 1 }
      }
    }

    case 'RESTART':
      return {
        ...state,
        ...getResetFields(state.difficulty),
        personalBest: getStoredPersonalBest(),
      }

    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.difficulty,
        ...getResetFields(action.difficulty),
      }

    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
        ...getResetFields(state.difficulty),
      }

    default:
      return state
  }
}


function App() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const {
    difficulty, mode, currentText, userInput,
    correctChars, totalTyped, timeLeft, timeElapsed,
    isStarted, isFinished, personalBest,
    isNewPersonalBest, isFirstTest,
  } = state

  // --- Timer effect ---
  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isStarted, isFinished])

  // --- Derived values ---
  const elapsed = mode === 'timed' ? 60 - timeLeft : timeElapsed
  const minutes = elapsed / 60
  const wpm = minutes > 0 && correctChars > 0
    ? Math.round((correctChars / 5) / minutes)
    : 0
  const accuracy = totalTyped > 0
    ? Math.round((correctChars / totalTyped) * 100)
    : 100

  const displayTime = mode === 'timed'
    ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`
    : `${Math.floor(timeElapsed / 60)}:${String(timeElapsed % 60).padStart(2, '0')}`

  // --- Handlers ---
  const handleInput = useCallback((char: string) => {
    dispatch({ type: 'INPUT', char })
  }, [])

  const handleBackspace = useCallback(() => {
    dispatch({ type: 'BACKSPACE' })
  }, [])

  const restartTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    dispatch({ type: 'RESTART' })
  }, [])

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    if (timerRef.current) clearInterval(timerRef.current)
    dispatch({ type: 'SET_DIFFICULTY', difficulty: newDifficulty })
  }, [])

  const handleModeChange = useCallback((newMode: Mode) => {
    if (timerRef.current) clearInterval(timerRef.current)
    dispatch({ type: 'SET_MODE', mode: newMode })
  }, [])

  const handleStart = useCallback(() => {
    dispatch({ type: 'START' })
  }, [])

  return (
    <div className='bg-neutral-900 font-display min-h-screen'>
      <Header personalBest={personalBest} />
      {isFinished ? (
        <ResultsScreen
          wpm={wpm}
          accuracy={accuracy}
          correctChars={correctChars}
          incorrectChars={totalTyped - correctChars}
          isFirstTest={isFirstTest}
          isNewPersonalBest={isNewPersonalBest}
          onRestart={restartTest}
        />
      ) : (
        <>
          <Stats
            wpm={wpm}
            accuracy={accuracy}
            displayTime={displayTime}
            difficulty={difficulty}
            mode={mode}
            onDifficultyChange={handleDifficultyChange}
            onModeChange={handleModeChange}
          />
          <TypingContent
            currentText={currentText}
            userInput={userInput}
            isStarted={isStarted}
            isFinished={isFinished}
            onInput={handleInput}
            onBackspace={handleBackspace}
            onRestart={restartTest}
            onStart={handleStart}
          />
        </>
      )}
    </div>
  )
}

export default App
