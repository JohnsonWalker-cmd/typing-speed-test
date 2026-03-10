import CompletedIcon from '../assets/images/icon-completed.svg'
import NewPBIcon from '../assets/images/icon-new-pb.svg'
import RestartIcon from '../assets/images/icon-restart.svg'
import Star1 from '../assets/images/pattern-star-1.svg'
import Star2 from '../assets/images/pattern-star-2.svg'
import ConfettiPattern from '../assets/images/pattern-confetti.svg'

interface ResultsScreenProps {
    wpm: number
    accuracy: number
    correctChars: number
    incorrectChars: number
    isFirstTest: boolean
    isNewPersonalBest: boolean
    onRestart: () => void
}

export default function ResultsScreen({
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    isFirstTest,
    isNewPersonalBest,
    onRestart,
}: ResultsScreenProps) {
    const accuracyColor = accuracy >= 97 ? 'text-green-500' : 'text-red-500'

    // Determine heading, subtitle, icon, and button text based on state
    let heading: string
    let subtitle: string
    let icon: string
    let buttonText: string
    let showIconCircle: boolean

    if (isFirstTest) {
        heading = 'Baseline Established!'
        subtitle = "You've set the bar. Now the real challenge begins—time to beat it."
        icon = CompletedIcon
        buttonText = 'Beat This Score'
        showIconCircle = true
    } else if (isNewPersonalBest) {
        heading = 'High Score Smashed!'
        subtitle = "You're getting faster. That was incredible typing."
        icon = NewPBIcon
        buttonText = 'Go Again'
        showIconCircle = false
    } else {
        heading = 'Test Complete!'
        subtitle = 'Great effort! Review your stats and try again to improve.'
        icon = CompletedIcon
        buttonText = 'Beat This Score'
        showIconCircle = true
    }

    return (
        <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-10 max-w-md mx-auto relative overflow-hidden">
            {/* Decorative stars for first test */}
            {isFirstTest && (
                <>
                    <img
                        src={Star1}
                        alt=""
                        className="absolute top-4 left-2 sm:top-6 sm:left-4 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none"
                    />
                    <img
                        src={Star2}
                        alt=""
                        className="absolute bottom-8 right-2 sm:bottom-12 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none"
                    />
                </>
            )}

            {/* Icon */}
            <div className="flex justify-center mb-4">
                {showIconCircle ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/15 flex items-center justify-center">
                        <img src={icon} alt="" className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                ) : (
                    <img src={icon} alt="" className="w-14 h-14 sm:w-16 sm:h-16" />
                )}
            </div>

            {/* Heading */}
            <h2 className="text-neutral-0 text-xl sm:text-2xl font-bold text-center mb-2">
                {heading}
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base text-center mb-8 sm:mb-10 max-w-xs mx-auto leading-relaxed">
                {subtitle}
            </p>

            {/* Stat cards */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-10">
                {/* WPM */}
                <div className="border border-neutral-800 rounded-xl px-5 py-4 sm:px-6 sm:py-5">
                    <span className="text-neutral-400 text-xs sm:text-sm block mb-1">WPM:</span>
                    <span className="text-neutral-0 font-bold text-2xl sm:text-3xl">{wpm}</span>
                </div>

                {/* Accuracy */}
                <div className="border border-neutral-800 rounded-xl px-5 py-4 sm:px-6 sm:py-5">
                    <span className="text-neutral-400 text-xs sm:text-sm block mb-1">Accuracy:</span>
                    <span className={`font-bold text-2xl sm:text-3xl ${accuracyColor}`}>{accuracy}%</span>
                </div>

                {/* Characters */}
                <div className="border border-neutral-800 rounded-xl px-5 py-4 sm:px-6 sm:py-5">
                    <span className="text-neutral-400 text-xs sm:text-sm block mb-1">Characters</span>
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-green-500 font-bold text-2xl sm:text-3xl">{correctChars}</span>
                        <span className="text-neutral-400 font-bold text-2xl sm:text-3xl">/</span>
                        <span className="text-red-500 font-bold text-2xl sm:text-3xl">{incorrectChars}</span>
                    </div>
                </div>
            </div>

            {/* Restart button */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={onRestart}
                    className="flex items-center gap-2.5 bg-neutral-800 text-neutral-0 px-6 py-3 rounded-xl cursor-pointer transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                >
                    <span className="font-semibold text-sm">{buttonText}</span>
                    <img src={RestartIcon} alt="restart" className="w-4 h-4" />
                </button>
            </div>

            {/* Confetti at bottom for new personal best */}
            {isNewPersonalBest && (
                <div className="mt-4 -mx-4 sm:-mx-6 md:-mx-10">
                    <img
                        src={ConfettiPattern}
                        alt=""
                        className="w-full pointer-events-none"
                    />
                </div>
            )}
        </div>
    )
}
