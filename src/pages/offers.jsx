import React, { useState, useEffect } from 'react';
// Assuming you have these modal components created
import AddOfferModal from '../components/addModals/offer';
import DeleteOfferModal from '../components/deleteModal/deleteOffer';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    try {
      const response = await fetch('https://products-api.cbc-apps.net/offers/general');
      const data = await response.json();
      setOffers(data);
    } catch (e) {
      console.error('Error fetching offers:', e);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Offers Management</h1>
              <p className="text-sm text-[#94A3B8] mt-1">Create and manage special deals and promotions</p>
            </div>
            <AddOfferModal onSubmit={fetchOffers} />
          </div>
        </div>
      </div>
      <br />

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="offer-card bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden hover:border-[#5E54F2]/50 transition-all group"
            >
              {/* Offer Badge */}
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  {/* Your offer badge logic would go here */}
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <DeleteOfferModal id={offer.id} onDelete={fetchOffers} />
                </div>
                <div className="h-48 bg-gradient-to-br from-[#5E54F2]/20 to-[#7C3AED]/20 flex items-center justify-center">
                  <img src={offer.image} alt={offer.name} />
                </div>
              </div>

              {/* Offer Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{offer.name}</h3>
                    <p className="text-sm text-[#94A3B8]">{offer.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersManagement;