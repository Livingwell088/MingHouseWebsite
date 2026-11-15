import {TextEncoder} from 'util';
import axios from 'axios';
import API, {clearAdminCredentials} from './api';
import {ADMIN_DEVICE_KEY} from './Services/AdminDeviceStorage';

jest.mock('axios', () => ({__esModule: true, default: {create: jest.fn()}}));
const get = jest.fn(), post = jest.fn(), use = jest.fn();
beforeEach(() => {
    window.TextEncoder = TextEncoder;
    clearAdminCredentials(); localStorage.clear(); sessionStorage.clear(); jest.clearAllMocks();
    axios.create.mockReturnValue({get, post, interceptors: {response: {use}}});
    get.mockResolvedValue({data: {authenticated: true}});
    post.mockResolvedValue({data: {token: 'remembered-test-token', expiresAt: '2026-12-13T00:00:00Z'}});
});

test('remembered login persists only a token and subsequent requests omit Basic credentials', async () => {
    await API.adminAPI.login('admin', 'do-not-store-this-password', true);
    expect(post).toHaveBeenCalledWith('/admin/devices');
    expect(localStorage.getItem(ADMIN_DEVICE_KEY)).toBe('remembered-test-token');
    expect(JSON.stringify(localStorage)).not.toContain('do-not-store');
    await API.adminAPI.session();
    const headers = axios.create.mock.calls.at(-1)[0].headers;
    expect(headers['X-Admin-Token']).toBe('remembered-test-token');
    expect(headers.Authorization).toBeUndefined();
});
test('existing saved token restores admin access without a password login', async () => {
    localStorage.setItem(ADMIN_DEVICE_KEY, 'previously-issued-token');
    await API.adminAPI.session();
    expect(axios.create.mock.calls.at(-1)[0].headers['X-Admin-Token']).toBe('previously-issued-token');
    expect(post).not.toHaveBeenCalled();
});
test('unchecked login does not create a remembered token', async () => {
    await API.adminAPI.login('admin', 'memory-only-password', false);
    expect(localStorage.getItem(ADMIN_DEVICE_KEY)).toBeNull();
    expect(post).not.toHaveBeenCalled();
    await API.adminAPI.session();
    expect(axios.create.mock.calls.at(-1)[0].headers.Authorization).toMatch(/^Basic /);
});
test('logout revokes the server token and clears browser storage', async () => {
    localStorage.setItem(ADMIN_DEVICE_KEY, 'previously-issued-token');
    await API.adminAPI.logout();
    expect(post).toHaveBeenCalledWith('/admin/devices/logout');
    expect(localStorage.getItem(ADMIN_DEVICE_KEY)).toBeNull();
});
test('failed all-device revocation retains the login so staff can retry', async () => {
    localStorage.setItem(ADMIN_DEVICE_KEY, 'previously-issued-token');
    post.mockRejectedValueOnce(new Error('offline'));
    await expect(API.adminAPI.revokeDevices()).rejects.toThrow('offline');
    expect(localStorage.getItem(ADMIN_DEVICE_KEY)).toBe('previously-issued-token');
});
test('expired or revoked tokens clear login and notify the protected route', async () => {
    localStorage.setItem(ADMIN_DEVICE_KEY, 'expired-token');
    await API.adminAPI.session();
    const ended = jest.fn(); window.addEventListener('admin-session-ended', ended);
    const rejected = use.mock.calls.at(-1)[1];
    await expect(rejected({response: {status: 401}})).rejects.toEqual({response: {status: 401}});
    expect(localStorage.getItem(ADMIN_DEVICE_KEY)).toBeNull(); expect(ended).toHaveBeenCalled();
    window.removeEventListener('admin-session-ended', ended);
});
test('remembered admin tokens are not attached to customer or public menu requests', async () => {
    localStorage.setItem(ADMIN_DEVICE_KEY, 'admin-token'); sessionStorage.setItem('customerToken', 'customer-token');
    await API.menuAPI.get();
    const headers = axios.create.mock.calls.at(-1)[0].headers;
    expect(headers['X-Admin-Token']).toBeUndefined(); expect(headers.Authorization).toBeUndefined();
    expect(headers['X-Customer-Token']).toBe('customer-token');
});
