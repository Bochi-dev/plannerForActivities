import React from 'react';
import { Typography } from 'antd'; // Used for consistent text styling from Ant Design
import { StarFilled } from '@ant-design/icons'; // Used for the star icon

const { Text } = Typography; // Destructure Text component from Typography

/**
 * Renders a single event as a "blue box" within the hourly planner view.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.event - The event object, expected to have ID, TITLE, and ratingForDay (attached by structureEventsForCardView).
 * @param {function} props.showModal - Function to open the event details modal.
 */
export const PlannerEventBox = ({ event, showModal }) => {
    // Destructure relevant properties from the event object
    // 'ratingForDay' is the specific rating object found for this event on this particular day.
    const { ID, TITLE, ratingForDay } = event;

    // Handler for when the event box is clicked
    const handleClick = () => {
        // Assuming your showModal function takes a modal type (e.g., 2 for event details)
        // and an object containing the event ID.
        showModal(2, { id: ID });
    };

    return (
        <div
            style={{
                backgroundColor: '#1890ff', // Ant Design's default blue color for the box
                color: 'white',             // Text color for contrast
                borderRadius: '4px',        // Slightly rounded corners for aesthetics
                padding: '6px 10px',        // Internal padding
                margin: '4px 0',            // Vertical spacing between multiple events in the same hour slot
                position: 'relative',       // Crucial for positioning the star/rating absolutely inside
                overflow: 'hidden',         // Hides any content that extends beyond the box boundaries
                textOverflow: 'ellipsis',   // Adds "..." if the title is too long for one line
                whiteSpace: 'nowrap',       // Ensures the title stays on a single line
                cursor: 'pointer',          // Indicates that the box is clickable
                minHeight: '30px',          // Ensures a minimum height for the box
                display: 'flex',            // Uses flexbox to help center the title
                alignItems: 'center',       // Vertically centers the text within the box
                justifyContent: 'space-between', // Spreads out content horizontally
            }}
            onClick={handleClick} // Attach the click handler
        >
            {/* Event Title */}
            <Text
                strong // Makes the text bold
                style={{
                    color: 'white',
                    // If a rating is present, add padding to the right to make space for it,
                    // otherwise, don't. This prevents title overlap with the star.
                    paddingRight: ratingForDay ? '40px' : '0px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flexShrink: 1, // Allows text to shrink if necessary
                    minWidth: 0, // Needed for text-overflow to work with flex
                }}
            >
                {TITLE}
            </Text>

            {/* Star and Rating (positioned in the top right) */}
            {ratingForDay && ( // Only render if ratingForDay exists
                <div
                    style={{
                        position: 'absolute',
                        top: '4px',           // Distance from the top of the event box
                        right: '8px',         // Distance from the right of the event box
                        display: 'flex',      // Use flexbox for horizontal alignment of star and number
                        alignItems: 'center', // Vertically centers star and number
                        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slight dark background for readability
                        borderRadius: '3px',  // Slightly rounded corners for the rating bubble
                        padding: '2px 5px',   // Padding inside the rating bubble
                        gap: '4px',           // Space between rating number and star
                    }}
                >
                    <Text style={{ color: 'gold', fontSize: '0.8em', lineHeight: '1em' }}>
                        {ratingForDay.RATING} {/* Display the rating number */}
                    </Text>
                    <StarFilled style={{ color: 'gold', fontSize: '0.8em' }} /> {/* Ant Design star icon */}
                </div>
            )}
        </div>
    );
};
