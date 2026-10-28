import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import { ensureCustomerSession } from './api';
jest.mock('./api', () => ({ ensureCustomerSession: jest.fn() }));
jest.mock('./components/Appbar', () => () => <div>Navigation</div>);
jest.mock('./components/Footer', () => () => <div>Footer</div>);
jest.mock('./components/MingBot', () => () => null);
const show = () => render(<MemoryRouter><Routes><Route element={<MainLayout />}><Route path="/" element={<div>Menu content</div>} /></Route></Routes></MemoryRouter>);
test('waits for a signed session before rendering ordering controls', async () => {
  let finish;
  ensureCustomerSession.mockReturnValue(new Promise(resolve => { finish=resolve; }));
  show(); expect(screen.getByRole('status')).toHaveTextContent('Connecting');
  finish(); expect(await screen.findByText('Menu content')).toBeInTheDocument();
});
test('connection failure can be retried', async () => {
  ensureCustomerSession.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce();
  show(); fireEvent.click(await screen.findByRole('button',{name:'Try again'}));
  await waitFor(() => expect(screen.getByText('Menu content')).toBeInTheDocument());
});
