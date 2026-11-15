import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import AdminOrderingControl from './AdminOrderingControl';
import API from '../api';
jest.mock('../api', () => ({__esModule:true, default:{adminAPI:{ordering:jest.fn(),setOrdering:jest.fn()}}}));
beforeEach(()=>{jest.clearAllMocks(); API.adminAPI.ordering.mockResolvedValue({data:{enabled:true}});});
test('admin can pause and resume ordering using confirmed server state', async () => {
    API.adminAPI.setOrdering.mockResolvedValueOnce({data:{enabled:false}}).mockResolvedValueOnce({data:{enabled:true}});
    render(<AdminOrderingControl/>);
    const control=await screen.findByRole('switch',{name:'Online ordering'});
    await waitFor(()=>expect(control).toHaveAttribute('aria-checked','true'));
    fireEvent.click(control); await waitFor(()=>expect(control).toHaveAttribute('aria-checked','false'));
    expect(API.adminAPI.setOrdering).toHaveBeenNthCalledWith(1,false);
    fireEvent.click(control); await waitFor(()=>expect(control).toHaveAttribute('aria-checked','true'));
    expect(API.adminAPI.setOrdering).toHaveBeenNthCalledWith(2,true);
});
test('failed saves do not claim the setting changed and require a status refresh', async () => {
    API.adminAPI.setOrdering.mockRejectedValue(new Error('timeout')); render(<AdminOrderingControl/>);
    const control=screen.getByRole('switch',{name:'Online ordering'});
    await waitFor(()=>expect(control).toBeEnabled()); fireEvent.click(control);
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be confirmed'); expect(control).toBeDisabled();
    API.adminAPI.ordering.mockResolvedValue({data:{enabled:false}}); fireEvent.click(screen.getByRole('button',{name:'Refresh status'}));
    await waitFor(()=>expect(control).toBeEnabled()); expect(control).toHaveAttribute('aria-checked','false');
});
