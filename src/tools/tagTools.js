// src/tools/tagTools.js
// This file contains utility functions for managing a centralized list of Tag objects.

const ALL_TAGS_STORAGE_KEY = 'my_app_all_tags'; // Local storage key for all tag objects

/**
 * Generates a simple unique ID for a tag object.
 * @returns {string} A unique ID string.
 */
const generateUniqueId = () => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

/**
 * Loads all tag objects from local storage.
 * @returns {Array<Object>} An array of tag objects, or an empty array if none found.
 */
export const loadAllTagsFromLocalStorage = () => {
    try {
        const tagsJsonString = localStorage.getItem(ALL_TAGS_STORAGE_KEY);
        if (tagsJsonString === null) {
            return [];
        }
        return JSON.parse(tagsJsonString);
    } catch (error) {
        console.error('Error loading all tags from local storage:', error);
        return [];
    }
};

/**
 * Saves a list of tag objects to local storage.
 * @param {Array<Object>} allTags - The array of tag objects to save.
 */
export const saveAllTagsToLocalStorage = (allTags) => {
    try {
        localStorage.setItem(ALL_TAGS_STORAGE_KEY, JSON.stringify(allTags));
        console.log('All tags successfully saved to local storage.');
    } catch (error) {
        console.error('Error saving all tags to local storage:', error);
    }
};

/**
 * Adds a new tag object to the central list.
 * Automatically adds new tag if name doesn't exist (case-insensitive).
 *
 * @param {Array<Object>} currentAllTags - The current array of all tag objects.
 * @param {string} tagName - The name of the tag to add.
 * @param {Object} [metadata={}] - Optional metadata for the tag (e.g., { color: '#FF0000' }).
 * @returns {Array<Object>} A new array of all tag objects with the added tag.
 */
export const addTagObjectLocally = (currentAllTags, tagName, metadata = {}) => {
    const lowerCaseTagName = tagName.toLowerCase().trim();
    if (lowerCaseTagName === '') return currentAllTags; // Don't add empty tags

    // Check if tag already exists (case-insensitive)
    const existingTag = currentAllTags.find(tag => tag.name.toLowerCase() === lowerCaseTagName);

    if (existingTag) {
        console.log(`Tag "${tagName}" already exists.`);
        return currentAllTags; // Return original array if tag already exists
    }

    const newTagObject = {
        id: generateUniqueId(),
        name: tagName.trim(), // Store original casing, but check uniqueness with lowercase
        createdAt: new Date().toISOString(),
        ...metadata,
    };

    return [...currentAllTags, newTagObject];
};

/**
 * Edits an existing tag object in the central list.
 *
 * @param {Array<Object>} currentAllTags - The current array of all tag objects.
 * @param {string} tagId - The ID of the tag object to edit.
 * @param {Object} updates - An object with properties to update (e.g., { name: 'New Name', color: '#00FF00' }).
 * @returns {Array<Object>} A new array of all tag objects with the updated tag.
 */
export const editTagObjectLocally = (currentAllTags, tagId, updates) => {
    return currentAllTags.map(tag =>
        tag.id === tagId ? { ...tag, ...updates, updatedAt: new Date().toISOString() } : tag
    );
};

/**
 * Deletes a tag object from the central list.
 *
 * @param {Array<Object>} currentAllTags - The current array of all tag objects.
 * @param {string} tagId - The ID of the tag object to delete.
 * @returns {Array<Object>} A new array of all tag objects with the specified tag removed.
 */
export const deleteTagObjectLocally = (currentAllTags, tagId) => {
    return currentAllTags.filter(tag => tag.id !== tagId);
};

/**
 * Ensures that all tag names in a task's tags array exist as objects in the central tags list.
 * If a tag name doesn't exist, it adds a new tag object to the central list.
 *
 * @param {Array<Object>} allTags - The current array of all tag objects.
 * @param {Array<string>} taskTagNames - An array of tag names from a task.
 * @param {function} setAllTags - The setter function for the allTags state.
 * @returns {Array<Object>} The (potentially updated) array of all tag objects.
 */
export const ensureTagsExistInCentralList = (allTags, taskTagNames, setAllTags) => {
    let updatedAllTags = [...allTags];
    let changed = false;

    if (taskTagNames && Array.isArray(taskTagNames)) {
        taskTagNames.forEach(tagName => {
            const lowerCaseTagName = tagName.toLowerCase().trim();
            if (lowerCaseTagName === '') return;

            // Check if tag name exists in central list (case-insensitive)
            const exists = updatedAllTags.some(tag => tag.name.toLowerCase() === lowerCaseTagName);

            if (!exists) {
                updatedAllTags = addTagObjectLocally(updatedAllTags, tagName);
                changed = true;
            }
        });
    }

    if (changed) {
        setAllTags(updatedAllTags); // Update state if any new tags were added
    }
    return updatedAllTags;
};


