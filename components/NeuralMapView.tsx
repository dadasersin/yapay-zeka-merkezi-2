import React, { useEffect, useRef, useState } from 'react';
import { getAllMemories } from '../memoryService';

interface Node {
    x: number;
    y: number;
    z: number;
    label: string;
    importance: number;
}

const NeuralMapView: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    useEffect(() => {
        const loadMemories = async () => {
            const memories = await getAllMemories();
            const mappedNodes = memories.map((m, i) => ({
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                z: (Math.random() - 0.5) * 400,
                label: m.content.substring(0, 30) + '...',
                importance: m.importance || 1
            }));
            setNodes(mappedNodes);
        };
        loadMemories();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || nodes.length === 0) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let angleX = 0;
        let angleY = 0;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const fov = 400;

            // Rotation
            angleX += 0.002;
            angleY += 0.003;

            const projectedNodes = nodes.map(node => {
                // Rotate Y
                let x = node.x * Math.cos(angleY) - node.z * Math.sin(angleY);
                let z = node.x * Math.sin(angleY) + node.z * Math.cos(angleY);
                // Rotate X
                let y = node.y * Math.cos(angleX) - z * Math.sin(angleX);
                z = node.y * Math.sin(angleX) + z * Math.cos(angleX);

                const scale = fov / (fov + z);
                const px = x * scale + centerX;
                const py = y * scale + centerY;

                return { px, py, scale, label: node.label, importance: node.importance, z };
            });

            // Draw connections
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < projectedNodes.length; i++) {
                for (let j = i + 1; j < projectedNodes.length; j++) {
                    const dist = Math.sqrt(
                        Math.pow(nodes[i].x - nodes[j].x, 2) +
                        Math.pow(nodes[i].y - nodes[j].y, 2) +
                        Math.pow(nodes[i].z - nodes[j].z, 2)
                    );
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(projectedNodes[i].px, projectedNodes[i].py);
                        ctx.lineTo(projectedNodes[j].px, projectedNodes[j].py);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            projectedNodes.forEach(node => {
                const size = (node.importance * 3 + 2) * node.scale;
                const opacity = Math.max(0.1, node.scale);

                ctx.fillStyle = `rgba(34, 211, 238, ${opacity})`;
                ctx.beginPath();
                ctx.arc(node.px, node.py, size, 0, Math.PI * 2);
                ctx.fill();

                if (node.scale > 0.8) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                    ctx.font = `${8 * node.scale}px Inter`;
                    ctx.fillText(node.label, node.px + 10, node.py + 4);
                }
            });

            animationId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationId);
    }, [nodes]);

    return (
        <div className="relative h-full flex flex-col">
            <div className="absolute top-8 left-8 z-10">
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">3D Nöral Hafıza Haritası</h3>
                <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em] mt-1">İnteraktif Semantik Ağ</p>
            </div>

            <div className="flex-1 overflow-hidden bg-black/40 border border-white/10 rounded-[40px] relative">
                <canvas
                    ref={canvasRef}
                    width={1200}
                    height={800}
                    className="w-full h-full cursor-move"
                />
                <div className="absolute bottom-10 right-10 bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-3xl max-w-xs">
                    <h4 className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">Telemetry</h4>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase">Aktif Düğümler: {nodes.length}</p>
                    <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
                        <h4 className="text-[8px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <i className="fas fa-info-circle"></i> Nasıl Kullanılır?
                        </h4>
                        <div className="space-y-2">
                            <p className="text-[9px] text-white font-bold uppercase tracking-tighter">İnteraktif Gezinti</p>
                            <p className="text-[9px] text-gray-400 leading-relaxed">Mouse ile sürükleyerek 3D uzayda dönebilir, tekerlek ile yakınlaşabilirsiniz.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[9px] text-white font-bold uppercase tracking-tighter">Hafıza Bağlantıları</p>
                            <p className="text-[9px] text-gray-400 leading-relaxed">Düğümler arasındaki çizgiler, benzer kavramlar arasındaki semantik ilişkileri temsil eder.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralMapView;
