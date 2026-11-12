import {cannedSodas, drinkGroups, withDrinkDrafts} from './DrinkCatalog';
import {lunchInstructions, splitLunchInstructions} from './MenuPresentation';
test('all seven drink groups and flavor lists are preserved',()=>{
    expect(drinkGroups).toHaveLength(7);
    expect(drinkGroups.map(group=>group.flavors.length)).toEqual([10,9,8,3,3,1,1]);
    expect(cannedSodas).toContain('Diet Coca Cola');
});
test('draft drinks cannot be ordered and do not duplicate database entries',()=>{
    expect(withDrinkDrafts([])).toHaveLength(35);
    expect(withDrinkDrafts([]).every(item=>item.draft && !item.available && Number(item.price) > 0)).toBe(true);
    const saved={number:'DR1',id:'real',price:'2.00'};
    expect(withDrinkDrafts([saved]).filter(item=>item.number==='DR1')).toEqual([saved]);
});
test('specific lunch soda survives saving and editing',()=>{
    expect(splitLunchInstructions(lunchInstructions('Can of soda','No onions','Sprite'))).toEqual({side:'Can of soda',soda:'Sprite',notes:'No onions'});
    expect(lunchInstructions('Egg roll','No onions','Sprite')).toBe('Lunch side: Egg roll\nNo onions');
});

