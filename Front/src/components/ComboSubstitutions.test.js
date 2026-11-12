import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import MenuPopup from './MenuPopup';
import API from '../api';
jest.mock('../api',()=>({cartAPI:{create:jest.fn(),edit:jest.fn()},priceAPI:{price:v=>Number(v).toFixed(2)}}));
jest.mock('../Services/MenuPhotos',()=>({useMenuPhoto:()=>({photo:null,onPhotoError:jest.fn()})}));
const combo={id:'combo',number:'C1',name:'Chicken Chow Mein',size:'',category:'Special Combination Plates',price:'10.00'};
beforeEach(()=>{sessionStorage.setItem('sessionId','test');API.cartAPI.create.mockResolvedValue({});});
test('substitution surcharge multiplies with quantity and is included in saved notes',async()=>{
    render(<MenuPopup show item={[combo]} name={combo.name} quantity={1} do="Add" onClose={jest.fn()}/>);
    expect(screen.queryByLabelText('Rice or noodle choice')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Change rice or noodles (optional)'));
    fireEvent.change(screen.getByLabelText('Rice or noodle choice'),{target:{value:'Shrimp Lo Mein'}});
    fireEvent.click(screen.getByRole('button',{name:'Increase quantity'}));
    fireEvent.change(screen.getByLabelText('Special instructions'),{target:{value:'No onions'}});
    fireEvent.click(screen.getByRole('button',{name:'Add $25.50'}));
    await waitFor(()=>expect(API.cartAPI.create).toHaveBeenCalledWith(combo.name,25.5,2,combo,'test','Rice/noodle choice: Shrimp Lo Mein\nNo onions'));
});
test('existing substitution restores when editing',()=>{
    render(<MenuPopup show item={[combo]} name={combo.name} quantity={2} do="Edit" cartItem={{item:combo,specialInstruction:'Rice/noodle choice: Chicken Fried Rice\nNo onions'}} onClose={jest.fn()}/>);
    expect(screen.getByLabelText('Rice or noodle choice')).toHaveValue('Chicken Fried Rice');
    expect(screen.getByLabelText('Special instructions')).toHaveValue('No onions');
    expect(screen.getByRole('button',{name:'Update $22.00'})).toBeInTheDocument();
});

test('turning substitutions off restores included pork fried rice and base price',()=>{
    render(<MenuPopup show item={[combo]} name={combo.name} quantity={1} do="Add" onClose={jest.fn()}/>);
    fireEvent.click(screen.getByLabelText('Change rice or noodles (optional)'));
    fireEvent.change(screen.getByLabelText('Rice or noodle choice'),{target:{value:'Beef Fried Rice'}});
    expect(screen.getByRole('option',{name:'Plain Fried Rice (no extra charge)'})).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Add $11.75'})).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Change rice or noodles (optional)'));
    expect(screen.queryByLabelText('Rice or noodle choice')).not.toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Add $10.00'})).toBeInTheDocument();
});
