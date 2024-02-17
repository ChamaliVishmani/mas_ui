import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import Image from 'next/image'

import SignOut from '@/components/SignOut';
import Design from "@/components/Create/Design";
import TabComponent from "@/components/Create/TabComponent";

// Main layout component
const Layout = ({ children }) => (
    <div className="flex flex-col h-screen">
        {children}
    </div>
);


// Header component, if needed
const Header = () => (
    <header className="bg-gray-800 text-white">
        {/* Your header content */}
    </header>
);

// Sidebar component for navigation or tools
const Sidebar = () => (
    <aside className="w-64 bg-gray-700 text-white">
        {/* Your sidebar content */}
    </aside>
);

// Main content area
const Content = ({ children }) => (
    <main className="flex-1 overflow-auto">
        {children}
    </main>
);

// Component for individual frames
const Frame = ({ title, children }) => (
    <div className="border p-4 m-4">
        <h2 className="text-lg">{title}</h2>
        {children}
    </div>
);


export default async function Create() {
    const supabase = createServerComponentClient({cookies});

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/sign-in');
    }

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
                    <div className="flex overflow-auto p-4" style={{flex: '14'}}>
                        {/* Frame 1.1 - Button Section */}
                        <div className="w-1/8 bg-gray-200 p-2 space-y-2">
                            {/* List of buttons */}
                            <button className="w-full h-10 bg-blue-500 text-white">Button 1</button>
                            <button className="w-full h-10 bg-blue-500 text-white">Button 2</button>
                            {/* Add more buttons as needed */}
                        </div>
                        {/* Frame 1.2 - Working Area with Tabs */}
                        <div className="flex-1 bg-white p-2 flex flex-col">
                            {/* Tabs */}
                            <div className="border-b-2">
                                {/* Tab buttons */}
                                <button className="px-4 py-2">Tab 1</button>
                                <button className="px-4 py-2">Tab 2</button>
                            </div>
                            {/* Working area with flex grow */}
                            <div className="flex flex-col flex-grow relative overflow-hidden">
                                <Image
                                    src="/demo_image.png"
                                    layout="fill"
                                    objectFit="contain"
                                    alt="Picture of the author"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Frame 2 */}
                    <div className="px-4" style={{flex: '3'}}>
                        <h2 className="text-lg text-white">Text Box</h2>
                        {/* Container for Scrollable Text Box in Frame 2 */}
                        <div
                            className="p-2"> {/* Adjust the height calculation as needed */}
                            <textarea
                                className="w-full resize-none" // `resize-none` to prevent manual resizing
                                placeholder="Your text goes here..."
                            />
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
                        {/*    <button className="bg-gray-700 px-4 py-2 rounded">History</button>*/}
                        {/*</div>*/}
                        {/*<Design/>*/}
                        <TabComponent/>
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
