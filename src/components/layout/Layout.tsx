import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Development Metrics Dashboard' 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Head>
        <title>{`${title} | ScrumTeam`}</title>
        <meta name="description" content="Track story points and development metrics across your organization" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;
