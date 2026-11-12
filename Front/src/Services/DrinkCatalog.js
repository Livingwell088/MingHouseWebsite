export const cannedSodas = ['Pepsi', 'Coca Cola', 'Sprite', 'Brisk Iced Tea', 'Mountain Dew', 'Dr. Pepper', 'Ginger Ale', 'Orange', 'Diet Pepsi', 'Diet Coca Cola'];
export const drinkGroups = [
    {number:'DR1', price:'1.35', name:'Can Soda', flavors:cannedSodas},
    {number:'DR2', price:'2.25', name:'20 oz Soda', flavors:['Pepsi','Diet Pepsi','Ginger Ale','Brisk Iced Tea','Root Beer','Orange','Grape','Mountain Dew','Lemonade']},
    {number:'DR3', price:'3.50', name:'2L Soda', flavors:['Pepsi','Diet Pepsi','Ginger Ale','Mountain Dew','Brisk Iced Tea','Orange','Grape','Root Beer']},
    {number:'DR4', price:'2.00', name:'Snapple', flavors:['Apple','Kiwi Strawberry','Fruit Punch']},
    {number:'DR5', price:'2.00', name:'Arizona', flavors:['Watermelon','Mango','Fruit Punch']},
    {number:'DR6', price:'2.50', name:'Homemade Iced Tea', flavors:['']},
    {number:'DR7', price:'2.50', name:'Homemade Fruit Punch', flavors:['']}
];
// Draft entries are display-only until priced records are added to the menu database.
export function withDrinkDrafts(menu) {
    return [...menu, ...drinkGroups.filter(group => !menu.some(item => item.number === group.number)).flatMap(group => group.flavors.map((flavor, index) => ({
        id:`draft-${group.number}-${index}`, number:group.number, name:group.name,
        size:flavor, category:'Drinks', price:group.price, available:false, draft:true
    })))];
}

