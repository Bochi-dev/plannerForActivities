import React from 'react';
import { Typography, Flex} from 'antd';
import { StarFilled } from '@ant-design/icons';

const { Text } = Typography;

export const PlannerEventBox = ({ event, showModal }) => {
    const { ID, TITLE, ratingForDay } = event;

    const handleClick = () => {
        showModal(2, { id: ID });
    };

    return (<Flex>
        <div
            style={{
                backgroundColor: '#1890ff',
                color: 'white',
                borderRadius: '3px',         // Slightly smaller border-radius
                padding: '3px 6px',          // REDUCED: Padding inside the box (from 6px 10px)
                margin: '2px 0',             // REDUCED: Vertical spacing between boxes (from 4px 0)
                position: 'relative',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                minHeight: '22px',           // REDUCED: Minimum height of the box (from 30px)
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
            onClick={handleClick}
        >
            {/* Event Title */}
            <Text
                strong
                style={{
                    color: 'white',
                    fontSize: '0.85em',          // NEW/REDUCED: Smaller font size for the title
                    paddingRight: ratingForDay ? '35px' : '0px', // Adjusted padding for star
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flexShrink: 1,
                    minWidth: 0,
                }}
            >
                {TITLE}
            </Text>

            {/* Star and Rating */}
            {ratingForDay && (
                <div
                    style={{
                        position: 'absolute',
                        top: '2px',              // REDUCED: Distance from top (from 4px)
                        right: '4px',            // REDUCED: Distance from right (from 8px)
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '2px',     // Slightly smaller border-radius for the bubble
                        padding: '1px 3px',      // REDUCED: Padding inside the rating bubble (from 2px 5px)
                        gap: '2px',              // REDUCED: Space between rating number and star (from 4px)
                    }}
                >
                    <Text style={{ color: 'gold', fontSize: '0.7em', lineHeight: '1em' }}> // REDUCED: Smaller font size for rating number
                        {ratingForDay.RATING}
                    </Text>
                    <StarFilled style={{ color: 'gold', fontSize: '0.7em' }} /> // REDUCED: Smaller icon size
                </div>
            )}
        </div>
        <div
            style={{
                backgroundColor: '#1890ff',
                color: 'white',
                borderRadius: '3px',         // Slightly smaller border-radius
                padding: '3px 6px',          // REDUCED: Padding inside the box (from 6px 10px)
                margin: '2px 0',             // REDUCED: Vertical spacing between boxes (from 4px 0)
                position: 'relative',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                minHeight: '22px',           // REDUCED: Minimum height of the box (from 30px)
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
            onClick={handleClick}
        >
                            <StarFilled style={{ color: 'gold', fontSize: '1em' }} />
        </div>
    </Flex>);
};
