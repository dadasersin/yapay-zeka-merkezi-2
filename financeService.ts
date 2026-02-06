
// financeService.ts - Finance Data & Technical Analysis

export interface FinanceData {
    symbol: string;
    price: number;
    change: number;
    history: { label: string, value: number }[];
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    reason: string;
}

// Mock Data Generator (In real app, fetch from generic API like Yahoo Finance via Proxy)
// Since we don't have a backend proxy, we simulate realistic data
export const getFinanceData = async (symbol: string, type: 'gold' | 'stock' | 'crypto'): Promise<FinanceData> => {
    // Simulate delay
    await new Promise(r => setTimeout(r, 800));

    const now = new Date();
    let basePrice = 100;

    if (type === 'gold') basePrice = 2450; // Gram Golden
    if (type === 'crypto') basePrice = 65000;
    if (type === 'stock') basePrice = 250;

    // Generate random history (last 7 days/points)
    const history = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        // Random walk
        const volatility = basePrice * 0.05;
        const val = basePrice + (Math.random() - 0.5) * volatility;
        return {
            label: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
            value: Math.floor(val * 100) / 100
        };
    });

    const currentPrice = history[history.length - 1].value;
    const prevPrice = history[history.length - 2].value;
    const change = ((currentPrice - prevPrice) / prevPrice) * 100;

    // Technical Analysis (Simple SMA Strategy)
    const avg = history.reduce((a, b) => a + b.value, 0) / history.length;
    let recommendation: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let reason = "Piyasa yatay seyrediyor.";

    if (currentPrice > avg * 1.02) {
        recommendation = 'BUY';
        reason = `Fiyat (${currentPrice}) ortalamanın (${avg.toFixed(2)}) üzerinde, yükseliş trendi.`;
    } else if (currentPrice < avg * 0.98) {
        recommendation = 'SELL';
        reason = `Fiyat (${currentPrice}) ortalamanın altında, düşüş riski var.`;
    }

    // Special Case: Gold
    if (symbol.toLowerCase().includes('altın') || symbol.toLowerCase().includes('gold')) {
        return {
            symbol: 'GRAM ALTIN',
            price: currentPrice,
            change,
            history: history.map(h => ({ ...h, value: h.value + (Math.random() * 10) })), // Noise
            recommendation,
            reason
        };
    }

    return {
        symbol: symbol.toUpperCase(),
        price: currentPrice,
        change,
        history,
        recommendation,
        reason
    };
};
