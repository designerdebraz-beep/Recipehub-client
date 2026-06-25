import DashBoardSideber from "@/component/Dashboard/Sideber";

export default function Dashboard({ children }) {
    return (
        
        <div className="mt-16 sm:mt-24 mb-10 px-4 sm:px-6 lg:px-8 w-full max-w-[1440px] mx-auto">
           
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">
                
              
                <div className="w-full lg:w-[320px] xl:w-[350px] lg:max-h-screen lg:sticky lg:top-24 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6 flex-shrink-0">
                    <DashBoardSideber />
                </div>
                
                {/* মেইন কন্টেন্ট এরিয়া */}
                <main className="w-full min-w-0">
                    {children}
                </main>

            </div>
        </div>
    );
}