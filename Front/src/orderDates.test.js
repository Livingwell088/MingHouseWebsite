import {orderDateKey, restaurantDateKey} from './orderDates';

test('new and legacy order dates match the same restaurant day', () => {
    expect(orderDateKey('2026-11-12')).toBe('2026-11-12');
    expect(orderDateKey('November 12 2026')).toBe('2026-11-12');
    expect(orderDateKey('May 7 2026')).toBe('2026-05-07');
    expect(orderDateKey(null)).toBe('');
    expect(orderDateKey('invalid')).toBe('');
});

test('today stays on the restaurant day across UTC midnight and daylight saving', () => {
    expect(restaurantDateKey(new Date('2026-11-13T01:00:00Z'))).toBe('2026-11-12');
    expect(restaurantDateKey(new Date('2026-07-13T03:00:00Z'))).toBe('2026-07-12');
    expect(restaurantDateKey(new Date('2026-11-13T05:00:00Z'))).toBe('2026-11-13');
});
