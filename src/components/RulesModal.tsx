import { motion, AnimatePresence } from 'framer-motion';
import type { GameMode } from '../hooks/useGame';
import clsx from 'clsx';
import { useState } from 'react';

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: GameMode | null;
}

type Language = 'pt-BR' | 'en';

const RULES: Record<GameMode, { 'pt-BR': string; en: string }> = {
    classic: {
        'pt-BR': "O modo Clássico segue as regras tradicionais do Jogo da Velha. O objetivo é alinhar três de seus símbolos (X ou O) na horizontal, vertical ou diagonal em um tabuleiro 3x3. O jogo termina quando um jogador consegue alinhar três símbolos ou quando o tabuleiro está cheio (empate).",
        en: "Classic mode follows the traditional Tic-Tac-Toe rules. The goal is to align three of your symbols (X or O) horizontally, vertically, or diagonally on a 3x3 grid. The game ends when a player achieves this or the board is full (draw)."
    },
    infinite: {
        'pt-BR': "No modo Infinito, cada jogador só pode ter 3 peças no tabuleiro ao mesmo tempo. Ao tentar colocar a 4ª peça, a sua peça mais antiga será removida automaticamente. Isso torna o jogo dinâmico e evita empates, exigindo estratégia constante de movimento e reposicionamento.",
        en: "In Infinite mode, each player can only have 3 pieces on the board at a time. When attempting to place a 4th piece, your oldest piece is automatically removed. This makes the game dynamic and prevents draws, requiring constant movement and repositioning strategy."
    },
    ultimate: {
        'pt-BR': "O Ultimate Tic-Tac-Toe é jogado em um tabuleiro 3x3 grande, onde cada célula contém um mini-tabuleiro 3x3. Vencer um mini-tabuleiro marca aquela célula grande para você. Onde você joga em um mini-tabuleiro determina em qual mini-tabuleiro o oponente deve jogar na próxima vez. Vence quem alinhar 3 células grandes conquistadas.",
        en: "Ultimate Tic-Tac-Toe is played on a large 3x3 grid, where each cell contains a mini 3x3 board. Winning a mini-board claims that large cell for you. Where you play on a mini-board determines which mini-board the opponent must play on next. The winner is whoever aligns 3 claimed large cells."
    },
    gobble: {
        'pt-BR': "No modo Gobble, as peças têm tamanhos diferentes (Pequeno, Médio, Grande). Você pode colocar uma peça em uma casa vazia OU 'comer' (cobrir) uma peça menor (sua ou do oponente) com uma maior. No modo 'Classic' do Gobble, você também pode mover peças já no tabuleiro. O objetivo é alinhar 3 peças da sua cor visíveis.",
        en: "In Gobble mode, pieces have different sizes (Small, Medium, Large). You can place a piece on an empty spot OR 'gobble' (cover) a smaller piece (yours or opponent's) with a larger one. In Gobble 'Classic' mode, you can also move pieces already on the board. The goal is to align 3 visible pieces of your color."
    }
};

const TITLES: Record<GameMode, { 'pt-BR': string; en: string }> = {
    classic: { 'pt-BR': 'Jogo da Velha Clássico', en: 'Classic Tic-Tac-Toe' },
    infinite: { 'pt-BR': 'Modo Infinito', en: 'Infinite Mode' },
    ultimate: { 'pt-BR': 'Ultimate Jogo da Velha', en: 'Ultimate Tic-Tac-Toe' },
    gobble: { 'pt-BR': 'Gobble (Comilão)', en: 'Gobble Mode' }
};

export function RulesModal({ isOpen, onClose, mode }: RulesModalProps) {
    const [lang, setLang] = useState<Language>('pt-BR');

    if (!mode) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="fixed inset-0 m-auto z-50 w-[90%] max-w-lg h-fit bg-surface border border-border rounded-2xl shadow-2xl p-6 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-purple-500">
                                {TITLES[mode][lang]}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-secondary hover:text-primary transition-colors p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Language Switcher */}
                        <div className="flex gap-2 mb-4 bg-page/50 p-1 rounded-lg w-fit">
                            <button
                                onClick={() => setLang('pt-BR')}
                                className={clsx(
                                    "px-3 py-1 rounded-md text-sm font-semibold transition-all",
                                    lang === 'pt-BR' ? "bg-brand text-white shadow-sm" : "text-secondary hover:text-primary"
                                )}
                            >
                                PT-BR
                            </button>
                            <button
                                onClick={() => setLang('en')}
                                className={clsx(
                                    "px-3 py-1 rounded-md text-sm font-semibold transition-all",
                                    lang === 'en' ? "bg-brand text-white shadow-sm" : "text-secondary hover:text-primary"
                                )}
                            >
                                EN
                            </button>
                        </div>

                        <div className="bg-page p-4 rounded-xl border border-border/50 text-primary leading-relaxed">
                            <p className="text-sm sm:text-base">
                                {RULES[mode][lang]}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-brand hover:bg-brand/90 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-brand/20"
                            >
                                {lang === 'pt-BR' ? 'Entendi' : 'Got it'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
