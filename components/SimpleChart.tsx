
import React from 'react';

interface ChartData {
    label: string;
    value: number;
}

interface SimpleChartProps {
    data: ChartData[];
    type?: 'line' | 'bar';
    title?: string;
    color?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data, type = 'line', title, color = '#22d3ee' }) => {
    if (!data || data.length === 0) return <div className="p-4 text-center text-gray-500">Veri yok</div>;

    // Dimensions
    const width = 600;
    const height = 300;
    const padding = 40;

    // Scales
    const maxVal = Math.max(...data.map(d => d.value));
    const minVal = Math.min(...data.map(d => d.value)) * 0.9; // little dynamic range
    const range = maxVal - minVal || 1;

    const getX = (index: number) => padding + (index * (width - 2 * padding) / (data.length - 1));
    const getY = (value: number) => height - padding - ((value - minVal) / range) * (height - 2 * padding);

    // Line Path
    let pathD = "";
    if (type === 'line') {
        pathD = `M ${getX(0)} ${getY(data[0].value)} ` +
            data.slice(1).map((d, i) => `L ${getX(i + 1)} ${getY(d.value)}`).join(" ");
    }

    return (
        <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 my-4 backdrop-blur-sm">
            {title && <h3 className="text-white font-bold mb-4 font-mono">{title}</h3>}

            <div className="relative w-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-white">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map(i => {
                        const y = height - padding - (i * (height - 2 * padding) / 4);
                        return (
                            <g key={i}>
                                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />
                                <text x={0} y={y + 4} fontSize="10" fill="gray">{(minVal + (i * range / 4)).toFixed(1)}</text>
                            </g>
                        );
                    })}

                    {/* Chart */}
                    {type === 'line' ? (
                        <>
                            <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            {/* Area under curve (optional opacity) */}
                            <path d={`${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`} fill={color} fillOpacity="0.1" stroke="none" />

                            {/* Dots */}
                            {data.map((d, i) => (
                                <circle key={i} cx={getX(i)} cy={getY(d.value)} r="3" fill="#fff" />
                            ))}
                        </>
                    ) : (
                        // Bar Chart
                        data.map((d, i) => {
                            const barH = height - padding - getY(d.value);
                            const barW = (width - 2 * padding) / data.length * 0.6;
                            const x = padding + (i * ((width - 2 * padding) / data.length)) + (barW * 0.2);
                            return (
                                <rect key={i} x={x} y={getY(d.value)} width={barW} height={barH} fill={color} rx="4" />
                            );
                        })
                    )}

                    {/* X Axis Labels */}
                    {data.map((d, i) => (
                        <text key={i} x={type === 'line' ? getX(i) : (padding + (i * ((width - 2 * padding) / data.length)) + 15)} y={height - 10} fontSize="10" textAnchor="middle" fill="gray">
                            {d.label}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default SimpleChart;
