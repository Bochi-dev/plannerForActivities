/*import { Button } from "antd"
import { StarFilled, StarOutlined } from "@ant-design/icons"

export const PlannerTableSlots = ({source, operations, date, star, showModal}) => {
    const start = source.originalStartDate 
    const end = source.originalEndDate

    return (<div>
        < Button onClick={() => { showModal(1) }} icon={(star === null) ? <StarOutlined/> : <StarFilled />} />
    </div>)
}*/

import { Button } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import dayjs from 'dayjs'; // Using dayjs for easy date/time formatting

/**
 * Represents a time slot in the planner table, displaying an event's time range and star status.
 * Assumes this component is used to display *an existing event* within a time slot.
 * If the slot is empty, you would likely render a different component or pass null/undefined for 'source'.
 *
 * @param {object} props - The component props.
 * @param {object} props.source - The event object to display. Should contain originalStartDate (as Date object), originalEndDate (as Date object), and STARS.
 * @param {any} props.operations - Operations prop (purpose unclear from snippet, passed through).
 * @param {Date} props.date - The date of the slot (unused in this rendering logic, but kept in signature).
 * @param {any} props.star - The star status (unused in this rendering logic, using source.STARS instead for consistency).
 * @param {function} props.showModal - Function to show a modal, potentially for viewing/editing the event.
 */
export const PlannerTableSlots = ({ source, operations, date, star, showModal }) => {

    // If no event source is provided, render nothing or a placeholder for an empty slot
    if (!source) {
        // You might return a button to add an event here, or just null/a simple div
        // Example: return <Button onClick={() => showModal(1)}>+ Add Event</Button>;
        return null; // Or return a minimal empty slot representation
    }

    // Access the original start and end dates from the source object
    const startDate = source.originalStartDate;
    const endDate = source.originalEndDate;

    // Check if start and end dates are valid Date objects before trying to format
    const isValidStart = startDate instanceof Date && !isNaN(startDate.getTime());
    const isValidEnd = endDate instanceof Date && !isNaN(endDate.getTime());

    // Format the start and end times (e.g., "10:30") if the dates are valid
    // If dates are invalid, display placeholder text
    const formattedStartTime = isValidStart ? dayjs(startDate).format('HH:mm') : 'Invalid Start Time';
    const formattedEndTime = isValidEnd ? dayjs(endDate).format('HH:mm') : 'Invalid End Time';

    // Determine the star icon based on the event's star status from the source object
    // Assuming STARS property exists on the source event object
    const StarIcon = (source.STARS === null || source.STARS === 0) ? <StarOutlined /> : <StarFilled />;

    // Click handler for the slot/button
    const handleSlotClick = () => {
        // The original code called showModal(1). You might want to pass the event ID or object instead
        // to allow the modal to display details of the clicked event.
        showModal(1); // Example: showModal({ type: 'view', event: source });
    };

    return (
        // Use an Ant Design Button to make the entire slot content clickable.
        // Style it to look less like a standard button and more like a table slot item.
        <Button
            onClick={handleSlotClick}
            // Use 'text' type for minimal styling, or 'default' if you want a border
            type="text"
            // Apply styles to make it fill its container and arrange content
            style={{
                display: 'flex', // Use flexbox to align time range and star horizontally
                alignItems: 'center', // Vertically center items
                gap: '8px', // Add space between time range and star
                width: '100%', // Make the button fill the width of its parent table cell
                justifyContent: 'space-between', // Push time range to left, star to right
                padding: '4px 8px', // Add some internal padding
                height: 'auto', // Allow height to adjust based on content
                minHeight: '30px', // Ensure a minimum height for empty slots or small content
                cursor: 'pointer', // Indicate that the element is clickable
                 // Add border or background if needed to visually define the slot area
                // border: '1px solid #eee',
                // backgroundColor: '#f9f9f9',
            }}
        >
            {/* Display the formatted time range */}
            <span style={{ flexGrow: 1, textAlign: 'left' }}>
                <small>{formattedStartTime} - {formattedEndTime}</small>
            </span> {/* Allow time range span to take available space */}

            {/* Display the star icon, centered vertically */}
            <span style={{ display: 'flex', alignItems: 'center' }}>{StarIcon}</span>
        </Button>
    );
};

