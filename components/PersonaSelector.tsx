
import React from 'react';
import { Persona, PERSONAS } from '../types';

interface Props {
    currentPersonaId: string;
    onSelect: (personaId: string) => void;
}

const PersonaSelector: React.FC<Props> = ({ currentPersonaId, onSelect }) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar my-2 px-2">
            {PERSONAS.map(p => (
                <button
                    key={p.id}
                    onClick={() => onSelect(p.id)}
                    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border transition-all w-24 h-24 justify-center ${currentPersonaId === p.id
                            ? `${p.color} border-white text-white shadow-lg scale-105`
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                        }`}
                >
                    <i className={`${p.icon} text-2xl mb-2`}></i>
                    <span className="text-[10px] uppercase font-bold text-center leading-tight">{p.name}</span>
                </button>
            ))}
        </div>
    );
};

export default PersonaSelector;
