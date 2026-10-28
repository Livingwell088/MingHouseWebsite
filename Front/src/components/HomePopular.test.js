import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import HomePopular from './HomePopular';
import API from '../api';

jest.mock('../api', () => ({
    menuAPI: { getByNumber: jest.fn() },
    cartAPI: { create: jest.fn() },
    priceAPI: { price: value => Number(value).toFixed(2) }
}));

const dishes = {
    S10: [{ id: 's10', number: 'S10', name: 'General Tsos Chicken', price: '13.05', size: '', available: true }],
    9: [
        { id: '9-sm', number: '9', name: 'Crab Rangoon', price: '6.15', size: '(Sm 6)', available: true },
        { id: '9-lg', number: '9', name: 'Crab Rangoon', price: '8.95', size: '(Lg 10)', available: true }
    ],
    D3: [{ id: 'd3', number: 'D3', name: 'Boneless Ribs, Chicken Wings, Crab Rangoon', price: '11.85', size: '', available: true }]
};

beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear(); sessionStorage.setItem('sessionId', 'Guest-test');
    API.menuAPI.getByNumber.mockImplementation(number => Promise.resolve({ data: dishes[number] }));
    API.cartAPI.create.mockResolvedValue({ data: 'Guest-test' });
});

test.each(['S10', '9', 'D3'])('card %s opens its matching menu popup', async number => {
    render(<HomePopular />);
    fireEvent.click(await screen.findByRole('button', { name: new RegExp(`Choose #${number} `) }));
    const popup = await screen.findByRole('dialog');
    expect(within(popup).getByRole('heading', { name: dishes[number][0].name })).toBeInTheDocument();
    expect(within(popup).getAllByRole('radio')).toHaveLength(dishes[number].length);
});

test('size, quantity, and instructions are passed to the existing cart API', async () => {
    render(<HomePopular />);
    fireEvent.click(await screen.findByRole('button', { name: /Choose #9 / }));
    const popup = within(await screen.findByRole('dialog'));
    fireEvent.click(popup.getByText('(Lg 10)'));
    fireEvent.click(popup.getByRole('button', { name: '+', exact: true }));
    fireEvent.change(popup.getByPlaceholderText('Special Instructions'), { target: { value: 'No peanuts' } });
    fireEvent.click(popup.getByRole('button', { name: 'Add $17.90', exact: true }));
    await waitFor(() => expect(API.cartAPI.create).toHaveBeenCalledWith('Crab Rangoon', 17.9, 2, dishes['9'][1], 'Guest-test', 'No peanuts'));
});

test('a failed menu lookup gives a retryable error instead of opening an empty popup', async () => {
    render(<HomePopular />);
    await screen.findByText('$13.05');
    API.menuAPI.getByNumber.mockRejectedValueOnce(new Error('offline'));
    fireEvent.click(screen.getByRole('button', { name: /Choose #S10 / }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please try again');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
