import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminProtectedRoute from './AdminProtectedRoute';
import API from '../api';

jest.mock('../api', () => ({
    __esModule: true,
    default: {adminAPI: {login: jest.fn(), session: jest.fn()}},
}));

beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
});

test('admin login waits for server approval before navigating', async () => {
    API.adminAPI.login.mockResolvedValue({data: {authenticated: true}});
    render(<MemoryRouter initialEntries={['/admin/login']}><Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<p>Protected dashboard</p>} />
    </Routes></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Admin password'), {target: {value: 'test-password'}});
    fireEvent.click(screen.getByRole('button', {name: 'Login'}));
    expect(await screen.findByText('Protected dashboard')).toBeInTheDocument();
    expect(API.adminAPI.login).toHaveBeenCalledWith('admin', 'test-password');
    expect(sessionStorage.getItem('adminLoggedIn')).toBeNull();
});

test('rejected admin credentials remain on the login screen', async () => {
    API.adminAPI.login.mockRejectedValue({response: {status: 401}});
    render(<MemoryRouter><AdminLogin /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Admin password'), {target: {value: 'wrong-password'}});
    fireEvent.click(screen.getByRole('button', {name: 'Login'}));
    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect username or password.');
});

test('a forged browser flag cannot open a protected route', async () => {
    sessionStorage.setItem('adminLoggedIn', 'true');
    API.adminAPI.session.mockRejectedValue({response: {status: 401}});
    render(<MemoryRouter initialEntries={['/admin']}><Routes>
        <Route path="/admin/login" element={<p>Sign in required</p>} />
        <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<p>Protected dashboard</p>} />
        </Route>
    </Routes></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Sign in required')).toBeInTheDocument());
    expect(screen.queryByText('Protected dashboard')).not.toBeInTheDocument();
});
