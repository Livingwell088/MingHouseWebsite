import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import API from "../api";
import "../styles/Inputs.css";

const TimePickerDropdown = (props) => {
    const [selectedTime, setSelectedTime] = useState(props.orderTime || "Time");
    const [hours, setHours] = useState([]);

    useEffect(() => {
        setHours(API.timeAPI.get());
    }, []);

    useEffect(() => {
        setSelectedTime(props.orderTime || "Time");
    }, [props.orderTime]);

    const handleSelectedTimeChange = (event) => {
        const value = event.target.value;
        setSelectedTime(value);
        props.handleChangeTime(value);
    };

    return (
        <Form.Select
            className="scheduleTimeSelect"
            value={selectedTime}
            onChange={handleSelectedTimeChange}
        >
            <option value="Time" disabled>
                Select a time
            </option>

            {hours.map((current) => (
                <option key={current} value={current}>
                    {current}
                </option>
            ))}
        </Form.Select>
    );
};

export default TimePickerDropdown;