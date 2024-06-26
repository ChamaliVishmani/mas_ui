"use client";
// import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
// import {cookies} from 'next/headers';
// import Link from 'next/link';
import {redirect} from "next/navigation";
import Image from "next/image";

// import SignOut from '@/components/SignOut';
// import Design from "@/components/Create/Design";
import TabComponent from "@/components/Create/TabComponent";
// import EditedImageShow from "@/components/Create/EditedImageShow";
import React, {useEffect, useRef, useState} from "react";
import FabricCanvas from "@/app/create/[id]/Edit";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {usePathname, useRouter} from 'next/navigation';

export default async function Create() {
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    // const [text, setText] = useState('');
    const textareaRef = useRef(null);

    const [model, setModel] = useState("");

    const [optimizedPrompt, setOptimizedPrompt] = useState("");

    const router = useRouter();
    const pathname = usePathname();

    console.log("pathname", pathname) // pathname /create/d1734b60-b2a4-4b4b-987f-2dc3749721ee
    const pathSegments = pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    console.log("ID:", id); // Log the extracted ID

    // Loading User Data
    useEffect(() => {
        // Define the async function inside useEffect
        const callSupabaseProxy = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/supabaseProxy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // Your request body here
                });
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                console.log(data);
                // Handle user data, set it to state, or perform redirect based on response

                setUser(data.user);

                if (!data.user) {
                    redirect("/sign-in");
                }
            } catch (error) {
                console.error("Failed to fetch:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Call the function
        callSupabaseProxy();
    }, []); // Empty dependency array means this effect runs once on mount

    // const {
    //     data: {user},
    // } = await supabase.auth.getUser();
    //
    // if (!user) {
    //     redirect('/sign-in');
    // }

    // const callSupabaseProxy = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await fetch('/api/supabaseProxy', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             // Send any required data as JSON in the body
    //             body: JSON.stringify({ /* Your data here */ }),
    //         });
    //         if (!response.ok) throw new Error('Network response was not ok');
    //         const data = await response.json();
    //         // Handle the data
    //         console.log(data);
    //     } catch (error) {
    //         console.error('Failed to fetch:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // // Use the function
    // const user = await callSupabaseProxy();
    //
    // if (!user) {
    //     redirect('/sign-in');
    // }

    const callTextToImageAPI = async () => {
        console.log("Calling API...");
        setLoading(true);
        setError("");

        {
            console.log(textareaRef);
        }
        const text = textareaRef.current.value;
        const encodedPrompt = encodeURIComponent(text);
        console.log(encodedPrompt);

        try {
            const response = await fetch("/api/text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    // Your request body here, if needed. This example assumes you handle the body in the API route.
                    prompt: encodedPrompt,
                    // prompt: "kitty",
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
                console.error("API error:", response);
            }

            const data = await response.json();
            setResult(data[0].url);
            console.log("API response:", data);
            console.log(data[0].url);
            // Upload the image URL to Cloudinary
            await handleUrlUpload(data[0].url);
        } catch (error) {
            setError("Failed to fetch: " + error.message);
            console.error("API error:", error);
        } finally {
            setLoading(false);
            console.log("API call complete.");
        }
    };


    // Function to handle uploading an image from a URL to Cloudinary
    const handleUrlUpload = async (url) => {
        try {
            // Fetch the image from the URL
            const response = await fetch(url);
            const blob = await response.blob();

            // Convert the Blob to a File
            const file = new File([blob], "image.jpg", {type: blob.type});

            // Upload the file to Cloudinary
            await handleUpload(file);
        } catch (error) {
            console.error('Error fetching the image from the URL', error);
        }
    };

    // Function to handle file upload to Cloudinary
    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'fr2fxnpz'); // Replace with your unsigned preset name

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/det0mvsek/image/upload`, {
                method: 'POST',
                body: formData
            });

            const url = await response.json();
            setResult(url.secure_url);

            const text = textareaRef.current.value;

            // upload to supabase
            try {
                const b = await supabase
                    .from('message')
                    .insert([{session: id, text: text}])
                    .select()

                if (error) throw error;

                console.log("Image URL inserted successfully", b);

                // upload to supabase
                try {
                    const {error} = await supabase
                        .from('images')
                        .insert([{message_id: b.data[0].message_id, url: url.secure_url}])

                    if (error) throw error;

                    console.log("Image URL inserted successfully");
                } catch (error) {
                    console.error("Error inserting image URL:", error);
                }

            } catch (error) {
                console.error("Error inserting image URL:", error);
            }


        } catch (error) {
            console.error('Error uploading the image', error);
        }
    };

    const handleOptimizedPromptCopy = () => {
        if (optimizedPrompt) {
            //   copy(optimizedPrompt);
            textareaRef.current.value = optimizedPrompt;
        }
    };

    const handleClearPrompts = () => {
        textareaRef.current.value = "";
        setOptimizedPrompt("");
    };

    const optimizePrompt = async () => {
        const new_user_input_prompt = textareaRef.current.value;
        const existing_prompt = optimizedPrompt;

        if (new_user_input_prompt) {
            const response = await fetch(
                "http://127.0.0.1:8000/optimize_text_prompt",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        existing_prompt: existing_prompt,
                        new_user_input_prompt: new_user_input_prompt,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Unable to optimize text.");
            }
            const responseJson = await response.json();

            const generated_text = responseJson.optimized_prompt[0].generated_text;

            setOptimizedPrompt(generated_text);
        }
    };

    return (
        <div>
            {/*<h2>User Profile</h2>*/}
            {/*<code className="highlight">{user.email}</code>*/}
            {/*<div className="heading">Last Signed In:</div>*/}
            {/*<code className="highlight">{new Date(user.last_sign_in_at).toUTCString()}</code>*/}
            {/*<Link className="button" href="/">*/}
            {/*    Go Home*/}
            {/*</Link>*/}
            {/*<SignOut/>*/}
            <div className="flex h-screen pt-16">
                {/* Left side container */}
                <div className="flex flex-col w-3/4 overflow-hidden">
                    {/* Frame 1 */}
                    <div className="flex overflow-auto p-4" style={{flex: "14"}}>
                        {/* Frame 1.1 - Button Section */}
                        <div className="w-1/8 bg-gray-200 p-2 space-y-2">
                            {/* List of buttons */}
                            <button className="w-full h-10 bg-blue-500 text-white">
                                Button 1
                            </button>
                            <button className="w-full h-10 bg-blue-500 text-white">
                                Button 2
                            </button>
                            {/* Add more buttons as needed */}
                        </div>
                        {/* Frame 1.2 - Working Area with Tabs */}
                        <div className="flex-1 bg-white p-2 flex flex-col">
                            {/* Tabs */}
                            <div className="border-b-2">
                                {/* Tab buttons */}
                                <button className="px-4 py-2">Working Area</button>
                                <button className="px-4 py-2">History</button>
                            </div>
                            {/* Working area with flex grow */}
                            <div className="flex flex-col flex-grow relative overflow-hidden">
                                {/*<Image*/}
                                {/*    src="/demo_image.png"*/}
                                {/*    layout="fill"*/}
                                {/*    objectFit="contain"*/}
                                {/*    alt="Picture of the author"*/}
                                {/*/>*/}
                                {result && (
                                    <div>
                                        <Image
                                            src={result}
                                            alt="Generated Image"
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                        <div>
                                            <h1>Draw on Image</h1>
                                            {/*<FabricCanvas src="profile_page_image.png"/>*/}
                                        </div>
                                    </div>
                                )}
                                {/*<EditedImageShow/>*/}
                            </div>
                        </div>
                    </div>
                    {/* Frame 2 */}
                    <div className="px-4" style={{flex: "3"}}>
                        <h2 className="text-lg text-white">Text Box</h2>
                        {/* Container for Scrollable Text Box in Frame 2 */}
                        <div className="flex items-center justify-between px-2 w-full">
                            {" "}
                            {/* Adjust the height calculation as needed */}
                            {/*<textarea*/}
                            {/*    className="w-full resize-none" // `resize-none` to prevent manual resizing*/}
                            {/*    placeholder="Your text goes here..."*/}
                            {/*    value={text}*/}
                            {/*    onChange={(e) => setText(e.target.value)}*/}
                            {/*/>*/}
                            <textarea
                                className="w-full resize-none text-black p-2 m-2"
                                placeholder="Your text goes here..."
                                ref={textareaRef}
                                // value={text}
                                // onChange={(e) => setText(e.target.value)}
                            />
                            {optimizedPrompt != "" && (
                                <button
                                    className="bg-blue-500 text-white p-2 rounded flex-shrink-0"
                                    onClick={handleClearPrompts}
                                    style={{marginLeft: "auto"}}
                                >
                                    {"Clear text prompts"}
                                </button>
                            )}
                            {/*{textareaRef.current.value && (*/}
                            {/*    <div>*/}
                            {/*        <p className="text-white">{textareaRef.current.value}</p>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                        <div className="flex items-center justify-between px-2 w-full">
                            {optimizedPrompt != "" && (
                                <>
                                    <h3 className="text-md text-white m-2">
                                        Optimized Text Prompt
                                    </h3>
                                    <div className="border border-white bg-gray-800 p-2 overflow-auto max-h-40">
                                        {optimizedPrompt}
                                    </div>
                                    <button
                                        onClick={handleOptimizedPromptCopy}
                                        className=" bg-blue-500 text-white p-1 m-2 rounded"
                                        title="Copy"
                                    >
                                        Copy
                                    </button>
                                </>
                            )}

                            <button
                                className="bg-blue-500 text-white p-2 rounded flex-shrink-0"
                                onClick={optimizePrompt}
                                style={{marginLeft: "auto"}}
                            >
                                {"Optimize Text Prompt"}
                            </button>
                        </div>
                        <div className="p-2" onClick={callTextToImageAPI}>
                            <button className="w-full h-10 bg-blue-500 text-white">
                                {loading ? "Loading..." : "Generate Image"}
                            </button>
                        </div>
                        <h2 className="text-lg text-white">Text Box</h2>
                    </div>
                </div>
                {/* Right side container - Frame 3 */}
                <div className="w-1/4 overflow-auto p-4">
                    {/* Tabs for Frame 3 */}
                    <div className="border-b-2">
                        {/*<button className="px-4 py-2 text-white">Design</button>*/}
                        {/*<button className="px-4 py-2 text-white">Edit</button>*/}
                        {/*<div className="flex space-x-4 mb-4">*/}
                        {/*    <button className="bg-blue-600 px-4 py-2 rounded">Design</button>*/}
                        {/*    <button className="bg-gray-700 px-4 py-2 rounded">Edit</button>*/}
                        {/*    <button className="bg-gray-700 px-4 py-2 rounded">Edit</button>*/}
                        {/*</div>*/}
                        {/*<Design/>*/}
                        <TabComponent model={model} setModel={setModel}/>
                        {/* Add more component tabs as needed */}
                    </div>
                    {/* Content of Frame 3 */}
                    <div className="mt-4">
                        {/* Component content based on selected tab */}
                    </div>
                </div>
            </div>
        </div>
    );
}
