
// memoryService.ts - Native IndexedDB Implementation (Zero Dependencies)

export interface Memory {
    id?: number;
    content: string; // The text content of the memory
    tags: string[]; // Keywords for retrieval
    source: 'user' | 'system' | 'summary';
    timestamp: Date;
    importance: number; // 1-10
}

const DB_NAME = 'QuantumMemoryDB';
const DB_VERSION = 1;
const STORE_NAME = 'memories';

// Helper to open DB
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('tags', 'tags', { multiEntry: true });
                store.createIndex('timestamp', 'timestamp');
            }
        };

        request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
        request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
    });
};

// 1. Yeni bir hafıza kaydet
export const saveMemory = async (content: string, tags: string[] = [], source: 'user' | 'system' | 'summary' = 'user', importance: number = 5) => {
    const db = await openDB();

    // Generate simple tags from content if not provided
    if (tags.length === 0) {
        // Simple stop-word filtering
        const stopWords = ['bir', 've', 'ile', 'ama', 'için', 'ben', 'sen', 'bu', 'şu', 'o'];
        tags = content.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .split(/\s+/)
            .filter(w => w.length > 3 && !stopWords.includes(w));
    }

    const memory: Memory = {
        content,
        tags,
        source,
        timestamp: new Date(),
        importance
    };

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(memory);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// 2. Alakalı hafızaları getir (Basit keyword scan)
export const searchMemory = async (query: string, limit: number = 3): Promise<string[]> => {
    const db = await openDB();
    const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);

    if (keywords.length === 0) return [];

    return new Promise<string[]>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const results: { content: string, score: number, date: Date }[] = [];

        // In a real app with large DB, we would use a cursor or index. 
        // For local storage chats, scanning all memories is usually fine (until >10k items).
        const request = store.openCursor();

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
            if (cursor) {
                const mem = cursor.value as Memory;
                let score = 0;

                // Simple scoring: +1 for each matching keyword in tags or content
                const text = (mem.content + " " + mem.tags.join(" ")).toLowerCase();
                keywords.forEach(k => {
                    if (text.includes(k)) score += 1;
                });

                if (score > 0) {
                    results.push({ content: mem.content, score, date: mem.timestamp });
                }
                cursor.continue();
            } else {
                // Done scanning
                // Sort by score (desc) then date (desc)
                results.sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                });

                resolve(results.slice(0, limit).map(r => r.content));
            }
        };
        request.onerror = () => reject(request.error);
    });
};

// Helper function to extract stats
export const getAllMemories = async (): Promise<Memory[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const clearMemory = async () => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    transaction.objectStore(STORE_NAME).clear();
};

export const autoExtractFacts = async (text: string) => {
    const lower = text.toLowerCase();

    // Simple heuristic for fact extraction
    const keyPhrases = [
        "benim adım", "şunu severim", "hakkımda",
        "projem", "çalışıyorum", "istiyorum",
        "adresim", "telefonum", "emailim"
    ];

    if (keyPhrases.some(phrase => lower.includes(phrase))) {
        await saveMemory(text, [], 'user', 8);
    }
};
