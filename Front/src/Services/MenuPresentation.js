export function menuCategory(category) {
    const name = String(category || '').trim();
    return /^(shrimp|seafood)$/i.test(name) ? 'Seafood' : name;
}
export function sortMenuOptions(items) {
    const rank = item => /\b(sm|small|pt|pint)\b/i.test(item.size || '') ? 0 : /\b(lg|large|qt|quart)\b/i.test(item.size || '') ? 2 : 1;
    return [...items].sort((a, b) => rank(a) - rank(b) || String(a.size || '').localeCompare(String(b.size || ''), undefined, {numeric: true}));
}
export function includedWith(item) {
    if (item?.description) return item.description;
    const sides = {
        'Lunch Special': 'Served with pork fried rice and your choice of an egg roll or a can of soda.',
        'Special Combination Plates': 'Served with pork fried rice and a pork egg roll.',
        'All Day Special': 'Served with pork fried rice.',
        'Soup': 'Served with fried noodles.', 'Chow Mein': 'Served with white rice and fried noodles.',
        'Pork': 'Served with white rice.', 'Poultry': 'Served with white rice.',
        'Beef': 'Served with white rice.', 'Seafood': 'Served with white rice.',
        'Egg Foo Young': 'Served with white rice and gravy.',
        'Sweet And Sour': 'Served with white rice.', 'Vegetable': 'Served with white rice.',
        'Chefs Specialties': 'Served with white rice.',
        'Moo Shu': 'Served with white rice, pancakes, and hoisin sauce.',
        'Special Healthy Diet': 'Steamed, with sauce on the side.'
    };
    if (item?.category === 'American Dishes' && item.size) return item.size.replace(/[\[\]]/g, '').replace(/^w\.\s*/i, 'Served with ')+'.';
    return sides[menuCategory(item?.category)] || '';
}
export function lunchInstructions(side, notes, soda = '') {
    return `Lunch side: ${side}${side === 'Can of soda' && soda ? ` — ${soda}` : ''}\n${notes}`.trim();
}
export function splitLunchInstructions(value = '') {
    const match = /^Lunch side: (Egg roll|Can of soda)(?: — ([^\n]+))?(?:\n|$)/.exec(value);
    return {side: match?.[1] || 'Egg roll', soda: match?.[2] || '', notes: match ? value.slice(match[0].length) : value};
}

