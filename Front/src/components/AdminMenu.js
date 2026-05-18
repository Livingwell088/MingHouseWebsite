import "../styles/Admin.css";
import API from "../api";
import { useEffect, useState } from "react";
import React from 'react';


export default function AdminMenu() {

    const [menu, setMenu] = React.useState([]);


    const loadMenu = async () => {

        try {
            const res = await API.menuAPI.get();

            setMenu(res.data);
        }
        catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        loadMenu();
    }, [])


    return (
        <div>
            <div className="adminPageHeader">
                <h1>Menu Management</h1>
                <button>Add Item</button>
            </div>

            <div className="adminTableCard">
                <table className="adminTable">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Spicy</th>
                        {/*<th>Actions</th>*/}
                    </tr>
                    </thead>

                    <tbody>
                    {menu.map((item) => (
                        <tr key={item.id}>
                            <td>{item.number}</td>
                            <td>{item.name}</td>
                            <td>{item.size}</td>
                            <td>{item.category}</td>
                            <td>{item.price}</td>
                            <td>{item.spicy}</td>

                        </tr>

                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

