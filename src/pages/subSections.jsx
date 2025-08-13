import React, { useState, useEffect } from 'react';
// Assuming these are your modal components
import AddSubSectionModal from '../components/AddModals/AddSubSectionModal';
import EditSubSectionModal from '../components/editModals/EditSubSectionModal';
import DeleteSubSectionModal from '../components/DeleteModal/DeleteSubSectionModal';
import { useNavigate } from 'react-router-dom';

const SubSections = () => {
  const [categories, setCategories] = useState([]);
  const [expandedSubsections, setExpandedSubsections] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);

  const navigate = useNavigate();

  // Middleware equivalent for auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://products-api.cbc-apps.net/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Methods
  const toggleSubsection = (id) => {
    setExpandedSubsections((prevExpanded) => {
      if (prevExpanded.includes(id)) {
        return prevExpanded.filter((subsectionId) => subsectionId !== id);
      } else {
        return [...prevExpanded, id];
      }
    });
  };

  const toggleAllSubsections = () => {
    if (allExpanded) {
      setExpandedSubsections([]);
    } else {
      const allIds = categories.flatMap((category) => category.sections.map((s) => s.id));
      setExpandedSubsections(allIds);
    }
    setAllExpanded(!allExpanded);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Subsections Management</h1>
            </div>
            <AddSubSectionModal onSubmit={fetchCategories} />
          </div>
        </div>
      </div>
      <br />

      {/* Subsections Tree View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5E54F2] to-[#7C3AED] rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-[#94A3B8]">Main category with {category.sections.length} sections</p>
                  </div>
                </div>
                <button
                  onClick={toggleAllSubsections}
                  className="px-3 py-1.5 text-sm bg-[#5E54F2]/20 text-[#5E54F2] rounded-lg hover:bg-[#5E54F2]/30 transition-all"
                >
                  {allExpanded ? 'Collapse All' : 'Expand All'}
                </button>
              </div>

              {/* Subsections List */}
              {category.sections.map((section) => (
                <div key={section.id} className="mb-2">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSubsection(section.id)}
                  >
                    <span className="text-white">{section.name}</span>
                    <div className="flex">
                      {expandedSubsections.includes(section.id) ? (
                        <svg className="w-4 h-4 text-[#5E54F2] mt-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#94A3B8] mt-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      )}
                      <div className="flex items-center gap-1 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <EditSubSectionModal sectionId={section.id} onSubmit={fetchCategories} />
                        </button>
                        <button className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-white/5 rounded-lg transition-all">
                          <DeleteSubSectionModal id={section.id} onDelete={fetchCategories} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {expandedSubsections.includes(section.id) && (
                    <div className="pl-6 py-2 text-[#94A3B8]">
                      {section.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubSections;