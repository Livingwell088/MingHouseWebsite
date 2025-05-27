import Form from "react-bootstrap/Form";
import {useEffect, useState} from "react";
import API from "../api";
import "../styles/Inputs.css"
import {click} from "@testing-library/user-event/dist/click";


const TimePickerDropdown = (props) => {
    const [selectedTime, setSelectedTime] = useState(props.orderTime || "")
    const [hours, setHours] = useState([])
    const [refresh, setRefresh] = useState(true)



    const handleSelectedTimeChange = (event) => {
        setSelectedTime(event.target.value)
        props.handleChangeTime(event.target.value)
    }

    useEffect(() => {
        const neededHours = API.timeAPI.get()
        setHours(neededHours)
        // console.log(hours)

    }, []);


    return <div >
        {/*style={{width: "80%"}}*/}
        <Form.Select id={"dropDown"} value={selectedTime} onChange={handleSelectedTimeChange}>
            <option>Select A Time</option>

            {hours.map(current => {
                return <option value={current}>{current}</option>
            })}
        </Form.Select>
    </div>




}


export default TimePickerDropdown;
