import { useState, useRef, useEffect } from 'react'
import type { Difficulty, Mode } from '../types'
import DownArrow from '../assets/images/icon-down-arrow.svg'

const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
const modes: Mode[] = ['timed', 'passage']

interface StatsProps {
    wpm: number
    accuracy: number
    displayTime: string
    difficulty: Difficulty
    mode: Mode
    onDifficultyChange: (difficulty: Difficulty) => void
    onModeChange: (mode: Mode) => void
}

export default function Stats({
    wpm,
    accuracy,
    displayTime,
    difficulty,
    mode,
    onDifficultyChange,
    onModeChange,
}: StatsProps){
    const accuracyColor = accuracy >= 97 ? 'text-green-500' : 'text-red-500'

    const [difficultyOpen, setDifficultyOpen] = useState(false)
    const [modeOpen, setModeOpen] = useState(false)
    const difficultyRef = useRef<HTMLDivElement>(null)
    const modeRef = useRef<HTMLDivElement>(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (difficultyRef.current && !difficultyRef.current.contains(e.target as Node)) {
                setDifficultyOpen(false)
            }
            if (modeRef.current && !modeRef.current.contains(e.target as Node)) {
                setModeOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <section className="px-4 sm:px-6 md:px-10 py-4 max-w-6xl mx-auto">
            {/* ===== Desktop / tablet layout ===== */}
            <div className="hidden sm:flex sm:flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left: WPM / Accuracy / Time */}
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-400 text-[16px]">WPM:</span>
                        <span className="text-neutral-0 font-bold text-[16px]">{wpm}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-400 text-[16px]">Accuracy:</span>
                        <span className={`font-bold text-[16px] ${accuracyColor}`}>{accuracy}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-400 text-[16px]">Time:</span>
                        <span className="text-neutral-0 font-bold text-[16px]">{displayTime}</span>
                    </div>
                </div>

                {/* Right: Difficulty + Mode pill toggles */}
                <div className="flex items-center gap-6">
                    {/* Difficulty pills */}
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-400 text-sm">Difficulty:</span>
                        <div className="flex gap-1">
                            {difficulties.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => onDifficultyChange(d)}
                                    className={`px-3 py-1 rounded-md text-sm capitalize cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400
                                        ${d === difficulty
                                            ? 'border border-neutral-0 text-neutral-0 font-semibold'
                                            : 'border border-transparent text-neutral-400 hover:text-neutral-0'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mode pills */}
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-400 text-sm">Mode:</span>
                        <div className="flex gap-1">
                            {modes.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => onModeChange(m)}
                                    className={`px-3 py-1 rounded-md text-sm capitalize cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400
                                        ${m === mode
                                            ? 'border border-blue-400 text-neutral-0 font-semibold'
                                            : 'border border-transparent text-neutral-400 hover:text-neutral-0'
                                        }`}
                                >
                                    {m === 'timed' ? 'Timed (60s)' : 'Passage'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Mobile layout (≤450px via sm:hidden) ===== */}
            <div className="flex flex-col gap-4 sm:hidden">
                {/* Stats: 3-column grid */}
                <div className="grid grid-cols-3 divide-x divide-neutral-800">
                    <div className="flex flex-col items-start px-1">
                        <span className="text-neutral-400 text-xs">WPM:</span>
                        <span className="text-neutral-0 font-bold text-xl">{wpm}</span>
                    </div>
                    <div className="flex flex-col items-center px-1">
                        <span className="text-neutral-400 text-xs">Accuracy:</span>
                        <span className={`font-bold text-xl ${accuracyColor}`}>{accuracy}%</span>
                    </div>
                    <div className="flex flex-col items-end px-1">
                        <span className="text-neutral-400 text-xs">Time:</span>
                        <span className="text-neutral-0 font-bold text-xl">{displayTime}</span>
                    </div>
                </div>

                {/* Custom Dropdowns: Difficulty + Mode */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Difficulty dropdown */}
                    <div className="relative" ref={difficultyRef}>
                        <button
                            onClick={() => { setDifficultyOpen(!difficultyOpen); setModeOpen(false) }}
                            aria-label="Difficulty"
                            className="w-full flex items-center justify-between bg-transparent border border-neutral-800 text-neutral-0 text-sm font-semibold rounded-full px-4 py-2.5 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                        >
                            <span className="capitalize">{difficulty}</span>
                            <img
                                src={DownArrow}
                                alt=""
                                className={`w-3.5 h-3.5 transition-transform ${difficultyOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {difficultyOpen && (
                            <ul className="absolute top-full left-0 right-0 mt-1.5 bg-neutral-800 border border-neutral-800 rounded-xl py-1.5 z-20 shadow-lg">
                                {difficulties.map((d) => (
                                    <li key={d}>
                                        <button
                                            onClick={() => { onDifficultyChange(d); setDifficultyOpen(false) }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-neutral-900/40 transition-colors"
                                        >
                                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${d === difficulty ? 'border-blue-400' : 'border-neutral-500'}`}>
                                                {d === difficulty && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                                            </span>
                                            <span className={`capitalize ${d === difficulty ? 'text-neutral-0 font-semibold' : 'text-neutral-400'}`}>
                                                {d}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Mode dropdown */}
                    <div className="relative" ref={modeRef}>
                        <button
                            onClick={() => { setModeOpen(!modeOpen); setDifficultyOpen(false) }}
                            aria-label="Mode"
                            className="w-full flex items-center justify-between bg-transparent border border-neutral-800 text-neutral-0 text-sm font-semibold rounded-full px-4 py-2.5 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                        >
                            <span>{mode === 'timed' ? 'Timed (60s)' : 'Passage'}</span>
                            <img
                                src={DownArrow}
                                alt=""
                                className={`w-3.5 h-3.5 transition-transform ${modeOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {modeOpen && (
                            <ul className="absolute top-full left-0 right-0 mt-1.5 bg-neutral-800 border border-neutral-800 rounded-xl py-1.5 z-20 shadow-lg">
                                {modes.map((m) => (
                                    <li key={m}>
                                        <button
                                            onClick={() => { onModeChange(m); setModeOpen(false) }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-neutral-900/40 transition-colors"
                                        >
                                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${m === mode ? 'border-blue-400' : 'border-neutral-500'}`}>
                                                {m === mode && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                                            </span>
                                            <span className={m === mode ? 'text-neutral-0 font-semibold' : 'text-neutral-400'}>
                                                {m === 'timed' ? 'Timed (60s)' : 'Passage'}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Separator line */}
            <div className="border-t border-neutral-800 mt-6"></div>
        </section>
    )
}