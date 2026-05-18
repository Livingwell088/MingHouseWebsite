import "../styles/Admin.css";
import API from "../api";
import { useEffect, useState } from "react";
import React from 'react';


export default function AdminMenu() {

    const [menu, setMenu] = React.useState([]);


    const loadMenu = async () => {

        try {
            const res = await API.menuAPI.get();

            const sortedMenu = [... res.data].sort((a, b) => a.id - b.id);

            setMenu(sortedMenu);
        }
        catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        loadMenu();
    }, [])

    const [selectedItems, setSelectedItems] = useState([]);
    const [adjustType, setAdjustType] = useState("amount");
    const [adjustValue, setAdjustValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");


    const categories = ["All", ...new Set(menu.map((item) => item.category))];


    const toggleSelected = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((current) => current !== id)
                : [...prev, id]
        );
    };

    const getNewPrice = (oldPrice) => {
        const price = parseFloat(oldPrice);
        const value = parseFloat(adjustValue);

        if (Number.isNaN(price) || Number.isNaN(value)) {
            return null;
        }

        if (adjustType === "amount") return price + value;
        if (adjustType === "percent") return price * (1 + value / 100);
        if (adjustType === "set") return value;

        return price;
    };

    const applyBulkPriceChange = async () => {
        if (selectedItems.length === 0 || adjustValue === "") return;

        if (!window.confirm(`Update ${selectedItems.length} menu item prices?`)) {
            return;
        }

        const selectedMenuItems = menu.filter((item) =>
            selectedItems.includes(item.id)
        );

        try {
            await Promise.all(
                selectedMenuItems.map((item) => {
                    const newPrice = getNewPrice(item.price);

                    console.log("newPrice", newPrice);

                    if (newPrice === null) {
                        return Promise.resolve();
                    }

                    return API.menuAPI.edit({
                        ...item,
                        price: newPrice.toFixed(2),
                    });
                })
            );

            await loadMenu();
            setSelectedItems([]);
            setAdjustValue("");
        } catch (error) {
            console.log(error.message);
        }
    };

    const filteredMenu = menu.filter((item) => {
        const query = searchTerm.toLowerCase().trim();

        const matchesSearch =
            item.name?.toLowerCase().includes(query) ||
            String(item.number).toLowerCase().includes(query);

        const matchesCategory =
            categoryFilter === "All" || item.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });


    return (
        <div>
            <div className="adminPageHeader">
                <h1>Menu Management</h1>
                {/*<button>Add Item</button>*/}
            </div>


            <div className="bulkEditBar">
                <span>{selectedItems.length} selected</span>

                <select value={adjustType} onChange={(e) => setAdjustType(e.target.value)}>
                    <option value="amount">Increase by $</option>
                    <option value="percent">Increase by %</option>
                    <option value="set">Set price to</option>
                </select>

                <input
                    type="number"
                    step="0.01"
                    value={adjustValue}
                    onChange={(e) => setAdjustValue(e.target.value)}
                    placeholder="Amount"
                />

                <button
                    onClick={applyBulkPriceChange}
                    disabled={selectedItems.length === 0 || adjustValue === ""}
                >
                    Apply
                </button>
            </div>

            <div className="adminMenuFilters">
                <input
                    type="text"
                    placeholder="Search by number or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("All");
                    }}
                >
                    Clear
                </button>
            </div>

            <div className="adminTableCard">
                <table className="adminTable">
                    <thead>
                    <tr>
                        <th className="colCheck">
                            <input
                                type="checkbox"
                                checked={
                                    filteredMenu.length > 0 &&
                                    filteredMenu.every((item) => selectedItems.includes(item.id))
                                }
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedItems((prev) => [
                                            ...new Set([
                                                ...prev,
                                                ...filteredMenu.map((item) => item.id)
                                            ])
                                        ]);
                                    } else {
                                        setSelectedItems((prev) =>
                                            prev.filter(
                                                (id) =>
                                                    !filteredMenu.some((item) => item.id === id)
                                            )
                                        );
                                    }
                                }}
                            />
                        </th>
                        <th className="colNumber">#</th>
                        <th className="colName">Name</th>
                        <th className="colSize">Size</th>
                        <th className="colCategory">Category</th>
                        <th className="colPrice">Price</th>
                        {/*<th className="colNewPrice">New Price</th>*/}
                        <th className="colSpicy">Spicy</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredMenu.map((item) => {
                        const isSelected = selectedItems.includes(item.id);
                        const newPrice = getNewPrice(item.price);

                        const previewPrice =
                            isSelected && newPrice !== null
                                ? newPrice.toFixed(2)
                                : "";

                        return (
                            <tr key={item.id} className={isSelected ? "selectedRow" : ""}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSelected(item.id)}
                                    />
                                </td>

                                <td>{item.number}</td>
                                <td>{item.name}</td>
                                <td>{item.size}</td>
                                <td>{item.category}</td>
                                <td>${item.price}</td>
                                {/*<td>{previewPrice && `$${previewPrice}`}</td>*/}
                                <td>{item.spicy}</td>
                            </tr>
                        );
                    })}
                    </tbody>

                    {/*<tbody>*/}
                    {/*{menu.map((item) => {*/}
                    {/*        <tr key={item.id}>*/}
                    {/*            <td>{item.number}</td>*/}
                    {/*            <td>{item.name}</td>*/}
                    {/*            <td>{item.size}</td>*/}
                    {/*            <td>{item.category}</td>*/}
                    {/*            <td>{item.price}</td>*/}
                    {/*            <td>{item.spicy}</td>*/}

                    {/*        </tr>*/}
                    {/*    }*/}

                    {/*))}*/}
                    {/*</tbody>*/}
                </table>
            </div>

        </div>


    );
};

