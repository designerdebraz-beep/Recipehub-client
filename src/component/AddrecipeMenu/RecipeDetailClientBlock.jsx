"use client";

import React, { useState } from 'react';
import { Button, Chip, Surface, Modal, TextField, Label, Input } from "@heroui/react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeartIcon = ({ className = "size-4", fill = "none" }) => (
  <svg className={className} fill={fill} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const StarIcon = ({ className = "size-4", fill = "none" }) => (
  <svg className={className} fill={fill} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.243.577 1.735l-3.97 2.454a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.454a1 1 0 00-1.175 0l-3.97 2.454c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.454c-.783-.491-.384-1.735.577-1.735h4.907a1 1 0 00.95-.69l1.519-4.674z" />
  </svg>
);

export default function RecipeDetailClientBlock({ initialRecipe }) {
  const router = useRouter();
  
  // Dynamic tracking states 
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Overlay Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isStripeProcessing, setIsStripeProcessing] = useState(false);

  const handleLikeInteraction = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(prev => !prev);
    alert(!isFavorite ? "Added to your collection dashboard favorites!" : "Removed from favorites.");
  };

  const handleStripePurchaseAction = async () => {
    setIsStripeProcessing(true);
    try {
      alert(`Initializing Secure Stripe Session for "${initialRecipe.recipeName}" Premium access token...`);
      // Integration Hook: Window navigation pointing out towards Stripe hosted server checkouts
      // window.location.href = data.stripeSessionUrlURL
    } catch (error) {
      console.error(error);
    } finally {
      setIsStripeProcessing(false);
    }
  };

  const handleReportFormSubmit = (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    alert(`Thank you. A flag entry has been opened for investigation detailing: "${reportReason}"`);
    setReportReason("");
    setIsReportModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Back to Gallery Navigation Arrow Link */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors group"
      >
        ← Back to Documented Recipes
      </button>

      {/* Main Structural Showcase Layout Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">
        
        {/* Left Side: Media Window */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-border shadow-md bg-secondary-soft">
          <Image 
            src={initialRecipe.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"} 
            alt={initialRecipe.recipeName}
            fill
            className="object-cover"
            priority
          />
          {initialRecipe.category && (
            <Chip className="absolute top-4 left-4 bg-background/90 text-foreground font-bold backdrop-blur-md">
              {initialRecipe.category}
            </Chip>
          )}
        </div>

        {/* Right Side: Informational Dashboard Frame */}
        <div className="flex flex-col h-full justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {initialRecipe.recipeName}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 mt-3 text-muted-foreground font-medium text-sm">
            <span className="text-foreground font-semibold">{initialRecipe.cuisineType || 'International'}</span>
            <span>•</span>
            <span>{initialRecipe.prepTime || '30 mins'}</span>
            <span>•</span>
            <span className="px-2.5 py-0.5 bg-success-soft text-success rounded-full text-xs font-bold uppercase">
              {initialRecipe.difficultyLevel || 'Easy'}
            </span>
          </div>

          {/* Metrics Displays Counter Area */}
          <div className="flex gap-4 my-6 items-center bg-secondary-soft/50 p-3 rounded-xl border border-border w-fit">
            <div className="text-sm">
              <span className="font-extrabold text-foreground text-base">{likes}</span> <span className="text-muted-foreground">Likes</span>
            </div>
            <div className="w-[1px] h-4 bg-border" />
            <div className="text-sm text-muted-foreground">
              Favorites: <span className="text-foreground font-semibold">{isFavorite ? "Saved" : "Unsaved"}</span>
            </div>
          </div>

          {/* Interaction Bar Actions Row */}
          <div className="flex flex-wrap gap-3 mt-2">
            <Button 
              onClick={handleLikeInteraction}
              variant={hasLiked ? "solid" : "secondary"}
              color={hasLiked ? "danger" : "default"}
              className="font-bold flex-1 sm:flex-initial"
            >
              <HeartIcon fill={hasLiked ? "currentColor" : "none"} />
              {hasLiked ? 'Liked' : 'Like'}
            </Button>

            <Button 
              onClick={handleFavoriteToggle}
              variant="secondary"
              className="font-bold flex-1 sm:flex-initial"
            >
              <StarIcon fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-warning" : ""} />
              {isFavorite ? 'Saved to Favorites' : 'Add Favorite'}
            </Button>

            <Button 
              onClick={() => setIsReportModalOpen(true)}
              variant="secondary"
              className="text-danger hover:bg-danger-soft hover:border-danger-soft font-medium flex-1 sm:flex-initial"
            >
              Report Recipe
            </Button>
          </div>

          {/* Call To Action Row via Stripe processing gates */}
          <div className="mt-6 pt-6 border-t border-border">
            <Button 
              onClick={handleStripePurchaseAction}
              disabled={isStripeProcessing}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-extrabold text-base py-6 rounded-xl shadow-md tracking-wide"
            >
              {isStripeProcessing ? 'Contacting Stripe secure servers...' : 'Purchase Premium Recipe Card Blueprint'}
            </Button>
            <p className="text-[11px] text-muted text-center mt-2">
              Stripe encrypted connections confirm direct receipt processing instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Structural lower section partitioning: Ingredients text block array grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-foreground mb-4">Ingredients Required</h3>
          <ul className="space-y-2.5">
            {Array.isArray(initialRecipe.ingredients) ? (
              initialRecipe.ingredients.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-muted-foreground text-sm font-medium">
                  <span className="size-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  {item}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted">No details string array breakdown specified.</li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-foreground mb-4">Step-by-Step Instructions</h3>
          <Surface variant="soft" className="p-6 rounded-2xl border border-border">
            <p className="text-sm leading-7 text-foreground whitespace-pre-line font-medium">
              {initialRecipe.instructions || 'Cooking instructions breakdown empty.'}
            </p>
          </Surface>
        </div>
      </div>

      {/* HeroUI overlay context template module window for reporting */}
      {/* {isReportModalOpen && (
        <Modal onClose={() => setIsReportModalOpen(false)}>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-md">
                <Modal.CloseTrigger onClick={() => setIsReportModalOpen(false)} />
                <Modal.Header>
                  <Modal.Heading>Report Content Form</Modal.Heading>
                  <p className="mt-1 text-xs text-muted">Provide accurate descriptions of issues found inside this file structure.</p>
                </Modal.Header>
                <Modal.Body className="p-5">
                  <form id="detailsReportForm" onSubmit={handleReportFormSubmit} className="flex flex-col gap-4">
                    <TextField className="w-full">
                      <Label>Reason context statement</Label>
                      <Input 
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        placeholder="e.g., Copyright violation, explicit content or incorrect metrics..." 
                        required
                      />
                    </TextField>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setIsReportModalOpen(false)}>Dismiss</Button>
                  <Button type="submit" form="detailsReportForm" className="bg-danger text-danger-foreground font-bold">
                    Submit Content Report
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )} */}
      <Modal
  isOpen={isReportModalOpen}
  onOpenChange={setIsReportModalOpen}
>
  <Modal.Backdrop>
    <Modal.Container>
      <Modal.Dialog className="sm:max-w-md">

        <Modal.CloseTrigger />

        <Modal.Header>
          <Modal.Heading>
            Report Content Form
          </Modal.Heading>

          <p className="mt-1 text-xs text-muted">
            Provide accurate descriptions of issues found.
          </p>
        </Modal.Header>


        <Modal.Body className="p-5">

          <form
            id="detailsReportForm"
            onSubmit={handleReportFormSubmit}
            className="flex flex-col gap-4"
          >

            <TextField className="w-full">

              <Label>
                Reason context statement
              </Label>


              <Input
                value={reportReason}
                onChange={(e)=>setReportReason(e.target.value)}
                placeholder="Enter reason..."
                required
              />

            </TextField>


          </form>

        </Modal.Body>


        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={()=>setIsReportModalOpen(false)}
          >
            Dismiss
          </Button>


          <Button onClick={() => setIsReportModalOpen(true)}
            type="submit"
            form="detailsReportForm"
            className="bg-danger text-danger-foreground"
          >
            Submit Report
          </Button>

        </Modal.Footer>


      </Modal.Dialog>
    </Modal.Container>
  </Modal.Backdrop>
</Modal>
    </div>
  );
}