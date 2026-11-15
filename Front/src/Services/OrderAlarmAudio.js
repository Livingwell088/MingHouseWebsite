// A locally generated two-tone bell. No downloaded audio or third-party service.
export function createOrderAlarmAudio() {
    let context;
    const voices = new Set();
    return {
        async enable() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) throw new Error('This browser does not support alert audio.');
            if (!context || context.state === 'closed') context = new AudioContext();
            if (context.state !== 'running') await context.resume();
            if (context.state !== 'running') throw new Error('Sound is blocked. Tap Enable sound again.');
        },
        get state() {return context?.state || 'closed';},
        play(volume = 80) {
            if (!context || context.state !== 'running') throw new Error('Sound was suspended. Tap Enable sound again.');
            const start = context.currentTime + .03;
            const level = .32 * Math.pow(Math.max(0, Math.min(100, volume)) / 100, 2);
            [880, 1175, 880, 1175, 880, 1175].forEach((frequency, i) => {
                const oscillator = context.createOscillator(), gain = context.createGain();
                const time = start + i * .24;
                oscillator.type = 'triangle'; oscillator.frequency.value = frequency;
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(level, time + .015);
                gain.gain.exponentialRampToValueAtTime(.001, time + .2);
                oscillator.connect(gain); gain.connect(context.destination);
                voices.add(oscillator);
                oscillator.onended = () => {voices.delete(oscillator); oscillator.disconnect(); gain.disconnect();};
                oscillator.start(time); oscillator.stop(time + .22);
            });
        },
        stop() {
            voices.forEach(voice => {try {voice.stop();} catch (e) { /* Already stopped. */ }});
            voices.clear();
        },
        dispose() {this.stop(); if (context && context.state !== 'closed') context.close().catch(() => {});},
    };
}
