import { useRef, useEffect } from 'react'
import RestartIcon from '../assets/images/icon-restart.svg'

interface TypingContentProps {
    currentText: string
    userInput: string
    isStarted: boolean
    isFinished: boolean
    onInput: (char: string) => void
    onBackspace: () => void
    onRestart: () => void
    onStart: () => void
}

export default function TypingContent({
    currentText,
    userInput,
    isStarted,
    isFinished,
    onInput,
    onBackspace,
    onRestart,
    onStart,
}: TypingContentProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Keep focus on the hidden input so keystrokes are captured
    useEffect(() => {
        inputRef.current?.focus()
    }, [currentText])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isFinished) return

        if (e.key === 'Backspace') {
            e.preventDefault()
            onBackspace()
            return
        }

        // Ignore modifier keys, function keys, etc.
        if (e.ctrlKey || e.metaKey || e.altKey) return
        if (e.key.length !== 1) return

        e.preventDefault()
        onInput(e.key)
    }

    const focusInput = () => {
        inputRef.current?.focus()
        if (!isStarted) onStart()
    }

    const cursorIndex = userInput.length

    return (
        <div className="px-4 sm:px-6 md:px-10 pb-8 sm:pb-12 max-w-6xl mx-auto">
            {/* Hidden input to capture keyboard events */}
            <input
                ref={inputRef}
                type="text"
                className="absolute opacity-0 pointer-events-none"
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    if (!isFinished) {
                        setTimeout(() => inputRef.current?.focus(), 10)
                    }
                }}
                autoFocus
                aria-label="Type here"
            />

            {/* Passage display with start overlay */}
            <div className="relative">
                <div
                    ref={containerRef}
                    onClick={focusInput}
                    className="text-[22px] sm:text-[26px] md:text-[30px] leading-[1.55] sm:leading-[1.65] md:leading-[1.7] py-6 sm:py-8 cursor-text select-none font-semibold"
                >
                    {currentText.split('').map((char, index) => {
                        let colorClass = 'text-neutral-500' // untyped
                        let bgClass = ''

                        if (index < cursorIndex) {
                            if (userInput[index] === char) {
                                colorClass = 'text-green-500'
                            } else {
                                colorClass = 'text-red-500'
                                bgClass = 'bg-red-500/20 rounded-sm'
                            }
                        } else if (index === cursorIndex) {
                            colorClass = 'text-yellow-400'
                        }

                        const isCursor = index === cursorIndex && !isFinished

                        return (
                            <span
                                key={index}
                                className={`${colorClass} ${bgClass} ${isCursor ? 'cursor-char' : ''} transition-colors duration-75`}
                            >
                                {char}
                            </span>
                        )
                    })}
                </div>

                {/* Start overlay — shown before user starts typing */}
                {!isStarted && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900/60 backdrop-blur-[2px] rounded-lg">
                        <button
                            onClick={focusInput}
                            className="bg-blue-600 hover:bg-blue-600/90 text-neutral-0 font-semibold px-8 py-3 rounded-full text-base cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                        >
                            Start Typing Test
                        </button>
                        <p className="text-neutral-400 text-sm">Or click the text and start typing</p>
                    </div>
                )}
            </div>

            {/* Separator line */}
            <div className="border-t border-neutral-800 mb-6 sm:mb-8"></div>

            {/* Restart button */}
            <div className="flex justify-center">
                <button
                    onClick={(e) => {
                        e.currentTarget.blur()
                        onRestart()
                        setTimeout(() => inputRef.current?.focus(), 50)
                    }}
                    className="flex items-center gap-2.5 bg-neutral-800 text-neutral-0 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl cursor-pointer transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                >
                    <span className="font-semibold text-sm">Restart Test</span>
                    <img src={RestartIcon} alt="restart" className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}