import React, { useState } from 'react';
import { Image as ImageIcon, ExternalLink, X, Eye } from 'lucide-react';

const EvidenceGallery = ({ photos = [], title = 'Inspection Evidence Photos' }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-center">
        <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
        <p className="text-xs text-slate-500 font-medium">No photo evidence uploaded for this record</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</h4>
        <span className="text-xs font-semibold text-slate-500">{photos.length} item(s)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(photo)}
            className="group relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            <img
              src={photo}
              alt={`Evidence ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-700">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 text-white rounded-full hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Evidence Full View"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceGallery;
