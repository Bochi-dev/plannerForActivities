import { useState } from 'react';
import { Badge, Modal, Button, Calendar } from 'antd';
import { PlannerForm, PlannerTable, TableSlotsForm, PlannerCard } from "../../components"
import { addToDate } from "../../tools"
const monthDictionary = {
  "0": "January",
  "1": "February",
  "2": "March",
  "3": "April",
  "4": "May",
  "5": "June",
  "6": "July",
  "7": "August",
  "8": "September",
  "9": "October",
  "10": "November",
  "11": "December"
};


export const Planner = ({operations}) => {
  const today = new Date()
  const month = today.getMonth()
  const day = today.getDay()
  const diff = today.getDate() - (day + 1) + (day === 0 ? -6 : 1)
  const sunday = new Date(today.setDate(diff))

  const saturday = new Date(sunday)
  saturday.setDate(sunday.getDate() + 6)
  
  
  const weekDates = {
    Sunday: sunday,
    Mon: addToDate(sunday, 1),
    Tue: addToDate(sunday, 2),
    Wed: addToDate(sunday, 3),
    Thu: addToDate(sunday, 4),
    Fri: addToDate(sunday, 5),
    // If 'saturday' is guaranteed to be exactly 6 days after 'sunday', you could
    // calculate it here: saturday: addToDate(sunday, 6), but using the potentially
    // pre-defined 'saturday' variable matches the original logic more closely.
    Sat: saturday
  };
  
  
  
  
  
  const [formPage, setFormPage] = useState(0)


  const [isModalOpen, setIsModalOpen] = useState(false); 
  const showModal = (num) => {
    setFormPage(num)
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  
  
  return (<>
    <Button type="primary" onClick={() => { showModal(0) }}>Add Event</Button>
    <h1>{monthDictionary[month]}</h1>
    <PlannerTable operations={operations} sunday={sunday} saturday={saturday} showModal={showModal} weekDates={weekDates}/>
    <PlannerCard operations={operations} sunday={sunday} saturday={saturday} showModal={showModal} />
    
    <Modal title="Add Event" open={isModalOpen} footer={[]} onCancel={handleCancel} onOk={handleOk}>
      {(formPage === 0 ) ? <PlannerForm operations={operations} handleOk={handleOk}/> : <></>}
      {(formPage === 1 ) ? <TableSlotsForm/> : <></>}
      
    </Modal>
  </>)
};
