

export default function Dashboard({ children }) {
    return (
        
        <div className="mt-48 flex flex-1 gap-14">
            <div className="max-h-screen">sideber</div>
            <main className="h-20 w-7xl mx-auto">

                {children}

            </main>
        </div>
    );
}