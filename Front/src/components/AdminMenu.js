import {useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import API from '../api';
import {menuCategory, sortMenuOptions} from '../Services/MenuPresentation';
import {adjustedPrice, money} from '../Services/AdminPresentation';

const labelFor = item => `${item.number}. ${item.name}${item.size ? ` · ${item.size}` : ''}`;
export default function AdminMenu() {
    const [menu, setMenu] = useState([]), [selected, setSelected] = useState([]);
    const [search, setSearch] = useState(''), [category, setCategory] = useState('All'), [availability, setAvailability] = useState('All');
    const [type, setType] = useState('amount'), [amount, setAmount] = useState(''), [preview, setPreview] = useState(null);
    const [editing, setEditing] = useState(null), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
    const [error, setError] = useState(''), [modalError, setModalError] = useState(''), [message, setMessage] = useState('');
    const load = async () => {
        try {const {data} = await API.menuAPI.get(); setMenu(data); setError('');}
        catch (e) {setError('The menu could not be refreshed. Please try again.');}
        finally {setLoading(false);}
    };
    useEffect(() => {load();}, []);
    const categories = [...new Set(menu.map(i => menuCategory(i.category)))].sort();
    const filtered = sortMenuOptions(menu).sort((a, b) => menuCategory(a.category).localeCompare(menuCategory(b.category)) || String(a.number).localeCompare(String(b.number), undefined, {numeric: true})).filter(i =>
        (category === 'All' || menuCategory(i.category) === category) && (availability === 'All' || (i.available !== false) === (availability === 'Available')) && `${i.number} ${i.name} ${i.size} ${menuCategory(i.category)}`.toLowerCase().includes(search.toLowerCase().trim()));
    const toggle = id => setSelected(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
    const save = async (item, close = false) => {
        setBusy(true); setModalError(''); setError(''); setMessage('');
        try {
            await API.menuAPI.edit(item);
            setMenu(rows => rows.map(row => row.id === item.id ? item : row));
            setMessage(`${labelFor(item)} saved.`); if (close) setEditing(null);
        } catch (e) {if (close) setModalError('Unable to save. Your edits are still here; please try again.'); else setError('Unable to change availability. Please try again.');}
        finally {setBusy(false);}
    };
    const review = () => {
        const rows = menu.filter(i => selected.includes(i.id)).map(i => ({...i, nextPrice: adjustedPrice(i.price, type, amount)}));
        if (!rows.length || rows.some(i => i.nextPrice === null)) {setError('Enter an amount that leaves every selected price at $0.00 or above.'); return;}
        setError(''); setModalError(''); setPreview(rows);
    };
    const apply = async () => {
        setBusy(true); setModalError(''); setMessage('');
        const results = await Promise.allSettled(preview.map(({nextPrice, ...item}) => API.menuAPI.edit({...item, price: nextPrice.toFixed(2)})));
        const succeeded = preview.filter((_, i) => results[i].status === 'fulfilled');
        const failed = preview.filter((_, i) => results[i].status === 'rejected');
        setMenu(rows => rows.map(item => {const change = succeeded.find(i => i.id === item.id); return change ? {...item, price: change.nextPrice.toFixed(2)} : item;}));
        setSelected(failed.map(i => i.id));
        if (failed.length) {setPreview(failed); setModalError(`${succeeded.length} saved; ${failed.length} could not be saved. Only the failed items remain below. You can retry them.`);}
        else {setPreview(null); setAmount(''); setMessage(`${succeeded.length} prices updated.`);}
        setBusy(false);
    };
    return <div>
        <div className="adminPageHeader"><div><p className="adminEyebrow">Menu editor</p><h1>Prices & availability</h1><p>Manage each size and drink flavor separately.</p></div><button onClick={load} disabled={busy || loading}>Refresh menu</button></div>
        {error && <p role="alert" className="adminNotice error">{error}</p>}{message && <p role="status" className="adminNotice success">{message}</p>}
        <div className="adminFilters"><label>Search menu<input type="search" placeholder="Number, dish, or drink flavor" value={search} onChange={e => setSearch(e.target.value)}/></label><label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option>All</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Availability<select value={availability} onChange={e => setAvailability(e.target.value)}>{['All', 'Available', 'Unavailable'].map(c => <option key={c}>{c}</option>)}</select></label><button onClick={() => {setSearch(''); setCategory('All'); setAvailability('All');}}>Clear filters</button></div>
        <details className="adminPanel adminBulkPanel"><summary>Change multiple prices <span>{selected.length} selected across all filters</span></summary><div className="adminFilters"><label>Adjustment<select value={type} onChange={e => setType(e.target.value)}><option value="amount">Add / subtract dollars</option><option value="percent">Add / subtract percent</option><option value="set">Set a fixed price</option></select></label><label>Amount<input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder={type === 'percent' ? 'e.g. 5 or -5' : 'e.g. 0.50 or -0.50'}/></label><button disabled={busy || !selected.length || amount === ''} onClick={review}>Review price changes</button><button disabled={busy || !selected.length} onClick={() => setSelected([])}>Clear selection</button></div><p>Review every price before saving. Changes apply to all selected rows, including rows hidden by filters.</p></details>
        <div className="adminSelection"><label><input type="checkbox" disabled={busy || !filtered.length} checked={filtered.length > 0 && filtered.every(i => selected.includes(i.id))} onChange={e => setSelected(ids => e.target.checked ? [...new Set([...ids, ...filtered.map(i => i.id)])] : ids.filter(id => !filtered.some(i => i.id === id)))}/> Select all {filtered.length} shown</label><span>{loading ? 'Loading menu…' : `${filtered.length} options · ${selected.length} selected`}</span></div>
        <div className="adminMenuList">{filtered.map(item => <article className={`adminMenuRow ${selected.includes(item.id) ? 'isSelected' : ''}`} key={item.id}>
            <input type="checkbox" aria-label={`Select ${labelFor(item)}`} disabled={busy} checked={selected.includes(item.id)} onChange={() => toggle(item.id)}/>
            <div className="adminMenuIdentity"><small>{menuCategory(item.category)}</small><strong>{item.number}. {item.name}</strong><span>{item.size || 'One size'}{String(item.spicy).toLowerCase() === 'yes' ? ' · Spicy' : ''}</span></div>
            <strong className="adminMenuPrice">{money(item.price)}</strong><button className={`adminAvailability ${item.available === false ? 'unavailable' : ''}`} disabled={busy} aria-label={`${item.available === false ? 'Make available' : 'Mark unavailable'}: ${labelFor(item)}`} onClick={() => save({...item, available: item.available === false})}>{item.available === false ? 'Unavailable' : 'Available'}</button><button disabled={busy} onClick={() => {setEditing({...item}); setModalError('');}}>Edit<span className="visually-hidden"> {labelFor(item)}</span></button>
        </article>)}</div>
        {!loading && !filtered.length && <div className="adminPanel adminEmpty"><strong>No menu options found</strong><p>Try another search or clear your filters.</p></div>}
        <Modal show={!!editing} onHide={() => !busy && setEditing(null)} centered scrollable backdrop={busy ? 'static' : true} keyboard={!busy} contentClassName="adminDialog" aria-labelledby="admin-edit-title">
            <Modal.Header closeButton={!busy}><Modal.Title id="admin-edit-title">Edit menu option</Modal.Title></Modal.Header>
            {editing && <form onSubmit={e => {e.preventDefault(); if (!editing.name.trim() || !editing.number.trim() || !editing.category.trim() || adjustedPrice(0, 'set', editing.price) === null) {setModalError('Provide a number, name, category, and a valid nonnegative price.'); return;} save({...editing, price: Number(editing.price).toFixed(2)}, true);}}>
                <Modal.Body><p>{labelFor(editing)}</p>{modalError && <p role="alert" className="adminNotice error">{modalError}</p>}<fieldset disabled={busy} className="adminEditFields">{[['number', 'Item number'], ['name', 'Name'], ['size', 'Size / drink flavor'], ['category', 'Category'], ['price', 'Price ($)'], ['spicy', 'Spicy']].map(([key, label]) => <label key={key}>{label}<input required={['number', 'name', 'category', 'price'].includes(key)} type={key === 'price' ? 'number' : 'text'} min={key === 'price' ? '0' : undefined} step={key === 'price' ? '0.01' : undefined} value={editing[key] ?? ''} onChange={e => setEditing({...editing, [key]: e.target.value})}/></label>)}<label className="adminCheck"><input type="checkbox" checked={editing.available !== false} onChange={e => setEditing({...editing, available: e.target.checked})}/> Available to order</label></fieldset></Modal.Body><Modal.Footer><button type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</button><button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></Modal.Footer>
            </form>}
        </Modal>
        <Modal show={!!preview} onHide={() => !busy && setPreview(null)} centered scrollable backdrop={busy ? 'static' : true} keyboard={!busy} contentClassName="adminDialog" aria-labelledby="admin-bulk-title"><Modal.Header closeButton={!busy}><Modal.Title id="admin-bulk-title">Review {preview?.length} price changes</Modal.Title></Modal.Header><Modal.Body>{modalError && <p role="alert" className="adminNotice error">{modalError}</p>}<p>These prices will be saved to the menu.</p>{preview?.map(i => <div className="adminPricePreview" key={i.id}><span>{labelFor(i)}</span><strong>{money(i.price)} → {money(i.nextPrice)}</strong></div>)}</Modal.Body><Modal.Footer><button disabled={busy} onClick={() => setPreview(null)}>Cancel</button><button disabled={busy} onClick={apply}>{busy ? 'Saving…' : 'Save reviewed prices'}</button></Modal.Footer></Modal>
    </div>;
}
