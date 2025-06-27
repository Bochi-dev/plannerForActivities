// In src/components/PlannerEventBox/PlannerEventBox.jsx

import React from 'react';
import { Typography } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons'; // <-- Import StarOutlined

const { Text } = Typography;

export const PlannerEventBox = ({ event, showModal, dayDate }) => { // <-- ADD dayDate to props
    const { ID, TITLE, ratingForDay } = event;

    // Handler for clicking the main event box (to show event details)
    const handleBoxClick = () => {
        showModal(2, { eventId: ID }); // Assuming 2 is the modal type for event details
    };

    console.log(ratingForDay)

    // Handler for clicking the rating area (to add/edit rating)
    const handleRatingClick = (e) => {
        e.stopPropagation(); // IMPORTANT: This stops the click event from bubbling up to the parent div (handleBoxClick)

        // Assuming 3 is the modal type for adding/editing a rating.
        // We pass the event ID, the specific date of the occurrence,
        // and the current rating if it exists, so the modal can pre-fill.
        
        showModal((ratingForDay === undefined) ? 1 : 3, {
            eventId: ID, 
            date:dayDate,
            ...(ratingForDay && {ratingId: ratingForDay.ID})    
        });
    };

    return (
        <div
            style={{
                backgroundColor: '#1890ff',
                color: 'white',
                borderRadius: '3px',
                padding: '3px 6px',
                margin: '2px 0',
                position: 'relative',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                minHeight: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // Keeps title left, rating right
            }}
            onClick={handleBoxClick} // This click opens event details
        >
            {/* Event Title */}
            <Text
                strong
                style={{
                    color: 'white',
                    fontSize: '0.85em',
                    // Always reserve space for the rating icon/bubble
                    paddingRight: '35px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flexShrink: 1,
                    minWidth: 0,
                }}
            >
                {TITLE}
            </Text>

            {/* Rating Display / Add Rating Icon */}
            <div
                style={{
                    position: 'absolute',
                    top: '2px',           // Position from the top of the event box
                    right: '4px',         // Position from the right of the event box
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slight background for visibility
                    borderRadius: '2px',
                    padding: '1px 3px',
                    cursor: 'pointer', // Indicates this specific part is clickable
                }}
                onClick={handleRatingClick} // This click specifically handles rating
            >
                {ratingForDay ? (
                    // If a rating exists, display the rating number and a filled star
                    <>
                        <Text style={{ color: 'gold', fontSize: '0.7em', lineHeight: '1em' }}>
                            {ratingForDay.RATING} {/* Display the rating number */}
                        </Text>
                        <StarFilled style={{ color: 'gold', fontSize: '0.7em', marginLeft: '2px' }} /> {/* Filled star icon */}
                    </>
                ) : (
                    // If no rating exists, display an outlined star (to indicate it's clickable to add)
                    <StarOutlined style={{ color: 'gold', fontSize: '0.7em' }} /> 
                )}
            </div>
        </div>
    );
};
