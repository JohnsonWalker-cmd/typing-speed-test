import LogoLarge from "../assets/images/logo-large.svg"
import LogoSmall from "../assets/images/logo-small.svg"
import Trophy from  "../assets/images/icon-personal-best.svg"

interface HeaderProps {
    personalBest: number | null
}

export default function Header({ personalBest }: HeaderProps){
    return (
        <header className="flex justify-between items-center px-4 sm:px-6 md:px-10 pt-6 pb-4 max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
                {/* Large logo on desktop, small logo on mobile */}
                <img
                    src={LogoLarge}
                    alt="logo"
                    className="hidden sm:block object-contain"
                />
                <img
                    src={LogoSmall}
                    alt="logo"
                    className="block sm:hidden w-8 h-8 object-contain"
                />
            </div>
            {personalBest !== null && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <img
                        src={Trophy}
                        alt="personal best"
                        className="w-5 h-5 object-contain"
                    />
                    <p className="text-neutral-400 text-xs sm:text-sm flex gap-1">
                        <span className="hidden sm:inline">Personal best:</span>
                        <span className="sm:hidden">Best:</span>
                        <span className="text-neutral-0 font-semibold">{personalBest} WPM</span>
                    </p>
                </div>
            )}
        </header>
    )
}