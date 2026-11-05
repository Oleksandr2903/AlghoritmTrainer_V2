import { useState } from 'react'
import './App.css'

import { SortingArena } from './features/sorting'
// import { ComplexitySimulator } from './features/complexity'
// import { RecursionTree } from './features/recursion'
import { QuizTrainer } from './features/quiz'

export default function App() {
    const [activeTab, setActiveTab] = useState('sorting')

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
            {/* Навігаційна панель */}
            <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h1 className="text-2xl font-bold text-sky-500">AlgoLab</h1>
                <nav className="flex gap-6">
                    <button onClick={() => setActiveTab('sorting')} className={`hover:text-sky-400 transition-colors ${activeTab === 'sorting' ? 'text-sky-500 font-semibold' : 'text-slate-400'}`}>Сортування</button>
                    <button onClick={() => setActiveTab('complexity')} className={`hover:text-emerald-400 transition-colors ${activeTab === 'complexity' ? 'text-emerald-500 font-semibold' : 'text-slate-400'}`}>Складність T(n)</button>
                    <button onClick={() => setActiveTab('recursion')} className={`hover:text-rose-400 transition-colors ${activeTab === 'recursion' ? 'text-rose-500 font-semibold' : 'text-slate-400'}`}>Рекурсія</button>
                    <button onClick={() => setActiveTab('quiz')} className={`hover:text-amber-400 transition-colors ${activeTab === 'quiz' ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}>Тренажер</button>
                </nav>
            </header>

            {/* Робоча область, куди будуть підставлятися модулі колег */}
            <main className="p-6">
                {activeTab === 'sorting' && <SortingArena/>}
                {activeTab === 'complexity' && <div className="text-slate-400">Модуль складності в розробці... {/* <ComplexitySimulator /> */}</div>}
                {activeTab === 'recursion' && <div className="text-slate-400">Модуль рекурсії в розробці... {/* <RecursionTree /> */}</div>}
                {activeTab === 'quiz' && <QuizTrainer />}
            </main>
        </div>
    )
}