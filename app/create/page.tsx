'use client';

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

export default function ShowCreate() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState(null);
    const [sessionList, setSessionList] = useState([]);
    const supabase = createClientComponentClient<Database>();

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("session")
                .select();

            if (data) {
                setSessionList(data);
                // Set the first model as the default
                setSelectedModel(data.length > 0 ? data[0] : null);
            }
            if (error) {
                console.error("Error fetching sessions:", error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [supabase]);

    const handleCreateSession = () => {
        // Logic to create a new session goes here
        console.log("Creating a new session...");
    };

    return (
        <div className="pt-20">
            <button onClick={handleCreateSession} className="bg-blue-500 text-white py-2 px-4 rounded">
                Create New Session
            </button>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {sessionList.length > 0 ? (
                        <ul className="mt-4">
                            {sessionList.map((session) => (
                                <li key={session.id} className="py-2 border-b border-gray-200">
                                    {session.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>No sessions found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
