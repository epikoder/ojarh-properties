import Image from "next/image";
import React from "react";
typeof window !== "undefined" ? import("tw-elements") : " ";

function Slider({ images = [] }: { images?: string[] }) {
  return (
    <div id="carouselExampleSlidesOnly" className="carousel slide relative h-full w-full" data-bs-ride="carousel">
      <div className="carousel-inner relative w-full overflow-hidden h-full">
        <div className="carousel-item active relative float-left w-full h-full">
          <Image
            src="/image/041.webp"
            className="block w-full h-full"
            alt="Wild Landscape"
            layout="fill"
          />
        </div>
        <div className="carousel-item relative float-left w-full h-full">
          <Image
            src="/image/042.webp"
            className="block w-full h-full"
            alt="Camera"
            layout="fill"
          />
        </div>
        <div className="carousel-item relative float-left w-full h-full">
          <Image
            src="/image/043.webp"
            className="block w-full h-full"
            alt="Exotic Fruits"
            layout="fill"
          />
        </div>
      </div>
      <div className="absolute w-full flex flex-col items-center bottom-4 z-50">
        <div className="flex">
        {images.map((e, i) =>
          <div key={i} className="mx-1 px-1 h-4 w-4 rounded-full bg-red-500">
            
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Slider;


// <div className="flex flex-col lg:flex-row items-center bg-yellow-500 mt-10 " style={{height:"80vh"}}>

// //     <div className='lg:w-9/12 h-full w-full' >
// 	<div
// 		id='carouselExampleSlidesOnly'
// 		className='carousel slide relative h-full -z-40'
// 		data-bs-ride='carousel'                                
// 	>
// 		<div className='carousel-inner relative w-full overflow-hidden h-full'>
// 			<div className='carousel-item active relative float-left w-full  h-full'>
// 				<img
// 					src='/image.sign.jpg'
// 					className='block w-full h-full'
// 					alt='Wild Landscape'
// 				/>
// 			</div>
// 			<div className='carousel-item relative float-left w-full h-full'>
// 				<img
// 					src='/image/'
// 					className='block w-full h-full '
// 					alt='Camera'
// 				/>
// 			</div>
// 			<div className='carousel-item relative float-left w-full h-full'>
// 				<img
// 					src='https://mdbcdn.b-cdn.net/img/new/slides/043.webp'
// 					className='block w-full h-full'
// 					alt='Exotic Fruits'
// 				/>
// 			</div>
// 		</div>
// 	</div>
// </div>
// <div className="bg-black text-center items-center w-full lg:w-3/12 text-white">
//     Aderts Goes in here
// </div>
// </div>
