// 'use client';
// import React, { useState } from 'react';
// import Image from "next/image";
//
// const EditedImageShow = () => {
//     const [result, setResult] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//
//     const callTextToImageAPI = async () => {
//         console.log('Calling API...');
//         setLoading(true);
//         setError('');
//         try {
//             const response = await fetch('/api/text', { // Make sure the endpoint matches your API route
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     // Your request body here, if needed. This example assumes you handle the body in the API route.
//                 }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//                 console.error('API error:', response);
//             }
//
//             const data = await response.json();
//             setResult(data[0].url);
//             console.log('API response:', data);
//             console.log(data[0].url);
//         } catch (error) {
//             setError('Failed to fetch: ' + error.message);
//             console.error('API error:', error);
//         } finally {
//             setLoading(false);
//             console.log('API call complete.');
//         }
//     };
//
//     return (
//         <div>
//             <button className="pt-24 text-white" onClick={callTextToImageAPI} >
//                 {loading ? 'Loading...' : 'Generate Image'}
//             </button>
//             {error && <div style={{ color: 'red' }}>{error}</div>}
//             {result && (
//                 <div>
//                     <p>Image generated successfully!</p>
//                     {console.log(result)}
//                     <Image src={result} alt="Generated Image" width={500} height={500} />
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default EditedImageShow;
