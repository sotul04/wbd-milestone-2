import { useState } from "react";


export default function FeedPage() {
    const [isModalOpen, setModalOpen] = useState(false);

    // Dummy data for the feed
    const feeds = [
        {
            id: 1,
            name: "Nada Raudah Mumtazah",
            title: "Undergraduate Student of Ocean Engineering, Bandung Institute of Technology",
            content:
                "ARUNGI is a national-level design competition based on ocean engineering knowledge for high school students (SMA/SMK/MA equivalent), organized by KMKL and ALKA ITB.",
            time: "4hr",
            likes: 32,
            comments: 5,
        },
        {
            id: 2,
            name: "Mario Mahardika Sinulingga",
            title: "IT Enthusiast",
            content: "Check out the latest opportunities in the tech world!",
            time: "6hr",
            likes: 45,
            comments: 8,
        },
        {
            id: 3,
            name: "Institut Teknologi Bandung (ITB)",
            title: "Official Account",
            content: "KMKL dan ALKA ITB Sukses Gelar ARUNGI 2024.",
            time: "5hr",
            likes: 100,
            comments: 25,
        },
        {
            id: 4,
            name: "LinkedIn Official",
            title: "Your Career Partner",
            content: "Update your job preferences to help recruiters find you for the right opportunities.",
            time: "8hr",
            likes: 22,
            comments: 3,
        },
        {
            id: 5,
            name: "John Doe",
            title: "Senior Developer at Tech Inc.",
            content: "Building scalable solutions for the next generation.",
            time: "10hr",
            likes: 67,
            comments: 15,
        },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4 p-4 bg-white shadow-lg">
                <div className="space-y-4">
                    <div className="bg-gray-200 h-32 rounded-md"></div>
                    <h2 className="text-lg font-semibold">Selamat datang, Suthasoma Mahardhika!</h2>
                    <p className="text-sm text-gray-600">Koneksi: 7</p>
                    <button className="w-full text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg">
                        Kembangkan jaringan Anda
                    </button>
                </div>
            </aside>
            
            {/* Main Body */}
            <main className="flex-1 p-4">
                {/* Add Post Section */}
                <div className="bg-white p-4 rounded-md shadow-md mb-4">
                    <div className="flex items-center space-x-4">
                        {/* Profile Picture */}
                        <img 
                            src="public/purry.ico" 
                            alt="profile-pic" 
                            className="h-12 w-12 rounded-full"
                        />

                        {/* Button */}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="w-full text-left px-4 py-2 border rounded-full text-gray-600 bg-gray-100 focus:outline-none hover:bg-gray-200"
                        >
                            Start a post, try writing with AI
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-4 text-gray-600">
                        <button className="flex items-center space-x-2 text-sm font-medium text-blue-600">
                            <img
                                src="https://img.icons8.com/color/24/null/image-gallery.png"
                                alt="Photo Icon"
                            />
                            <span>Photo</span>
                        </button>
                        <button className="flex items-center space-x-2 text-sm font-medium text-green-600">
                            <img
                                src="https://img.icons8.com/color/24/null/video.png"
                                alt="Video Icon"
                            />
                            <span>Video</span>
                        </button>
                        <button className="flex items-center space-x-2 text-sm font-medium text-orange-600">
                            <img
                                src="https://img.icons8.com/color/24/null/news.png"
                                alt="Write Article Icon"
                            />
                            <span>Write article</span>
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-4 w-11/12 max-w-md shadow-lg">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="frontend/public/purry.ico"
                                        alt="profile-pic"
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-semibold">Darrell Suryanegara</h3>
                                        <p className="text-sm text-gray-500">Post to Anyone</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Input Section */}
                            <textarea
                                placeholder="What do you want to talk about?"
                                className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex space-x-2">
                                    <button className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-blue-600">
                                        <span>😊</span>
                                    </button>
                                    <button className="flex items-center space-x-1 text-sm font-medium text-blue-600">
                                        ✨ Rewrite with AI
                                    </button>
                                    <button className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-800">
                                        📷
                                    </button>
                                    <button className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-800">
                                        🎥
                                    </button>
                                    <button className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-800">
                                        🗓️
                                    </button>
                                </div>
                                <button
                                    className="bg-blue-600 text-white px-4 py-1 rounded-full font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                                    disabled
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Feed */}
                {feeds.map((feed) => (
                    <div
                        key={feed.id}
                        className="bg-white p-4 rounded-md shadow-md mb-4 space-y-2"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
                            <div>
                                <h3 className="font-semibold">{feed.name}</h3>
                                <p className="text-sm text-gray-600">{feed.title}</p>
                            </div>
                        </div>
                        <p className="text-gray-800">{feed.content}</p>
                        <div className="flex justify-between items-center text-gray-600 text-sm">
                            <span>{feed.time} ago</span>
                            <span>{feed.likes} likes • {feed.comments} comments</span>
                        </div>
                    </div>
                ))}
            </main>

            {/* Right Sidebar */}
            <aside className="w-full md:w-1/4 p-4 bg-white shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Berita LinkedIn</h2>
                <ul className="space-y-2">
                    <li className="text-sm text-gray-800">
                        <a href="#" className="hover:underline">
                            Americans see ideal salary at $270K
                        </a>
                        <p className="text-xs text-gray-500">4j yang lalu - 28,970 pembaca</p>
                    </li>
                    <li className="text-sm text-gray-800">
                        <a href="#" className="hover:underline">
                            Amazon raises stake in Anthropic
                        </a>
                        <p className="text-xs text-gray-500">8j yang lalu - 18,304 pembaca</p>
                    </li>
                    <li className="text-sm text-gray-800">
                        <a href="#" className="hover:underline">
                            Bitcoin takes aim at $100K mark
                        </a>
                        <p className="text-xs text-gray-500">4j yang lalu - 7,526 pembaca</p>
                    </li>
                </ul>
            </aside>
        </div>
    );
}
