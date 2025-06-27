import React from 'react';
import { Tag } from 'antd'; // Import Ant Design Tag component
import { TagOutlined } from '@ant-design/icons'; // Optional: for a small icon inside the tag

/**
 * A reusable, clickable tag component.
 * It wraps Ant Design's Tag and applies custom styling and click functionality.
 *
 * @param {Object} props - The component props.
 * @param {string} props.tagText - The text content of the tag.
 * @param {function} props.onClick - The function to call when the tag is clicked.
 * @param {string} [props.color='blue'] - The Ant Design color property for the tag (e.g., 'blue', 'green', 'volcano').
 * @param {string} [props.className=''] - Additional Tailwind CSS classes for custom styling.
 */
export const ClickableTag = ({ tagText, onClick, color = 'blue', className = '' }) => {
  return (
    <Tag
      // Apply Ant Design color prop and combined Tailwind classes
      color={color}
      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ease-in-out
                  hover:scale-105 hover:shadow-md active:scale-95
                  flex items-center justify-center ${className}`} // Add flex for icon alignment
      onClick={() => onClick(tagText)} // Pass the tagText back to the onClick handler
      style={{
        // Optional: Custom style for a slightly softer blue, if Antd's default 'blue' is too strong
        backgroundColor: color === 'blue' ? '#e6f7ff' : undefined, // Very light blue if 'blue'
        color: color === 'blue' ? '#1890ff' : undefined, // Darker blue text for contrast
        borderColor: color === 'blue' ? '#91d5ff' : undefined, // Matching border
      }}
    >
      {/* Optional: Include a small tag icon */}
      <TagOutlined className="mr-1" />
      {tagText}
    </Tag>
  );
};

export default ClickableTag;

