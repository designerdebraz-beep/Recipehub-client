import DashBoardSideber from "@/component/Dashboard/Sideber";


export default function Dashboard({ children }) {
    return (
        
      <div className="my-30">
          <div className=" flex flex-1 gap-14">
            <div className="max-h-screen border-1 border-r-gray-100 w-[400px]"><DashBoardSideber></DashBoardSideber></div>
            <main className=" w-full mt-10">

                {children}

            </main>
        </div>
      </div>
    );
}