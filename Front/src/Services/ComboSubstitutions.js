export const comboCategories = ['Lunch Special', 'All Day Special', 'Special Combination Plates'];
export const comboSubstitutions = [
    {name:'Pork Fried Rice', price:0},
    {name:'Plain Fried Rice', price:0},
    {name:'Vegetable Fried Rice', price:0},
    {name:'Chicken Fried Rice', price:1},
    {name:'Beef Fried Rice', price:1.75},
    {name:'Shrimp Fried Rice', price:1.75},
    {name:'House Special Fried Rice', price:1.75},
    {name:'Plain Lo Mein', price:2},
    {name:'Vegetable Lo Mein', price:2},
    {name:'Pork Lo Mein', price:2.75},
    {name:'Chicken Lo Mein', price:2.75},
    {name:'Beef Lo Mein', price:2.75},
    {name:'Shrimp Lo Mein', price:2.75}
];
export function splitComboInstructions(value = '') {
    const match = /^Rice\/noodle choice: ([^\n]+)(?:\n|$)/.exec(value);
    return {choice:match?.[1] || 'Pork Fried Rice', notes:match ? value.slice(match[0].length) : value};
}
export function comboInstructions(choice, notes) {
    return choice === 'Pork Fried Rice' ? notes : `Rice/noodle choice: ${choice}\n${notes}`.trim();
}
