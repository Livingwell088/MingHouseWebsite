import {act, fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import AdminOrderAlarm from './AdminOrderAlarm';
import useAdminOrders, {AdminOrdersProvider} from '../Services/useAdminOrders';
import {createOrderAlarmAudio} from '../Services/OrderAlarmAudio';
import {ACK_KEY, waitingOrders} from '../Services/OrderAcknowledgements';
import API from '../api';
jest.mock('../api', () => ({__esModule:true, default:{orderAPI:{get:jest.fn()},adminAPI:{notifications:jest.fn()}}}));
jest.mock('../Services/OrderAlarmAudio', () => ({createOrderAlarmAudio:jest.fn()}));
let audio;
const order = {id:101,orderName:'MH-0101',orderStatus:'New',datePlaced:'2026-11-15',timePlaced:'12:00:00'};
const settle = async () => {await act(async () => {await Promise.resolve(); await Promise.resolve();});};
beforeEach(() => {
    jest.useFakeTimers(); localStorage.clear(); jest.clearAllMocks(); document.title='Admin';
    audio={state:'closed',enable:jest.fn(async()=>{audio.state='running';}),play:jest.fn(),stop:jest.fn(),dispose:jest.fn()};
    createOrderAlarmAudio.mockReturnValue(audio);
    API.orderAPI.get.mockResolvedValue({data:[]}); API.adminAPI.notifications.mockResolvedValue({data:[]});
});
afterEach(()=>{jest.useRealTimers();});
function show() {return render(<MemoryRouter><AdminOrdersProvider><AdminOrderAlarm/></AdminOrdersProvider></MemoryRouter>);}
test('new order alarm repeats until acknowledged, without changing order status', async () => {
    show(); await settle(); fireEvent.click(screen.getByRole('button',{name:'Enable sound'})); await settle(); audio.play.mockClear();
    API.orderAPI.get.mockResolvedValue({data:[order]});
    await act(async()=>{jest.advanceTimersByTime(5000);}); await settle();
    expect(screen.getByText('1 new order waiting')).toBeInTheDocument(); expect(audio.play).toHaveBeenCalledTimes(1);
    expect(document.title).toContain('NEW ORDER');
    await act(async()=>{jest.advanceTimersByTime(10000);}); expect(audio.play).toHaveBeenCalledTimes(3);
    fireEvent.click(screen.getByRole('button',{name:'Acknowledge & stop sound'}));
    const count=audio.play.mock.calls.length;
    await act(async()=>{jest.advanceTimersByTime(10000);});
    expect(audio.play).toHaveBeenCalledTimes(count); expect(document.title).toBe('Admin');
    expect(JSON.parse(localStorage.getItem(ACK_KEY))).toContain('101'); expect(order.orderStatus).toBe('New');
});
test('unacknowledged existing orders alert on reopening; acknowledgments survive reopening', async () => {
    API.orderAPI.get.mockResolvedValue({data:[order]}); const first=show(); await settle();
    expect(screen.getByText('1 new order waiting')).toBeInTheDocument(); expect(audio.play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:'Enable sound'})); await settle(); expect(audio.play).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:'Acknowledge & stop sound'})); first.unmount();
    show(); await settle(); expect(screen.queryByText('1 new order waiting')).not.toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Enable sound'})).toBeInTheDocument();
});
test('email delivery failures cannot prevent immediate new order alerts', async () => {
    API.adminAPI.notifications.mockReturnValue(new Promise(()=>{})); API.orderAPI.get.mockResolvedValue({data:[order]});
    show(); await settle(); expect(screen.getByText('1 new order waiting')).toBeInTheDocument();
    expect(screen.getByText('Live · checks every 5 seconds')).toBeInTheDocument();
});
test('blocked audio is clearly reported and never labeled enabled', async () => {
    audio.enable.mockRejectedValue(new Error('Sound is blocked.')); show(); await settle();
    fireEvent.click(screen.getByRole('button',{name:'Enable sound'})); await settle();
    expect(screen.getByRole('alert')).toHaveTextContent('Sound is blocked'); expect(screen.queryByRole('button',{name:'Test sound'})).not.toBeInTheDocument();
});
test('connection loss is visible and the newest order is retained', async () => {
    API.orderAPI.get.mockResolvedValueOnce({data:[order]}).mockRejectedValue(new Error('offline')); show(); await settle();
    await act(async()=>{jest.advanceTimersByTime(5000);}); await settle();
    expect(screen.getByText('Connection problem')).toBeInTheDocument(); expect(screen.getByText(/Order checks are delayed/)).toBeInTheDocument();
    expect(screen.getByText('1 new order waiting')).toBeInTheDocument();
});
test('route changes share one monitor and do not reset enabled sound', async () => {
    function Consumer() {const {orders}=useAdminOrders(); return <p>{orders.length} orders</p>;}
    render(<MemoryRouter><AdminOrdersProvider><AdminOrderAlarm/><Routes><Route path="/" element={<Consumer/>}/><Route path="/admin/orders" element={<Consumer/>}/></Routes></AdminOrdersProvider></MemoryRouter>);
    await settle(); expect(API.orderAPI.get).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button',{name:'Enable sound'})); await settle();
    API.orderAPI.get.mockResolvedValue({data:[order]}); await act(async()=>{jest.advanceTimersByTime(5000);}); await settle();
    fireEvent.click(screen.getByRole('button',{name:'View order'}));
    expect(screen.getByRole('button',{name:'Test sound'})).toBeInTheDocument(); expect(API.orderAPI.get).toHaveBeenCalledTimes(2);
});
test('preparing and cancelled orders do not ring; another new order rings after acknowledgment', () => {
    expect(waitingOrders([order,{...order,id:102,orderStatus:'Preparing'},{...order,id:103,orderStatus:'Cancelled'}],new Set())).toEqual([order]);
    expect(waitingOrders([order,{...order,id:104}],new Set(['101']))).toEqual([{...order,id:104}]);
});
test('muting and unmounting stop scheduled audio', async()=>{
    API.orderAPI.get.mockResolvedValue({data:[order]}); const view=show(); await settle();
    fireEvent.click(screen.getByRole('button',{name:'Enable sound'})); await settle();
    fireEvent.click(screen.getByRole('button',{name:'Mute sound'})); const count=audio.play.mock.calls.length;
    await act(async()=>{jest.advanceTimersByTime(10000);}); expect(audio.play).toHaveBeenCalledTimes(count);
    view.unmount(); expect(audio.dispose).toHaveBeenCalled();
});
test('acknowledgment still stops the alarm when browser storage is full', async()=>{
    API.orderAPI.get.mockResolvedValue({data:[order]}); show(); await settle();
    fireEvent.click(screen.getByRole('button',{name:'Enable sound'})); await settle();
    const storage=jest.spyOn(Storage.prototype,'setItem').mockImplementationOnce(()=>{throw new Error('quota');});
    fireEvent.click(screen.getByRole('button',{name:'Acknowledge & stop sound'})); storage.mockRestore();
    expect(screen.getByText(/Acknowledged for this visit only/)).toBeInTheDocument();
    const count=audio.play.mock.calls.length;
    await act(async()=>{jest.advanceTimersByTime(10000);}); expect(audio.play).toHaveBeenCalledTimes(count);
});
