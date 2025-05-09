import React, { useState } from 'react';
import { Button } from 'antd'; // Assuming you're using Ant Design Button

// Dictionary with number (as string) keys mapping to abbreviations (values)
// 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const daysMapping = {
    '0': 'S', // Sunday
    '1': 'M',  // Monday
    '2': 'T', // Tuesday
    '3': 'W',  // Wednesday
    '4': 'T', // Thursday
    '5': 'F',  // Friday
    '6': 'S'  // Saturday
};

// State stores the numerical indices (0-6) of selected days
// Initialize as an empty array.
export const WeekCheckBoxesFormPart = ({selectedDays, setSelectedDays}) => {
    

    // Function to toggle a day by its numerical index
    // It takes the 'dayIndex' (0-6) as input
    const toggleDay = (dayIndex) => {
        // Check if the day's numerical index is already in the selectedDays array
        if (selectedDays.includes(dayIndex)) {
            // If it is, remove it (unselect) using filter
            setSelectedDays(selectedDays.filter(d => d !== dayIndex));
        } else {
            // If it's not, add it (select)
            setSelectedDays([...selectedDays, dayIndex]);
        }
    };

    return (
        <div>
            {/*
              Iterate over the entries of the daysMapping dictionary.
              Object.entries() gives you [key, value] pairs.
              Here, key is the number-as-string ('0', '1', etc.) and value is the abbreviation ('Su', 'M', etc.)
            */}
            {Object.entries(daysMapping).map(([dayKeyStr, dayAbbr]) => {
                // Parse the string key ('0', '1', etc.) back to a number (0, 1, etc.)
                // This numerical index is what we compare against and store in state.
                const dayIndex = parseInt(dayKeyStr, 10);

                return (
                    <Button
                        // Use the original string key from the dictionary as the unique and stable React key
                        key={dayKeyStr}
                        // When clicked, call toggleDay and pass the numerical index of the day
                        onClick={() => toggleDay(dayIndex)}
                        style={{
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            marginRight: '5px',
                            // Check if the numerical index is present in the selectedDays array for styling
                            backgroundColor: selectedDays.includes(dayIndex) ? '#1677ff' : 'transparent', // Ant Design's blue color
                            color: selectedDays.includes(dayIndex) ? 'white' : 'rgba(0, 0, 0, 0.88)', // Text color
                            border: '1px solid rgba(0, 0, 0, 0.23)', // Border color
                            padding: 0, // Remove default padding to help center text in round button
                            cursor: 'pointer' // Ensure cursor indicates interactivity
                        }}
                    >
                        {/* Display the abbreviation (the value from the dictionary entry) on the button */}
                        {dayAbbr}
                    </Button>
                );
            })}
        </div>
    );
};

// Remember: The 'selectedDays' state (an array of numbers 0-6) should be passed up
// to your parent form component, likely via a prop (e.g., onDaysChange={(days) => ...}),
// to be included in your event's REPEATSETTINGS.weeklyDays array.
