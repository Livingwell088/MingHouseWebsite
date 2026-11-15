import {createOrderAlarmAudio} from './OrderAlarmAudio';
test('audio is activated only on request, generates six bell tones, and can stop them', async () => {
    const voices=[];
    const gain={gain:{setValueAtTime:jest.fn(),linearRampToValueAtTime:jest.fn(),exponentialRampToValueAtTime:jest.fn()},connect:jest.fn(),disconnect:jest.fn()};
    const context={state:'suspended',currentTime:0,destination:{},resume:jest.fn(async()=>{context.state='running';}),close:jest.fn(async()=>{}),createGain:()=>gain,createOscillator:()=>{const voice={frequency:{},connect:jest.fn(),disconnect:jest.fn(),start:jest.fn(),stop:jest.fn()};voices.push(voice);return voice;}};
    window.AudioContext=jest.fn(()=>context);
    const alarm=createOrderAlarmAudio(); expect(window.AudioContext).not.toHaveBeenCalled();
    await alarm.enable(); alarm.play(100);
    expect(context.resume).toHaveBeenCalled(); expect(voices).toHaveLength(6); expect(voices.every(v=>v.start.mock.calls.length===1)).toBe(true);
    alarm.stop(); expect(voices.every(v=>v.stop.mock.calls.length===2)).toBe(true);
    context.state='suspended'; expect(()=>alarm.play()).toThrow('Sound was suspended'); alarm.dispose(); delete window.AudioContext;
});
