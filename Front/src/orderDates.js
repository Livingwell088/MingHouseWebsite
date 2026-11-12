export function restaurantDateKey(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(now);
    const value = type => parts.find(part => part.type === type).value;
    return `${value('year')}-${value('month')}-${value('day')}`;
}

export function orderDateKey(value) {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const legacy = /^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}) (\d{4})$/.exec(value);
    if (!legacy) return '';
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(legacy[1]) + 1;
    return `${legacy[3]}-${String(month).padStart(2, '0')}-${legacy[2].padStart(2, '0')}`;
}
