
// voiceService.ts - Voice Activity Detection (VAD) & Text-to-Speech (TTS)

export async function transcribeAudio(audioBlob: Blob, apiKey?: string): Promise<string> {
    const key = apiKey || localStorage.getItem('kb_openai_key') || process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OpenAI API anahtarı eksik. Ayarlardan ekleyin.");

    const formData = new FormData();
    const file = new File([audioBlob], "recording.wav", { type: "audio/wav" });
    formData.append("file", file);
    formData.append("model", "whisper-1");
    // formData.append("language", "tr"); // Auto-detect is often better

    try {
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}` },
            body: formData
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.text;
    } catch (error) {
        console.error("Whisper Error:", error);
        throw error;
    }
}

// --- Text To Speech (TTS) ---
export function speakText(text: string, onEnd?: () => void) {
    if (!window.speechSynthesis) return;

    // Stop previous
    window.speechSynthesis.cancel();

    // Clean text (remove markdown mostly)
    const cleanText = text.replace(/\*/g, '').replace(/#/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a Turkish voice
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find(v => v.lang.includes('tr'));
    if (trVoice) utterance.voice = trVoice;

    if (onEnd) utterance.onend = onEnd;

    window.speechSynthesis.speak(utterance);
}

// --- Voice Activity Detection (Class) ---
export class AudioMonitor {
    audioContext: AudioContext | null = null;
    analyser: AnalyserNode | null = null;
    microphone: MediaStreamAudioSourceNode | null = null;
    scriptProcessor: ScriptProcessorNode | null = null;

    isListening = false;
    silenceStart = 0;
    speechStart = 0;
    hasSpoken = false;

    // Config
    threshold = 0.02; // Volume threshold
    silenceDelay = 1500; // ms of silence to consider "done"

    // Callbacks
    onSpeechStart?: () => void;
    onSpeechEnd?: (blob: Blob) => void;
    onVolumeChange?: (vol: number) => void;

    mediaRecorder: MediaRecorder | null = null;
    audioChunks: Blob[] = [];

    async start() {
        if (this.isListening) return;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.microphone = this.audioContext.createMediaStreamSource(stream);
        this.scriptProcessor = this.audioContext.createScriptProcessor(2048, 1, 1);

        this.analyser.fftSize = 256;
        this.microphone.connect(this.analyser);
        this.analyser.connect(this.scriptProcessor);
        this.scriptProcessor.connect(this.audioContext.destination);

        // Setup Recorder
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) this.audioChunks.push(e.data); };

        this.scriptProcessor.onaudioprocess = (event) => {
            const input = event.inputBuffer.getChannelData(0);
            let sum = 0;
            for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
            const volume = Math.sqrt(sum / input.length);

            if (this.onVolumeChange) this.onVolumeChange(volume);

            if (volume > this.threshold) {
                // Speech Detected
                this.silenceStart = 0;
                if (!this.hasSpoken) {
                    this.hasSpoken = true;
                    if (this.onSpeechStart) this.onSpeechStart();
                    // Start recording only when speech starts
                    if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
                        this.mediaRecorder.start();
                        this.audioChunks = [];
                    }
                }
            } else {
                // Silence
                if (this.hasSpoken) {
                    if (this.silenceStart === 0) this.silenceStart = Date.now();
                    else if (Date.now() - this.silenceStart > this.silenceDelay) {
                        // Silence Timeout Reached
                        this.stopAndProcess();
                    }
                }
            }
        };

        this.isListening = true;
    }

    stopAndProcess() {
        if (!this.isListening || !this.hasSpoken) return;

        // Reset Logic
        this.hasSpoken = false;
        this.silenceStart = 0;

        // Stop Recorder
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.audioChunks = [];
                if (this.onSpeechEnd) this.onSpeechEnd(blob);
            };
        }
    }

    stop() {
        this.isListening = false;
        if (this.scriptProcessor) this.scriptProcessor.disconnect();
        if (this.analyser) this.analyser.disconnect();
        if (this.microphone) this.microphone.disconnect();
        if (this.audioContext) this.audioContext.close();

        // Stop all tracks
        if (this.mediaRecorder && this.mediaRecorder.stream) {
            this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
        }
    }
}
