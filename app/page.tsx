import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import SignOut from "@/components/SignOut";
import Image from 'next/image';

const cards = [
    // Example card data
    { id: 1, title: 'Create', imageUrl: '/text_to_image.png', link: '/create' },
    { id: 2, title: 'Profile', imageUrl: '/profile_page_image.png', link: '/profile' },
    // Add more cards as needed
];

export default async function Home() {
    const supabase = createServerComponentClient({cookies});

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/sign-in');
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 p-8">
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 pt-16 text-gray-300">
                <h2 className="text-3xl font-semibold text-center">Welcome!</h2>
                {/*<p className="mt-4">Your role: <code*/}
                {/*    className="bg-gray-700 text-green-400 p-2 rounded">{user.role}</code></p>*/}
                {/*<Link href="/profile"*/}
                {/*      className="inline-block mt-4 py-2 px-4 bg-green-400 text-gray-800 rounded hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors">Go*/}
                {/*    to Profile*/}
                {/*</Link>*/}
                {/*<div className="mt-4">*/}
                {/*    <SignOut/>*/}
                {/*</div>*/}
                {/*    Add card to click which has image on top and text on below*/}
                {/*<div className="flex flex-col items-center mt-4">*/}
                {/*    <div className="w-1/2">*/}
                {/*        <img*/}
                {/*            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx8bd4Z7NKxryfwQ996RCZUTieUgQWmB2NCloeKLEp7Q&s"*/}
                {/*            alt="profile" className="rounded-lg"/>*/}
                {/*    </div>*/}
                {/*    <div className="mt-4">*/}
                {/*        <p className="text-center">Welcome to the profile page</p>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="bg-gray-900 text-gray-300 min-h-screen p-8 mt-10">
                    <div className="flex flex-wrap -mx-4">
                        {cards.map((card) => (
                            <div key={card.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8">
                                <Link href={card.link} className="block bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                                        <div className="relative h-48 w-full">
                                            <Image src={card.imageUrl} alt={card.title} layout="fill"
                                                   objectFit="cover"/>
                                        </div>
                                        <div className="p-4">
                                            <h5 className="text-lg font-semibold">{card.title}</h5>
                                        </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
