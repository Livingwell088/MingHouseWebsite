import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import MenuPopup from './MenuPopup';
import API from '../api';
jest.mock('../api', () => ({cartAPI:{create:jest.fn(),edit:jest.fn()},priceAPI:{price:v=>Number(v).toFixed(2)}}));
jest.mock('../Services/MenuPhotos', () => ({useMenuPhoto:()=>({photo:null,onPhotoError:jest.fn()})}));
const lunch={id:'l1',number:'L1',name:'Chicken Chow Mein',category:'Lunch Special',size:'',price:'9.55'};
beforeEach(()=>{jest.clearAllMocks();sessionStorage.clear();sessionStorage.setItem('sessionId','test-guest');API.cartAPI.create.mockResolvedValue({});API.cartAPI.edit.mockResolvedValue({});});
test('single-size lunch has only side radios and sends chosen side with notes', async()=>{
    render(<MenuPopup show item={[lunch]} name={lunch.name} do="Add" quantity={1} onClose={jest.fn()} />);
    expect(screen.getByRole('heading',{name:'L1. Chicken Chow Mein'})).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    fireEvent.click(screen.getByLabelText(/Can of soda/));
    fireEvent.change(screen.getByLabelText('Choose your canned soda'),{target:{value:'Sprite'}});
    fireEvent.change(screen.getByLabelText('Special instructions'),{target:{value:'No onions'}});
    fireEvent.click(screen.getByRole('button',{name:'Add $9.55'}));
    await waitFor(()=>expect(API.cartAPI.create).toHaveBeenCalledWith(lunch.name,9.55,1,lunch,'test-guest','Lunch side: Can of soda — Sprite\nNo onions'));
});
test('editing lunch restores side and replaces it without duplicating notes', async()=>{
    render(<MenuPopup show item={[lunch]} id={42} name={lunch.name} do="Edit" quantity={2} cartItem={{item:lunch,specialInstruction:'Lunch side: Can of soda\nNo onions'}} onClose={jest.fn()} />);
    expect(screen.getByLabelText(/Can of soda/)).toBeChecked();
    fireEvent.click(screen.getByLabelText(/Egg roll/));
    fireEvent.click(screen.getByRole('button',{name:'Update $19.10'}));
    await waitFor(()=>expect(API.cartAPI.edit).toHaveBeenCalledWith(42,lunch.name,19.1,2,lunch,'Lunch side: Egg roll\nNo onions','test-guest'));
});

