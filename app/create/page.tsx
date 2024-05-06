'use client';

import React, {useEffect, useState} from "react";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/types/supabase";
import {useRouter} from "next/navigation";

export default function ShowCreate() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState(null);
    const [sessionList, setSessionList] = useState([]);
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            const {data, error} = await supabase
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

    const handleCreateSession = async () => {
        // Logic to create a new session goes here
        console.log("Creating a new session...");

        const b = await supabase.from("session").insert({}).select();

        if (b.error) {
            console.error("Error creating a new session:", b.error);
            return;
        }

        console.log("b", b.data[0].id);
        // Redirect to the new session
        router.push(`/create/${b.data[0].id}`);
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
                                    <button onClick={() => router.push(`/create/${session.id}`)}
                                            className="text-blue-500 bg px-10">
                                        {session.id}
                                    </button>
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
