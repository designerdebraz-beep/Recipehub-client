import Image from "next/image";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import FeaturedRecipes from "@/component/FeaturedRecipes";
import PopularRecipe from "@/component/PopularRecipe";
import RecipeCategories from "../component/RecipeCategories";
import TopContributors from "@/component/TopContributors";

export default function Home() {
  return (
    <div>
      
      <section className="relative w-full bg-gradient-to-b from-default-100/50 to-background dark:from-zinc-900/30 dark:to-zinc-950 pt-20 pb-12 sm:pt-28 sm:pb-20 md:pt-36 md:pb-28 overflow-hidden transition-colors">

        {/* 🥞 BACKGROUND GRADIENT GLOWS (Responsive Opacity) */}
        <div className="absolute top-0 right-0 -z-10 h-[250px] w-[250px] sm:h-[350px] sm:w-[350px] md:h-[450px] md:w-[450px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] rounded-full bg-amber-500/5 blur-3xl" />

        {/* 🌐 MAIN CONTAINER */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 w-full">

          {/* 📊 RESPONSIVE GRID LAYOUT */}
          {/* মোবাইলে ১টি কলাম এবং বড় স্ক্রিনে (lg: অর্থাৎ 1024px+) এটি ১২টি কলামের গ্রিডে রূপান্তর হবে */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 items-center">

            {/* 📝 CONTENT COLUMN: (Title, Description, CTAs) */}
            {/* মোবাইলে টেক্সট সেন্টারে থাকবে (text-center), ল্যাপটপ বা ডেক্সটপে বামে চলে যাবে (lg:text-left) */}
            <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-7 text-center lg:text-left items-center lg:items-start order-2 lg:order-1">

              {/* Badging Label */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-primary-400 text-xs sm:text-sm font-semibold tracking-wide select-none">
                <UtensilsCrossed size={14} className="flex-shrink-0" />
                <span>Your Ultimate Digital Kitchen</span>
              </div>

              {/* Responsive Main Title */}
              {/* স্ক্রিন সাইজের ওপর ভিত্তি করে টেক্সট সাইজ বড়-ছোট হবে (text-3xl -> sm:text-4xl -> md:text-5xl -> lg:text-6xl) */}
              <h1 className="text-3xl font-extrabold tracking-tight text-default-900 dark:text-white sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl max-w-xl lg:max-w-none leading-[1.2] sm:leading-[1.15] lg:leading-[1.1]">
                Cooking Made Simple,{" "}
                <span className="text-primary bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] bg-clip-text text-transparent">
                  Deliciously
                </span>{" "}
                Shared.
              </h1>

              {/* Responsive Description */}
              <p className="text-sm sm:text-base md:text-lg text-default-500 dark:text-zinc-400 max-w-md sm:max-w-lg lg:max-w-none leading-relaxed">
                Explore thousands of crowd-pleasing recipes, organize your digital kitchen dashboard, and connect with food lovers worldwide. Your next culinary masterpiece starts here.
              </p>

              {/* Responsive CTA Buttons Group */}
              {/* অতি ছোট মোবাইলে বাটনগুলো নিচে নিচে ফুল-উইডথ (w-full) হয়ে যাবে, এবং sm: স্ক্রিন থেকে পাশাপাশি বসে যাবে */}
              <div className="mt-2 flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                <Button
                  as={Link}
                  href="/browse-products"
                  color="primary"
                  size="lg"
                  className="font-semibold rounded-xl text-sm px-6 h-12 w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group"
                  endContent={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                >
                  Explore Recipes
                </Button>

                <Button
                  as={Link}
                  href="/signup"
                  variant="bordered"
                  size="lg"
                  className="font-semibold rounded-xl text-sm px-6 h-12 w-full sm:w-auto border-default-200 hover:bg-default-100 dark:border-zinc-800 dark:hover:bg-zinc-900/50 text-default-800 dark:text-zinc-200"
                >
                  Create Account
                </Button>
              </div>

            </div>

            {/* 🖼️ HERO VISUAL IMAGE COLUMN */}
            {/* order-1 এবং lg:order-2 এর মাধ্যমে মোবাইলে ইমেজটি আগে (উপরে) দেখাবে এবং ডেক্সটপে ডানপাশে চলে যাবে */}
            <div className="relative lg:col-span-5 flex justify-center items-center w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-none mx-auto order-1 lg:order-2">
              <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-tr from-default-100 to-default-200 dark:from-zinc-900 dark:to-zinc-800/50 p-3 sm:p-4 border border-divider/40 shadow-xl">

                <Image
                  src="/herobanner.jpg"
                  alt="Delicious Recipe Showcase"
                  fill
                  priority
                  className="object-cover rounded-xl sm:rounded-2xl select-none"
                  sizes="(max-w-1024px) 100vw, 40vw"
                />

              </div>
            </div>

          </div>
        </div>
      </section>

      <FeaturedRecipes></FeaturedRecipes>

      <PopularRecipe></PopularRecipe>
      <RecipeCategories></RecipeCategories>
      <TopContributors></TopContributors>
    </div>
  );
}