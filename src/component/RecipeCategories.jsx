export default function RecipeCategories() {
  const categories = [
    { name: "Breakfast", icon: "🍳", count: 24 },
    { name: "Lunch", icon: "🥗", count: 36 },
    { name: "Dinner", icon: "🍝", count: 42 },
    { name: "Desserts", icon: "🍰", count: 18 },
    { name: "Snacks", icon: "🍟", count: 27 },
    { name: "Drinks", icon: "🥤", count: 15 },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">Best Featured Category</h2>
        <p className="text-gray-500 mt-3">
          Discover Our Best Featured Category.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 "
          >
            <div className="text-5xl mb-3">{category.icon}</div>
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <p className="text-sm text-gray-500">
              {category.count} Recipes
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}