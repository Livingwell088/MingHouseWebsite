import {checkoutPolicy, lunchClosed} from './OrderPolicy';
const lunch = [{item:{category:'Lunch Special'}}];
test('Eastern lunch cutoff handles winter and daylight saving time', () => {
    expect(lunchClosed(new Date('2026-11-19T20:59:59Z'))).toBe(false);
    expect(lunchClosed(new Date('2026-11-19T21:00:00Z'))).toBe(true);
    expect(lunchClosed(new Date('2026-07-19T19:59:59Z'))).toBe(false);
    expect(lunchClosed(new Date('2026-07-19T20:00:00Z'))).toBe(true);
});
test('requested lunch time must also be before 4 PM', () => {
    const now = new Date('2026-11-19T17:00:00Z');
    expect(lunchClosed(now,'12:00 PM')).toBe(false);
    expect(lunchClosed(now,'3:59 PM')).toBe(false);
    expect(lunchClosed(now,'4:00 PM')).toBe(true);
    expect(checkoutPolicy(lunch,20,'Pickup','4:00 PM',now)).toMatch(/Lunch specials/);
    expect(checkoutPolicy([],20,'Pickup','4:00 PM',now)).toBe('');
});
test('delivery minimum is based on item subtotal and pickup has no minimum', () => {
    expect(checkoutPolicy([],14.99,'Delivery','ASAP')).toMatch(/\$15.00/);
    expect(checkoutPolicy([],15,'Delivery','ASAP')).toBe('');
    expect(checkoutPolicy([],4.25,'Pickup','ASAP')).toBe('');
});
