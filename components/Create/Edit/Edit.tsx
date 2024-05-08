import Image from "next/image";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import ModelSelector from "@/components/Create/Design/ModelSelect";
import NewFiles from "@/components/Create/Design/NewFile";


export default function Edit({ model, setModel }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const supabase = createClientComponentClient<Database>();
    const [modelList, setModelList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("model")
                .select();

            if (data) {
                setModelList(data);
                // Set the first model as the default
                setSelectedModel(data[0]);
            }
            if (error) {
                console.error("Error fetching chat messages:", error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [supabase]);

    const handleModelChange = (model) => {
        setSelectedModel(model);
        setModel(model.id);
    };

    return (
        <div className="bg-gray-800 text-white p-4" style={{ width: "100%" }}>
            <div className="mb-4">
                <ModelSelector
                    modelList={modelList}
                    selectedModel={selectedModel}
                    setSelectedModel={handleModelChange}
                />
            </div>

            {/* Rest of the component */}
            <NewFiles />
            <div className="mb-4">
                <h3 className="text-lg mb-2">Images</h3>
                <div className="p-4 bg-gray-700 rounded flex items-center justify-center">
                    <button className="bg-blue-600 px-4 py-2 rounded">
                        Reference Images
                    </button>
                </div>
                <div className="bg-gray-700 rounded mt-2 flex items-center justify-center">
                    <button className="">
                        <Image
                            src="/upload_placeholder.png"
                            alt="Upload your image"
                            width={300}
                            height={200}
                        />
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg mb-2">Effect</h3>
                <div className="flex space-x-2 mb-4">
                    <button className="bg-blue-600 px-4 py-2 rounded">All</button>
                    <button className="bg-gray-700 px-4 py-2 rounded">Popular</button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700 p-2 rounded flex flex-col items-center">
                        <Image
                            src="/bokeh.png"
                            alt="Upload your image"
                            width={300}
                            height={200}
                        />
                        <span className="text-sm">Bokeh effect</span>
                    </div>
                    <div className="bg-gray-700 p-2 rounded flex flex-col items-center">
                        <Image
                            src="/layered.png"
                            alt="Upload your image"
                            width={300}
                            height={200}
                        />
                        <span className="text-sm">Layered paper</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
