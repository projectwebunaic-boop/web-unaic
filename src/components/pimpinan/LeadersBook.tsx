"use client";

import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import { rektor, wakilRektor, dekanFakultas, Leader } from '../../data/leadership';

const leaders: Leader[] = [rektor, ...wakilRektor, ...dekanFakultas];

const LeadersBook: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="shadow-2xl rounded-lg overflow-hidden">
        <HTMLFlipBook
          width={400}
          height={500}
          size="stretch"
          minWidth={300}
          maxWidth={400}
          minHeight={400}
          maxHeight={500}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startPage={0}
          showCover={true}
          mobileScrollSupport={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Cover Page */}
          <div className="bg-gradient-to-br from-unaicNavy to-unaicBlue text-white flex flex-col justify-center items-center p-8">
            <h1 className="text-2xl font-bold mb-4">Pimpinan UNAIC</h1>
            <p className="text-center">Flip untuk melihat profil pimpinan</p>
          </div>

          {/* Leader Pages */}
          {leaders.map((leader, index) => (
            <div key={index} className="bg-white flex flex-col justify-center items-center p-8">
              <img
                src={leader.photo}
                alt={leader.name}
                className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-unaicGold"
              />
              <h2 className="text-xl font-bold text-unaicNavy text-center mb-2">
                {leader.name}
              </h2>
              <p className="text-gray-600 text-center">
                {leader.position}
              </p>
            </div>
          ))}

          {/* Back Cover */}
          <div className="bg-gradient-to-br from-unaicNavy to-unaicBlue text-white flex flex-col justify-center items-center p-8">
            <h1 className="text-2xl font-bold mb-4">UNAIC</h1>
            <p className="text-center">Universitas Al-Irsyad Cilacap</p>
          </div>
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default LeadersBook;
