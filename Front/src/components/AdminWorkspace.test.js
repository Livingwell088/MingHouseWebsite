import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import API from '../api';
import AdminOrders from './AdminOrders';
import AdminMenu from './AdminMenu';
import AdminDashboard from './AdminDashboard';
import {buildAnalytics} from './AdminAnalytics';
import {adjustedPrice, newestFirst, salesSummary} from '../Services/AdminPresentation';
jest.mock('../api', () => ({__esModule: true, default: {orderAPI: {get: jest.fn(), updateStatus: jest.fn()}, menuAPI: {get: jest.fn(), edit: jest.fn()}, adminAPI: {notifications: jest.fn(), retryNotification: jest.fn()}}}));
jest.mock('recharts', () => ({}));
const order = {id: 1, orderName: 'MH-0001', datePlaced: '2026-11-13', timePlaced: '9:05:00', orderStatus: 'New', orderType: 'Pickup', orderPrice: 30, total: 32.1, user: {firstName: 'Test', lastName: 'Customer'}, phoneNumber: '5551234567', items: [{id: 1, quantity: 2, orderPrice: 30, item: {number: 'L1', name: 'Lunch chicken', size: ''}, specialInstruction: 'Rice/noodle choice: Shrimp Fried Rice\nLunch side: Can of soda — Sprite\nNo onions'}]};
const menu = [{id: 'dr1-1', number: 'DR1', name: 'Can Soda', size: 'Pepsi', category: 'Drinks', price: '1.35', available: true}, {id: 'dr1-2', number: 'DR1', name: 'Can Soda', size: 'Sprite', category: 'Drinks', price: '1.35', available: true}];
beforeEach(() => {jest.clearAllMocks(); API.orderAPI.get.mockResolvedValue({data: [order]}); API.adminAPI.notifications.mockResolvedValue({data: []}); API.menuAPI.get.mockResolvedValue({data: menu}); API.menuAPI.edit.mockResolvedValue({}); API.orderAPI.updateStatus.mockResolvedValue({});});
const show = component => render(<MemoryRouter>{component}</MemoryRouter>);
test('sales and chronology handle legacy dates, cancellation, and earlier active orders', () => {
    const orders = [order, {...order, id: 2, orderStatus: 'Cancelled'}, {...order, id: 3, datePlaced: 'November 12 2026', timePlaced: '23:00:00'}];
    expect(salesSummary(orders, '2026-11-13')).toEqual({count: 2, revenue: 30, average: 30, active: 2});
    expect(newestFirst(orders).map(o => o.id)).toEqual([2, 1, 3]);
});
test('analytics uses real hourly orders and line revenue without multiplying quantity twice', () => {
    const report = buildAnalytics([order, {...order, id: 2, orderStatus: 'Cancelled'}], '2026-11-13', '2026-11-13');
    expect(report.revenue).toBe(30); expect(report.hours[9].orders).toBe(1); expect(report.top[0]).toMatchObject({quantity: 2, revenue: 30});
});
test('price adjustments reject empty, infinite and negative results and round cents', () => {
    expect(adjustedPrice('1.35', 'percent', '5')).toBe(1.42);
    expect(adjustedPrice('1.35', 'amount', '-2')).toBeNull();
    expect(adjustedPrice('1.35', 'set', '')).toBeNull();
    expect(adjustedPrice('1.35', 'set', 'Infinity')).toBeNull();
    expect(adjustedPrice('1.35', 'set', '0')).toBe(0);
});
test('dashboard shortcuts navigate and recent orders link directly to details', async () => {
    show(<AdminDashboard/>);
    expect(screen.getByRole('link', {name: /Update prices/})).toHaveAttribute('href', '/admin/menu');
    expect(await screen.findByRole('link', {name: /MH-0001/})).toHaveAttribute('href', '/admin/orders?order=1');
});
test('order details show substitutions and lunch soda; status and email retries use correct IDs', async () => {
    API.adminAPI.notifications.mockResolvedValue({data: [{id: 9, orderId: 1, audience: 'Customer', status: 'Failed', attempts: 2}]});
    show(<AdminOrders/>);
    fireEvent.click(await screen.findByRole('button', {name: /MH-0001/}));
    expect(screen.getByText(/Rice\/noodle choice:/)).toHaveTextContent('Lunch side: Can of soda — Sprite');
    fireEvent.change(screen.getByLabelText('Status for MH-0001'), {target: {value: 'Preparing'}});
    await waitFor(() => expect(API.orderAPI.updateStatus).toHaveBeenCalledWith(1, 'Preparing'));
    await waitFor(() => expect(screen.getAllByRole('button', {name: 'Retry email'})[0]).not.toBeDisabled());
    fireEvent.click(screen.getAllByRole('button', {name: 'Retry email'})[0]);
    await waitFor(() => expect(API.adminAPI.retryNotification).toHaveBeenCalledWith(9));
});
test('menu search finds drink flavors and availability updates preserve option identity', async () => {
    show(<AdminMenu/>); await screen.findByText('Pepsi');
    fireEvent.change(screen.getByRole('searchbox'), {target: {value: 'Sprite'}});
    expect(screen.queryByText('Pepsi')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: /Mark unavailable/}));
    await waitFor(() => expect(API.menuAPI.edit).toHaveBeenCalledWith({...menu[1], available: false}));
    expect(await screen.findByRole('status')).toHaveTextContent('saved');
});
test('bulk edits require review and retain only failed prices when part of a save fails', async () => {
    API.menuAPI.edit.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('offline'));
    show(<AdminMenu/>); await screen.findByText('Pepsi');
    fireEvent.click(screen.getByLabelText('Select all 2 shown'));
    fireEvent.change(screen.getByLabelText('Amount'), {target: {value: '0.50'}});
    fireEvent.click(screen.getByRole('button', {name: 'Review price changes'}));
    const dialog = await screen.findByRole('dialog');
    expect(API.menuAPI.edit).not.toHaveBeenCalled();
    expect(within(dialog).getAllByText('$1.35 → $1.85')).toHaveLength(2);
    fireEvent.click(within(dialog).getByRole('button', {name: 'Save reviewed prices'}));
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('1 saved; 1 could not be saved');
    expect(within(dialog).getAllByText('$1.35 → $1.85')).toHaveLength(1);
});
test('order fetch failure is visible instead of silently showing an empty dashboard', async () => {
    API.orderAPI.get.mockRejectedValue(new Error('offline')); show(<AdminOrders/>);
    expect(await screen.findByRole('alert')).toHaveTextContent('Orders could not be refreshed');
});
test('new orders arriving after the initial load create a dismissible alert', async () => {
    show(<AdminOrders/>); await screen.findByRole('button', {name: /MH-0001/});
    API.orderAPI.get.mockResolvedValue({data: [order, {...order, id: 2, orderName: 'MH-0002'}]});
    fireEvent.focus(window);
    expect(await screen.findByText('1 new order received.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'View new order'}));
    expect(screen.getByRole('button', {name: /MH-0002/})).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByText('1 new order received.')).not.toBeInTheDocument();
});
test('failed individual saves keep the edited price in the dialog', async () => {
    API.menuAPI.edit.mockRejectedValue(new Error('offline')); show(<AdminMenu/>);
    fireEvent.click(await screen.findByRole('button', {name: 'Edit DR1. Can Soda · Pepsi'}));
    fireEvent.change(screen.getByLabelText('Price ($)'), {target: {value: '1.50'}});
    fireEvent.click(screen.getByRole('button', {name: 'Save changes'}));
    expect(await within(screen.getByRole('dialog')).findByRole('alert')).toHaveTextContent('Your edits are still here');
    expect(screen.getByLabelText('Price ($)')).toHaveValue(1.5);
});
