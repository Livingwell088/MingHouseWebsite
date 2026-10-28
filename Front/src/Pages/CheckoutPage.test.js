import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';
import API from '../api';
jest.mock('../api', () => ({
  cartAPI: { get: jest.fn() }, menuAPI: { getByNumber: jest.fn() },
  userAPI: { getUser: jest.fn(), updateContact: jest.fn() },
  orderAPI: { create: jest.fn(), submission: jest.fn() },
  priceAPI: { price: value => Number(value).toFixed(2) }
}));
jest.mock('../components/CheckoutLeft', () => props => <input aria-label="Phone" name="phoneNumber" onChange={props.handleChangeFields} />);
jest.mock('../components/ConfirmationModal', () => () => <div>Saved order receipt</div>);
jest.mock('../components/LoginModal', () => () => null);
const line={id:1,quantity:1,orderPrice:4.25,item:{id:'dish',number:'1',name:'Egg Roll'}};
const saved={id:9,orderName:'test-9',items:[line]};
beforeEach(() => {
  jest.clearAllMocks(); sessionStorage.clear();
  sessionStorage.setItem('sessionId','Guest-test'); sessionStorage.setItem('orderType','Pickup'); sessionStorage.setItem('orderTime','ASAP');
  Object.defineProperty(window,'crypto',{configurable:true,value:{randomUUID:()=> '30cd0e2c-1136-47d6-87b9-824d55d86048'}});
  API.cartAPI.get.mockResolvedValue({data:[line]}); API.menuAPI.getByNumber.mockResolvedValue({data:[]});
  API.userAPI.getUser.mockResolvedValue({data:{firstName:'Test',lastName:'Customer',email:'test@example.com'}});
  API.orderAPI.create.mockResolvedValue({data:saved}); API.userAPI.updateContact.mockResolvedValue({});
});
async function show() {
  render(<MemoryRouter><CheckoutPage /></MemoryRouter>);
  await screen.findByText(/1x Egg Roll/);
  await waitFor(() => expect(API.userAPI.getUser).toHaveBeenCalled());
  fireEvent.change(screen.getByLabelText('Phone'),{target:{name:'phoneNumber',value:'5085550100'}});
}
test('double click submits once and keeps the receipt', async () => {
  let finish;
  API.userAPI.updateContact.mockReturnValue(new Promise(resolve => {finish=resolve;}));
  await show(); const button=screen.getByRole('button',{name:'Place Order'});
  fireEvent.click(button); fireEvent.click(button);
  expect(API.userAPI.updateContact).toHaveBeenCalledTimes(1); finish({});
  expect(await screen.findByText('Saved order receipt')).toBeInTheDocument();
  expect(API.orderAPI.create).toHaveBeenCalledTimes(1);
  expect(sessionStorage.getItem('checkoutAttempt')).toBeNull();
});
test('a lost response checks the saved submission before allowing another order', async () => {
  API.orderAPI.create.mockRejectedValueOnce(new Error('timeout'));
  API.orderAPI.submission.mockResolvedValue({data:saved}); await show();
  fireEvent.click(screen.getByRole('button',{name:'Place Order'}));
  const check=await screen.findByRole('button',{name:'Check order submission'});
  await waitFor(() => expect(check).not.toBeDisabled()); fireEvent.click(check);
  expect(await screen.findByText('Saved order receipt')).toBeInTheDocument();
  expect(API.orderAPI.create).toHaveBeenCalledTimes(1);
});
