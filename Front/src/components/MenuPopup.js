import {Button, Form, Modal} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import Image from 'react-bootstrap/Image';
import '../styles/menuPopup.css';
import '../styles/fonts.css';
import API from '../api';
import {useMenuPhoto} from '../Services/MenuPhotos';
import {sortMenuOptions, includedWith, lunchInstructions, splitLunchInstructions} from '../Services/MenuPresentation';
import {cannedSodas} from '../Services/DrinkCatalog';
import {comboCategories, comboSubstitutions, splitComboInstructions, comboInstructions} from '../Services/ComboSubstitutions';

export default function MenuPopup(props) {
    const options = sortMenuOptions(props.item || []);
    const first = options[0];
    const isLunch = first?.category === 'Lunch Special';
    const isCombo = comboCategories.includes(first?.category);
    const {photo, onPhotoError} = useMenuPhoto(first?.number);
    const [sizeChosen, setSizeChosen] = useState('');
    const [count, setCount] = useState(1);
    const [instructions, setInstructions] = useState('');
    const [side, setSide] = useState('Egg roll');
    const [soda, setSoda] = useState('');
    const [riceChoice, setRiceChoice] = useState('Pork Fried Rice');
    const [showSubstitutions, setShowSubstitutions] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!props.show) return;
        const initial = props.do === 'Edit' ? props.cartItem?.item : sortMenuOptions(props.item || [])[0];
        const saved = props.do === 'Edit' ? props.cartItem?.specialInstruction || '' : '';
        const combo = splitComboInstructions(saved);
        const lunch = splitLunchInstructions(isCombo ? combo.notes : saved);
        setSizeChosen(initial?.size || '');
        setCount(props.quantity || 1);
        setInstructions(isLunch ? lunch.notes : isCombo ? combo.notes : saved);
        setRiceChoice(combo.choice);
        setShowSubstitutions(isCombo && combo.choice !== 'Pork Fried Rice');
        setSide(lunch.side);
        setSoda(lunch.soda);
        setError('');
    }, [props.show, props.cartItem, props.item, props.quantity, props.do, isLunch, isCombo]);
    const selected = options.find(item => (item.size || '') === sizeChosen) || first;
    const surcharge = isCombo ? comboSubstitutions.find(choice => choice.name === riceChoice)?.price || 0 : 0;
    const total = Math.round((Number(selected?.price || 0) + surcharge) * count * 100) / 100;
    const save = async () => {
        if (selected?.draft) return;
        if (isLunch && side === 'Can of soda' && !cannedSodas.includes(soda)) {
            setError('Please choose your canned soda.');
            return;
        }
        setSaving(true); setError('');
        try {
            const owner = sessionStorage.getItem('loggedIn') === 'true' ? sessionStorage.getItem('username') : sessionStorage.getItem('sessionId');
            const mealNotes = isLunch ? lunchInstructions(side, instructions, soda) : instructions;
            const notes = isCombo ? comboInstructions(riceChoice, mealNotes) : mealNotes;
            if (props.do === 'Edit') {
                await API.cartAPI.edit(props.id, props.name, total, count, selected, notes, owner);
            } else {
                await API.cartAPI.create(props.name, total, count, selected, owner, notes);
            }
            props.update?.();
            props.onClose();
        } catch (e) { setError('Unable to save this item. Please try again.'); }
        finally { setSaving(false); }
    };
    return <Modal show={props.show} onHide={props.onClose} centered className="popup teko" size="lg" aria-labelledby="menu-popup-title">
        <Modal.Header closeButton />
        <Modal.Body>
            <h2 className="popupTitle" id="menu-popup-title">{first?.number}. {props.name}</h2>
            <div className="popupContent">
                <div className="popupLeft"><div className="popupImageCard">
                    {photo ? <Image src={photo} alt={props.name} onError={onPhotoError} className="menuImg" /> : <div className="popupPhotoPlaceholder">Photo coming soon</div>}
                </div></div>
                <div className="popupRight">
                    {includedWith(selected) && <p className="popupDesc">{isCombo ? includedWith(selected).replace(/pork fried rice/i, riceChoice.toLowerCase()) : includedWith(selected)}</p>}
                    {options.length > 1 ? <fieldset className="popupOptions">
                        <legend className="popupOptionsTitle">{first?.category === 'Drinks' ? 'Choose a flavor' : 'Choose an option'}</legend>
                        {options.map(option => <label key={option.id} className={`popupOptionRow ${selected?.id === option.id ? 'selected' : ''}`}>
                            <input type="radio" name="options" checked={selected?.id === option.id} onChange={() => setSizeChosen(option.size || '')} />
                            <span className="customRadio" /><span className="popupOptionText">{option.size}</span>
                            <span className="popupOptionPrice">{'$' + API.priceAPI.price(Number(option.price))}</span>
                        </label>)}
                    </fieldset> : <p className="popupSinglePrice">{selected?.size && <span>{selected.size} · </span>}{'$' + API.priceAPI.price(Number(selected?.price || 0))}</p>}
                    {isCombo && <div>
                        <Form.Check type="checkbox" id="change-combo-rice" label="Change rice or noodles (optional)"
                            checked={showSubstitutions} onChange={event => {
                                setShowSubstitutions(event.target.checked);
                                if (!event.target.checked) setRiceChoice('Pork Fried Rice');
                            }} />
                    {showSubstitutions && <Form.Group controlId="combo-rice-choice">
                        <Form.Label>Rice or noodle choice</Form.Label>
                        <Form.Select value={riceChoice} onChange={event => setRiceChoice(event.target.value)}>
                            {comboSubstitutions.map(choice => <option key={choice.name} value={choice.name}>
                                {choice.name}{choice.name === 'Pork Fried Rice' ? ' (included)' : choice.price ? ` (+$${choice.price.toFixed(2)})` : ' (no extra charge)'}
                            </option>)}
                        </Form.Select>
                        <Form.Text>Substitution charges are per plate and replace the included pork fried rice.</Form.Text>
                    </Form.Group>}
                    </div>}
                    {isLunch && <fieldset className="popupOptions lunchSideOptions">
                        <legend className="popupOptionsTitle">Choose your included side</legend>
                        {['Egg roll', 'Can of soda'].map(choice => <label key={choice} className={`popupOptionRow ${side === choice ? 'selected' : ''}`}>
                            <input type="radio" name="lunch-side" checked={side === choice} onChange={() => setSide(choice)} />
                            <span className="customRadio" /><span className="popupOptionText">{choice}</span><span>Included</span>
                        </label>)}
                    </fieldset>}
                    {isLunch && side === 'Can of soda' && <Form.Group controlId="lunch-soda-flavor">
                        <Form.Label>Choose your canned soda</Form.Label>
                        <Form.Select value={soda} onChange={event => {setSoda(event.target.value); setError('');}} required>
                            <option value="">Select a soda</option>
                            {cannedSodas.map(flavor => <option key={flavor} value={flavor}>{flavor}</option>)}
                        </Form.Select>
                    </Form.Group>}
                    {selected?.draft && <p>This drink is currently unavailable for online ordering.</p>}
                    <Form.Control as="textarea" rows={3} className="specialText" aria-label="Special instructions" placeholder="Special Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} />
                    {error && <p role="alert">{error}</p>}
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className="popupQtyRow">
                <Button className="mingButtonOutline" variant="secondary" aria-label="Decrease quantity" disabled={saving || count <= (props.do === 'Edit' ? 0 : 1)} onClick={() => setCount(count - 1)}>-</Button>
                <div className="popupQtyValue">{count}</div>
                <Button className="mingButtonOutline" variant="secondary" aria-label="Increase quantity" disabled={saving || count >= 99} onClick={() => setCount(count + 1)}>+</Button>
            </div>
            <div className="popupActions">
                <Button className="mingButtonOutline" variant="secondary" onClick={props.onClose} disabled={saving}>Cancel</Button>
                <Button className="mingButton" onClick={save} disabled={saving || selected?.draft}>{selected?.draft ? 'Currently unavailable' : saving ? 'Saving…' : `${props.do === 'Edit' ? 'Update' : 'Add'} $${API.priceAPI.price(total)}`}</Button>
            </div>
        </Modal.Footer>
    </Modal>;
}

