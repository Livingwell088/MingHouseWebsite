import '../styles/fonts.css';
import '../styles/HomePopular.css';
import { useEffect, useState } from 'react';
import API from '../api';
import PopularCard from './PopularCard';
import MenuPopup from './MenuPopup';

const featuredDishes = [
    { number: 'S10', name: 'General Tso’s Chicken', description: 'Chef’s specialty', image: '/images/S10.png' },
    { number: '9', name: 'Crab Rangoon', description: 'Available in small and large', image: '/images/9.png' },
    { number: 'D3', name: 'Boneless Ribs, Chicken Wings, Crab Rangoon', description: 'All-day special', image: '/images/D3.png' }
];

export default function HomePopular() {
    const [dishes, setDishes] = useState(featuredDishes);
    const [selected, setSelected] = useState(null);
    const [opening, setOpening] = useState(false);
    const [error, setError] = useState('');

    const openDish = async dish => {
        if (opening) return;
        setOpening(true);
        setError('');
        try {
            const { data } = await API.menuAPI.getByNumber(dish.number);
            const options = data.filter(item => item.available !== false);
            if (!options.length) {
                setError('This dish is currently unavailable. Please choose another dish.');
                return;
            }
            setSelected(options);
        } catch {
            setError('Unable to load this dish. Please try again.');
        } finally {
            setOpening(false);
        }
    };

    useEffect(() => {
        let active = true;
        Promise.all(featuredDishes.map(async dish => {
            try {
                const { data } = await API.menuAPI.getByNumber(dish.number);
                const items = data.filter(item => item.available !== false);
                const prices = items.map(item => Number(item.price)).filter(price => Number.isFinite(price) && price >= 0);
                return {
                    ...dish,
                    name: data[0]?.name || dish.name,
                    price: prices.length ? Math.min(...prices).toFixed(2) : undefined,
                    fromPrice: new Set(prices).size > 1
                };
            } catch {
                return dish;
            }
        })).then(result => { if (active) setDishes(result); });
        return () => { active = false; };
    }, []);

    return (
        <section className="popular-section">
            <h2 className="trade-winds-regular">Most Popular Dishes</h2>
            <p className="teko">Signature Favorites from Ming House</p>
            {error && <p role="alert">{error}</p>}
            {opening && <p role="status">Loading dish options…</p>}
            <div className="popular-grid">
                {dishes.map(dish => <PopularCard key={dish.number} {...dish} disabled={opening} onOpen={() => openDish(dish)} />)}
            </div>
            {selected && <MenuPopup
                show
                onClose={() => setSelected(null)}
                id={selected[0].id}
                name={selected[0].name}
                item={selected}
                quantity={1}
                do="Add"
                update={() => {}}
            />}
        </section>
    );
}
