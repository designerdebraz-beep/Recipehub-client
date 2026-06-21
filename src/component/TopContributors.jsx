export default function TopContributors() {
  const contributors = [
    {
      id: 1,
      name: "Ayesha Rahman",
      recipes: 42,
      likes: 1250,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
      id: 2,
      name: "Tanvir Hasan",
      recipes: 38,
      likes: 1120,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    },
    {
      id: 3,
      name: "Nusrat Jahan",
      recipes: 35,
      likes: 980,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    },
    {
      id: 4,
      name: "Mehedi Hasan",
      recipes: 31,
      likes: 890,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold">Top Contributors</h2>
        <p className="text-gray-500 mt-2">
          Meet our most active recipe creators.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {contributors.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl border p-6 text-center hover:shadow-lg transition"
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto object-cover"
            />

            <h3 className="font-bold text-xl mt-4">{user.name}</h3>

            <div className="mt-4 flex justify-center gap-6">
              <div>
                <p className="font-bold text-lg">{user.recipes}</p>
                <p className="text-sm text-gray-500">Recipes</p>
              </div>

              <div>
                <p className="font-bold text-lg">{user.likes}</p>
                <p className="text-sm text-gray-500">Likes</p>
              </div>
            </div>

            {/* <button className="mt-5 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
              View Profile
            </button> */}
          </div>
        ))}
      </div>
    </section>
  );
}