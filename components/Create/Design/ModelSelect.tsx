'use client';

import { useState } from "react";

export default function ModelSelector({ modelList, selectedModel, setSelectedModel }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSelect = (item) => {
        setSelectedModel(item);
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="bg-blue-500 p-2 rounded">
            <button
                className="bg-gray-700 px-2 py-1 rounded w-full"
                onClick={toggleDropdown}
            >
                {selectedModel ? selectedModel.show_name : "Select a model"}
            </button>
            {dropdownOpen && (
                <div className="bg-blue-300 mt-2 p-2 rounded">
                    {modelList.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <button
                                className="bg-gray-700 px-2 py-1 rounded w-full"
                                onClick={() => handleSelect(item)}
                            >
                                <p>{item.show_name}</p>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {selectedModel && (
                <div className="mt-2 bg-gray-700 p-4 rounded">
                    <h3 className="text-lg mb-2">Model Details</h3>
                    <p>Name: {selectedModel.show_name}</p>
                </div>
            )}
        </div>
    );
}
