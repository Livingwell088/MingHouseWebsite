import '../styles/OrderingStatus.css';

export default function OrderingNotice({status}) {
    if (status.enabled) return null;
    return <div className="orderingNotice" role="status">
        <strong>{status.loading ? 'Checking availability' : 'Online ordering unavailable'}</strong>
        <p>{status.message}</p>
        {!status.loading && <div><a href="tel:15087566888">Call (508) 756-6888</a><button onClick={status.refresh}>Check again</button></div>}
    </div>;
}
