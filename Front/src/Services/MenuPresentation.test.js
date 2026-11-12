import {sortMenuOptions, splitLunchInstructions, lunchInstructions} from './MenuPresentation';
test('sizes sort small before large independently of database order', () => {
    expect(sortMenuOptions([{size:'(Lg 10)'},{size:'(Sm 6)'}]).map(i=>i.size)).toEqual(['(Sm 6)','(Lg 10)']);
    expect(sortMenuOptions([{size:'(Qt)'},{size:'(Pt)'}]).map(i=>i.size)).toEqual(['(Pt)','(Qt)']);
});
test('lunch side survives editing without losing customer notes', () => {
    expect(splitLunchInstructions(lunchInstructions('Can of soda','No onions\nExtra sauce'))).toEqual({side:'Can of soda',soda:'',notes:'No onions\nExtra sauce'});
    expect(splitLunchInstructions('No onions')).toEqual({side:'Egg roll',soda:'',notes:'No onions'});
});


test('legacy Shrimp entries display under Seafood with their included rice', () => {
    const {menuCategory, includedWith} = require('./MenuPresentation');
    expect(menuCategory('Shrimp')).toBe('Seafood');
    expect(menuCategory('Seafood')).toBe('Seafood');
    expect(menuCategory(' shrimp ')).toBe('Seafood');
    expect(menuCategory('Lunch Special')).toBe('Lunch Special');
    expect(includedWith({category:'Shrimp'})).toBe('Served with white rice.');
});
