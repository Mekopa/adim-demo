import React from 'react';

export default function DashboardBackground() {
  return (
    <div className="absolute inset-0 z-5 overflow-hidden">
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 1600 800'><rect fill='#18191A' width='1600' height='800'/><g fill-opacity='1'><polygon  fill='#1f2e46' points='1600 160 0 460 0 350 1600 50'/><polygon  fill='#264372' points='1600 260 0 560 0 450 1600 150'/><polygon  fill='#2d589e' points='1600 360 0 660 0 550 1600 250'/><polygon  fill='#346dca' points='1600 460 0 760 0 650 1600 350'/><polygon  fill='#3B82F6' points='1600 800 0 800 0 750 1600 450'/></g></svg>
    </div>
  );
}