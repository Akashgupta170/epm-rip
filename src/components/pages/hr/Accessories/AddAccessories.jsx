import React, { useState, useEffect } from 'react';
import { Plus, Search, SlidersHorizontal, X, Tag, Edit, Trash } from 'lucide-react';

// Constants
const CATEGORIES = [
  'Laptop',
  'Lpatop Charger',
  'Mouse',
  'Desktop',
  'Keyboard',
  'Hard Disk',
  'Pendrive',
  'SSD',
  'Other'
];

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Button Component
const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', icon, className = '', disabled = false }) => {
  const baseStyles = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-blue-500',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${icon ? 'inline-flex items-center' : ''}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Header Component
const Header = ({ onAddClick }) => (
  <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Accessories Collection
          </h1>
        </div>
        <div>
          <Button 
            onClick={onAddClick}
            variant="primary"
            size="md"
            className="shadow-sm"
            icon={<Plus size={18} />}
          >
            Add Accessory
          </Button>
        </div>
      </div>
    </div>
  </header>
);

// Filters Component
const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    inStockOnly: false,
    sortBy: 'newest'
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => {
      const newFilters = { ...prev, [name]: newValue };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const initialFilters = {
      search: '',
      category: '',
      inStockOnly: false,
      sortBy: 'newest'
    };
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const hasActiveFilters = filters.category !== '' || filters.inStockOnly || filters.sortBy !== 'newest';

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search accessories..."
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
            {filters.search && (
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'search', value: '' } })}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-md ${hasActiveFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-200 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
            
            <div className="flex items-center h-full pt-6">
              <input
                type="checkbox"
                id="inStockOnly"
                name="inStockOnly"
                checked={filters.inStockOnly}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="inStockOnly" className="ml-2 block text-sm text-gray-700">
                In Stock Only
              </label>
              
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-auto text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AccessoryCard Component
const AccessoryCard = ({ accessory, onEdit, onDelete }) => {
  const { 
    id, name, description, price, category, 
    image, color, inStock, createdAt 
  } = accessory;

  const formattedDate = new Date(createdAt).toLocaleDateString();
  const defaultImage = "https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg?auto=compress&cs=tinysrgb&w=600";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full animate-fadeIn">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img 
          src={image || defaultImage} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        {!inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex justify-between items-end">
            <h3 className="text-white font-semibold text-lg line-clamp-1">{name}</h3>
            <span className="text-white font-medium">
              {price}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Tag size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-600">{category}</span>
          {color && (
            <span className="text-sm text-gray-600">• {color}</span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        
        <div className="pt-3 flex justify-between items-center border-t border-gray-100">
          <span className="text-xs text-gray-500">Added: {formattedDate}</span>
          
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(id)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Edit"
              >
                <Edit size={16} />
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete"
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// AccessoryList Component
const AccessoryList = ({ accessories, onEdit, onDelete }) => {
  if (accessories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <svg 
            className="w-12 h-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No accessories yet</h3>
        <p className="text-gray-500 max-w-md">
          Click the "Add Accessory" button in the top right corner to add your first item to the collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {accessories.map(accessory => (
        <AccessoryCard 
          key={accessory.id} 
          accessory={accessory} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// AccessoryForm Component
const AccessoryForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    color: '',
    inStock: true
  });
  
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Accessory</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Accessory no
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Model no
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Issue date
              </label>
              <input
                type="date"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>
            
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
            >
              Add Accessory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Component
function AddAccessories() {
  const [accessories, setAccessories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    inStockOnly: false,
    sortBy: 'newest'
  });

  // Load from localStorage on initial render
  useEffect(() => {
    const savedAccessories = localStorage.getItem('accessories');
    if (savedAccessories) {
      try {
        const parsed = JSON.parse(savedAccessories);
        setAccessories(parsed);
      } catch (error) {
        console.error('Failed to parse saved accessories', error);
        setAccessories();
      }
    } else {
      setAccessories();
    }
  }, []);

  // Save to localStorage when accessories change
  useEffect(() => {
    localStorage.setItem('accessories', JSON.stringify(accessories));
  }, [accessories]);

  const handleAddAccessory = (formData) => {
    const newAccessory = {
      ...formData,
      id: generateId(),
      createdAt: new Date()
    };
    
    setAccessories(prev => [newAccessory, ...prev]);
    setIsFormOpen(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDeleteAccessory = (id) => {
    if (window.confirm('Are you sure you want to delete this accessory?')) {
      setAccessories(prev => prev.filter(item => item.id !== id));
    }
  };

  // Apply filters to accessories
  const filteredAccessories = accessories.filter(accessory => {
    // Search filter
    if (filters.search && !accessory.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !accessory.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category && accessory.category !== filters.category) {
      return false;
    }
    
    // In Stock filter
    if (filters.inStockOnly && !accessory.inStock) {
      return false;
    }
    
    return true;
  });

  // Sort filtered accessories
  const sortedAccessories = [...filteredAccessories].sort((a, b) => {
    switch (filters.sortBy) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddClick={() => setIsFormOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Filters onFilterChange={handleFilterChange} />
        
        <AccessoryList 
          accessories={sortedAccessories} 
          onDelete={handleDeleteAccessory}
        />
      </main>
      
      {isFormOpen && (
        <AccessoryForm 
          onSubmit={handleAddAccessory} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}

export default AddAccessories;