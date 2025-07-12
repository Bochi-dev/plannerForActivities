import React, { useState, useEffect, createContext, useContext } from 'react';

// Context for App-wide state (no Firebase/User context needed now)
const AppContext = createContext(null);

// Utility function for consistent date formatting
const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp); // Ensure it's a Date object
    return date.toLocaleString();
};

// Main App Component
export const Papafritapage = () => {
    // Initial data for goals (truncated for slim version)
    const initialGoalsData = [
        {
            id: 'course1',
            title: 'Getting Started with Front-End and Web Development',
            whatYoullLearn: 'Define front-end development, roles, web development steps, UI/UX design, collaboration, industry trends, browsers, cloud benefits, and WordPress.',
            skillsGained: ['Responsive Web Design', 'Front-End Web Development', 'Web Development', 'UI/UX Design', 'Content Management Systems', 'WordPress'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course2',
            title: 'Introduction to Software Engineering',
            whatYoullLearn: 'Explain software engineering principles, SDLC, tools, programming constructs (Python), software architecture, and career paths.',
            skillsGained: ['Software Engineering', 'SDLC', 'Python Programming', 'Agile Methodology', 'Software Design'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course3',
            title: 'Designing User Interfaces and Experiences (UI/UX)',
            whatYoullLearn: 'Explain UI/UX concepts, visual development best practices, Figma usage, and web development frameworks like Bootstrap.',
            skillsGained: ['Figma', 'Prototyping', 'Wireframing', 'UI/UX Design', 'Web Design', 'Bootstrap'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course4',
            title: 'Introduction to HTML, CSS, & JavaScript',
            whatYoullLearn: 'Describe Web Application Development Ecosystem, developer tools, create basic web pages with HTML/CSS, and dynamic pages with JavaScript.',
            skillsGained: ['Javascript', 'CSS', 'HTML', 'Responsive Web Design', 'Web Development'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course5',
            title: 'Developing Websites and Front-Ends with Bootstrap',
            whatYoullLearn: 'Summarize Bootstrap features and benefits, and demonstrate proficiency in building flexible and responsive websites using Bootstrap.',
            skillsGained: ['Bootstrap', 'Responsive Web Design', 'Front-End Web Development', 'UI Components'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course6',
            title: 'Getting Started with Git and GitHub',
            whatYoullLearn: 'Describe version control, Git concepts (repositories, branches), create GitHub repos, perform PRs, and build a portfolio.',
            skillsGained: ['Git', 'GitHub', 'Version Control', 'DevOps', 'Command-Line Interface', 'Open Source Technology'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course7',
            title: 'Developing Front-End Apps with React',
            whatYoullLearn: 'Develop interactive UIs with React, JSX, ES6. Build dynamic apps with reusable React components, and employ concepts like props, states, hooks, forms, and Redux.',
            skillsGained: ['React.js', 'React Redux', 'Front-End Web Development', 'Javascript Frameworks', 'UI Components'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course8',
            title: 'Intermediate Web and Front-End Development',
            whatYoullLearn: 'Define CMS and SEO, identify Webpack 5 advantages, describe Mocha and Jasmine testing frameworks, and explain debugging processes.',
            skillsGained: ['Debugging', 'Webpack', 'Web Development Tools', 'SEO', 'Performance Testing', 'Test Automation'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course9',
            title: 'Get Started with Cloud Native, DevOps, Agile, and NoSQL',
            whatYoullLearn: 'Explore cloud native concepts, DevOps culture, TDD/BDD, MongoDB principles, implement CI/CD, and integrate user stories with Zenhub.',
            skillsGained: ['MongoDB', 'NoSQL', 'CI/CD', 'Cloud-Native Computing', 'Agile Methodology', 'DevOps'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course10',
            title: 'Front-End Development Capstone Project',
            whatYoullLearn: 'Apply UI/UX design (Figma), HTML/CSS, React, and GitHub skills to build, deploy, and update a fully functional responsive website.',
            skillsGained: ['Figma', 'Application Deployment', 'GitHub', 'Web Design', 'HTML and CSS', 'React.js'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        },
        {
            id: 'course11',
            title: 'Software Developer Career Guide and Interview Preparation',
            whatYoullLearn: 'Describe software developer roles, career paths, job search prep, networking strategies, and interview process readiness.',
            skillsGained: ['Communication', 'Interviewing Skills', 'Professional Development', 'Problem Solving', 'Algorithms', 'Code Review'],
            status: 'pending',
            tasks: [], habits: [], logEntries: [], resources: []
        }
    ];

    // Planner state, initialized with local data
    const [goals, setGoals] = useState(() => {
        // Load from localStorage if available, otherwise use initial data
        try {
            const savedGoals = localStorage.getItem('ibmFrontendPlannerGoals');
            return savedGoals ? JSON.parse(savedGoals) : initialGoalsData;
        } catch (error) {
            console.error("Failed to load goals from localStorage, using default data.", error);
            return initialGoalsData;
        }
    });
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ type: '', data: null, goalId: null, itemId: null });

    // Save goals to localStorage whenever they change and update selectedGoal reference
    useEffect(() => {
        try {
            localStorage.setItem('ibmFrontendPlannerGoals', JSON.stringify(goals));
        } catch (error) {
            console.error("Failed to save goals to localStorage.", error);
        }

        // IMPORTANT: Update selectedGoal reference if it exists
        if (selectedGoal) {
            const updatedSelectedGoal = goals.find(g => g.id === selectedGoal.id);
            // Only update if the object reference has actually changed
            if (updatedSelectedGoal && updatedSelectedGoal !== selectedGoal) {
                setSelectedGoal(updatedSelectedGoal);
            }
        }
    }, [goals, selectedGoal]); // Add selectedGoal to dependencies to re-run when it changes too

    // Handlers for CRUD operations (now updating local state)
    const handleAddGoalItem = (goalId, itemType, newItem) => {
        setGoals(prevGoals => prevGoals.map(goal =>
            goal.id === goalId
                ? { ...goal, [itemType]: [...goal[itemType], { id: crypto.randomUUID(), ...newItem }] }
                : goal
        ));
    };

    const handleUpdateGoalItem = (goalId, itemType, itemId, updatedFields) => {
        setGoals(prevGoals => prevGoals.map(goal =>
            goal.id === goalId
                ? {
                    ...goal,
                    [itemType]: goal[itemType].map(item =>
                        item.id === itemId ? { ...item, ...updatedFields } : item
                    )
                }
                : goal
        ));
    };

    const handleDeleteGoalItem = (goalId, itemType, itemId) => {
        setGoals(prevGoals => prevGoals.map(goal =>
            goal.id === goalId
                ? {
                    ...goal,
                    [itemType]: goal[itemType].filter(item => item.id !== itemId)
                }
                : goal
        ));
    };

    const handleUpdateGoalStatus = (goalId, newStatus) => {
        setGoals(prevGoals => prevGoals.map(goal =>
            goal.id === goalId
                ? { ...goal, status: newStatus }
                : goal
        ));
    };

    const openModal = (type, data = null, goalId = null, itemId = null) => {
        setModalContent({ type, data, goalId, itemId });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalContent({ type: '', data: null, goalId: null, itemId: null });
    };

    return (
        <AppContext.Provider value={{ handleAddGoalItem, handleUpdateGoalItem, handleDeleteGoalItem, handleUpdateGoalStatus, openModal, closeModal }}>
            <div className="min-h-screen bg-[#f0f4f8] text-[#073B4C] font-inter">
                <header className="bg-[#118AB2] text-white p-4 shadow-md flex justify-between items-center">
                    <h1 className="text-2xl font-bold">IBM Front-End Dev Planner</h1>
                </header>

                <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Goals List */}
                    <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Your Goals (Modules)</h2>
                        <ul className="space-y-3">
                            {goals.map(goal => (
                                <li
                                    key={goal.id}
                                    className={`p-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out
                                        ${selectedGoal && selectedGoal.id === goal.id ? 'bg-[#FFD166] shadow-inner' : 'bg-gray-50 hover:bg-gray-100'}
                                        border-l-4 ${goal.status === 'done' ? 'border-green-500' : goal.status === 'in progress' ? 'border-blue-500' : 'border-gray-300'}`
                                    }
                                    onClick={() => setSelectedGoal(goal)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-lg">{goal.title}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full
                                            ${goal.status === 'done' ? 'bg-green-100 text-green-700' :
                                              goal.status === 'in progress' ? 'bg-blue-100 text-blue-700' :
                                              'bg-gray-100 text-gray-700'}`
                                        }>
                                            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        <select
                                            className="mt-2 p-1 border rounded-md text-sm bg-white"
                                            value={goal.status}
                                            onChange={(e) => handleUpdateGoalStatus(goal.id, e.target.value)}
                                            onClick={(e) => e.stopPropagation()} // Prevent selecting goal when changing status
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Goal Details & CRUD Sections */}
                    <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
                        {selectedGoal ? (
                            <>
                                <h2 className="text-2xl font-bold mb-4 border-b pb-2">{selectedGoal.title}</h2>
                                <p className="text-gray-700 mb-4">{selectedGoal.whatYoullLearn}</p>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg mb-2">Skills Gained:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedGoal.skillsGained.map((skill, index) => (
                                            <span key={index} className="bg-[#06D6A0] text-white text-xs px-3 py-1 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <GoalSection title="Tasks" type="tasks" goal={selectedGoal} />
                                <GoalSection title="Habits" type="habits" goal={selectedGoal} />
                                <GoalSection title="Log Entries" type="logEntries" goal={selectedGoal} />
                                <GoalSection title="Resources" type="resources" goal={selectedGoal} />
                            </>
                        ) : (
                            <div className="text-center text-gray-500 py-10">
                                Select a module from the left to view its details.
                            </div>
                        )}
                    </div>
                </div>

                {showModal && <Modal content={modalContent} closeModal={closeModal} />}
            </div>
        </AppContext.Provider>
    );
};

// Component for rendering each section (Tasks, Habits, etc.)
const GoalSection = ({ title, type, goal }) => {
    const { openModal, handleDeleteGoalItem, handleUpdateGoalItem } = useContext(AppContext);

    const renderItem = (item) => {
        switch (type) {
            case 'tasks':
                return (
                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={item.completed || false}
                                onChange={() => handleUpdateGoalItem(goal.id, type, item.id, { completed: !item.completed })}
                                className="form-checkbox h-4 w-4 text-[#118AB2] rounded focus:ring-[#118AB2]"
                            />
                            <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{item.description}</span>
                        </label>
                    </div>
                );
            case 'habits':
                return (
                    <div className="flex flex-col"> {/* Changed to flex-col */}
                        <span>{item.name}</span>
                        <span className="text-sm text-gray-500">Frequency: {item.frequency}</span> {/* Moved below */}
                    </div>
                );
            case 'logEntries':
                return (
                    <div>
                        <p className="text-gray-800">{item.text}</p>
                        <p className="text-xs text-gray-500 mt-1">Logged: {formatDate(item.timestamp)}</p>
                    </div>
                );
            case 'resources':
                return (
                    <div>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#118AB2] hover:underline font-medium">
                            {item.name}
                        </a>
                        {item.comment && <p className="text-sm text-gray-600">{item.comment}</p>}
                        {item.url && <p className="text-xs text-gray-500 mt-1">URL: {item.url}</p>} {/* Display URL if present */}
                    </div>
                );
            default:
                return null;
        }
    };

    // Sort log entries by timestamp in descending order (newest first)
    const sortedItems = type === 'logEntries'
        ? [...goal[type]].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        : goal[type];

    return (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-xl">{title}</h3>
                <button
                    onClick={() => openModal(`add-${type}`, null, goal.id)}
                    className="bg-[#06D6A0] text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90 transition-colors"
                >
                    Add {title.slice(0, -1)}
                </button>
            </div>
            {sortedItems && sortedItems.length > 0 ? (
                <ul className="space-y-3">
                    {sortedItems.map(item => (
                        <li key={item.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-200 flex justify-between items-start">
                            {renderItem(item)}
                            <div className="flex space-x-2 ml-4">
                                <button
                                    onClick={() => openModal(`edit-${type}`, item, goal.id, item.id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteGoalItem(goal.id, type, item.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-sm">No {title.toLowerCase()} added yet.</p>
            )}
        </div>
    );
};

// Modal Component for CRUD forms
const Modal = ({ content, closeModal }) => {
    const { handleAddGoalItem, handleUpdateGoalItem } = useContext(AppContext);
    const [formData, setFormData] = useState(content.data || {});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const itemType = content.type.split('-')[1];
        if (content.type.startsWith('add')) {
            const newItem = { ...formData };
            if (itemType === 'logEntries') {
                newItem.timestamp = new Date().toISOString(); // Store as ISO string for local persistence
            }
            handleAddGoalItem(content.goalId, itemType, newItem);
        } else if (content.type.startsWith('edit')) {
            handleUpdateGoalItem(content.goalId, itemType, content.itemId, formData);
        }
        closeModal();
    };

    const renderForm = () => {
        const itemType = content.type.split('-')[1];
        switch (itemType) {
            case 'tasks':
                return (
                    <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#118AB2] focus:border-[#118AB2]"
                            required
                        />
                        <label className="flex items-center mt-3">
                            <input
                                type="checkbox"
                                name="completed"
                                checked={formData.completed || false}
                                onChange={handleChange}
                                className="form-checkbox h-4 w-4 text-[#118AB2] rounded focus:ring-[#118AB2]"
                            />
                            <span className="ml-2 text-sm text-gray-700">Completed</span>
                        </label>
                    </>
                );
            case 'habits':
                return (
                    <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#118AB2] focus:border-[#118AB2]"
                            required
                        />
                        <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">Frequency</label>
                        <input
                            type="text"
                            name="frequency"
                            value={formData.frequency || ''}
                            onChange={handleChange}
                            placeholder="e.g., Daily, Weekly"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#118AB2] focus:border-[#118AB2]"
                        />
                    </>
                );
            case 'logEntries':
                return (
                    <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reflection</label>
                        <textarea
                            name="text"
                            value={formData.text || ''}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#118AB2] focus:border-[#118AB2]"
                            required
                        ></textarea>
                    </>
                );
            case 'resources':
                return (
                    <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#118AB2] focus:border-[#118AB2]"
                            required
                        />
                        <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">URL (Optional)</label> {/* Label updated */}
                        <input
                            type="url"
                            name="url"
                            value={formData.url || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#118AB2] focus:border-[#118AB2]"
                            // 'required' attribute removed here
                        />
                        <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">Comments</label>
                        <textarea
                            name="comment"
                            value={formData.comment || ''}
                            onChange={handleChange}
                            rows="2"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#118AB2] focus:border-[#118AB2]"
                        ></textarea>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold capitalize">{content.type.replace('-', ' ')} {content.type.split('-')[1].slice(0, -1)}</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {renderForm()}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#118AB2] text-white rounded-md hover:bg-[#0e7a9e] transition-colors"
                        >
                            {content.type.startsWith('add') ? 'Add' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

