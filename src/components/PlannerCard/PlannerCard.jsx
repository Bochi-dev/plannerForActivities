// Inside PlannerCard component
import React, { useMemo } from 'react';
// ... other imports
import { structureEventsForCardView } from '../../tools'; // Adjust path
import { Card, Typography, List } from "antd"
import { PlannerEventBox } from "../."

export const PlannerCard = ({ operations, weekDates, showModal }) => {
    const [events] = operations.eventsOperations;
    const [ratingsOfEvents] = operations.ratingsOperations;

    // Use useMemo to structure the data efficiently
    const structuredEvents = useMemo(() => {
        return structureEventsForCardView(events, weekDates, ratingsOfEvents);
    }, [events, weekDates, ratingsOfEvents]); // Recalculate if events, weekDates, or ratings change


    // Now, render your cards based on the structuredEvents object

    return (
        <div style={{ display: 'flex', overflowX: 'auto' }}>
             {/* Map over the days from weekDates (or keys of structuredEvents) */}
            {Object.keys(weekDates).map(dayName => {
                // Get the data for this specific day
                const dayData = structuredEvents[dayName];
                if (!dayData) return null; // Should not happen if initialization is correct, but good safeguard

                const dayDate = weekDates[dayName]; // Get the actual Date object for the day

                // Get the hour slots data for this day
                const hourSlots = Object.keys(dayData).filter(key => key !== 'allday').map(hourNum => ({
                     hour: parseInt(hourNum, 10),
                     label: `${hourNum}:00`, // Or format nicely
                     events: dayData[hourNum]
                })).sort((a, b) => a.hour - b.hour); // Sort hours numerically


                return (
                    <Card
                         key={dayName}
                         title={<Typography.Title level={4}>{dayName} {dayDate.getDate()}</Typography.Title>}
                         style={{ minWidth: 0, maxWidth: 200,margin: '10px' }}
                    >
                        {/* Render All Day events first (optional) */}
                        {dayData.allday.length > 0 && (
                            <div style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                                 <Typography.Text strong>All Day</Typography.Text>
                                 <div style={{ width: '100%' }}>
                                     {dayData.allday.map(event => (
                                         <PlannerEventBox
                                             key={event.ID}
                                             event={event} // Event object with ratingForDay attached
                                             operations={operations}
                                             showModal={showModal}
                                             dayDate={dayDate}
                                         />
                                     ))}
                                 </div>
                            </div>
                        )}

                        {/* Map over the sorted hour slots */}
                        <List
                            dataSource={hourSlots} // Data source is the array of hour slots
                            renderItem={slot => (
                                <List.Item key={slot.hour} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0' }}>
                                    <div style={{ width: '100%' }}>
                                        {/* Map over events within this hour slot */}
                                        {slot.events.map(event => (
                                            <PlannerEventBox
                                                key={event.ID} // Key for the event box
                                                event={event} // Event object with ratingForDay attached
                                                operations={operations}
                                                showModal={showModal}
                                                dayDate={dayDate}
                                            />
                                        ))}
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                );
            })}
        </div>
    );
};
