import { useState, useEffect } from 'react';
import { Search, X, Smartphone, Laptop } from 'lucide-react';
import api from '../../services/api';

interface DeviceSelectorProps {
  deviceType: 'phone' | 'laptop';
  onDeviceSelect: (data: DeviceSelection) => void;
  categoryId: number;
}

interface DeviceSelection {
  deviceType: 'phone' | 'laptop';
  phone_color_id?: number;
  laptop_variant_id?: number;
  specification: string;
  units: Array<{
    imei?: string;
    serial_number?: string;
  }>;
}

interface PhoneModel {
  id: number;
  brand: string;
  display_name: string;
  generation: string;
  model: string;
}

interface PhoneVariant {
  id: number;
  phone_model_id: number;
  storage: string;
}

interface PhoneColor {
  id: number;
  phone_variant_id: number;
  color: string;
}

interface LaptopModel {
  id: number;
  brand: string;
  display_name: string;
  series: string;
  processor_type: string;
}

interface LaptopVariant {
  id: number;
  laptop_model_id: number;
  ram: string;
  storage: string;
  color: string | null;
}

export default function DeviceSelector({ deviceType, onDeviceSelect }: DeviceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Search results
  const [phoneModels, setPhoneModels] = useState<PhoneModel[]>([]);
  const [laptopModels, setLaptopModels] = useState<LaptopModel[]>([]);
  
  // Selection state
  const [selectedModel, setSelectedModel] = useState<PhoneModel | LaptopModel | null>(null);
  const [variants, setVariants] = useState<PhoneVariant[] | LaptopVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<PhoneVariant | LaptopVariant | null>(null);
  const [colors, setColors] = useState<PhoneColor[]>([]);
  const [selectedColor, setSelectedColor] = useState<PhoneColor | null>(null);
  
  // Quantity and IMEI/Serial tracking
  const [quantity, setQuantity] = useState(1);
  const [identifiers, setIdentifiers] = useState<string[]>(['']);
  
  const [specification, setSpecification] = useState('');

  // Search devices
  useEffect(() => {
    if (searchQuery.length < 2) {
      setPhoneModels([]);
      setLaptopModels([]);
      return;
    }

    const delaySearch = setTimeout(async () => {
      try {
        const response = await api.get('/devices/search', {
          params: {
            q: searchQuery,
            type: deviceType,
            limit: 20,
          },
        });

        if (deviceType === 'phone') {
          setPhoneModels(response.data.phones || []);
        } else {
          setLaptopModels(response.data.laptops || []);
        }
      } catch (error) {
        console.error('Device search error:', error);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, deviceType]);

  // Handle model selection
  const handleModelSelect = async (model: PhoneModel | LaptopModel) => {
    setSelectedModel(model);
    setSelectedVariant(null);
    setSelectedColor(null);
    setPhoneModels([]);
    setLaptopModels([]);

    try {
      if (deviceType === 'phone') {
        const response = await api.get(`/devices/phones/${model.id}/variants`);
        setVariants(response.data);
      } else {
        const response = await api.get(`/devices/laptops/${model.id}/variants`);
        setVariants(response.data);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  // Handle variant selection (storage for phones, RAM/storage for laptops)
  const handleVariantSelect = async (variant: PhoneVariant | LaptopVariant) => {
    setSelectedVariant(variant);
    setSelectedColor(null);

    if (deviceType === 'phone') {
      try {
        const response = await api.get(`/devices/phones/variants/${variant.id}/colors`);
        setColors(response.data);
      } catch (error) {
        console.error('Error fetching colors:', error);
      }
    } else {
      // For laptops, we're done - fetch specification
      await fetchLaptopSpecification(variant.id);
    }
  };

  // Handle color selection (phones only)
  const handleColorSelect = async (color: PhoneColor) => {
    setSelectedColor(color);
    await fetchPhoneSpecification(color.id);
  };

  // Fetch phone specification
  const fetchPhoneSpecification = async (phoneColorId: number) => {
    try {
      const response = await api.get(`/devices/phones/colors/${phoneColorId}/specification`);
      setSpecification(response.data.full_specification);
    } catch (error) {
      console.error('Error fetching phone specification:', error);
    }
  };

  // Fetch laptop specification
  const fetchLaptopSpecification = async (laptopVariantId: number) => {
    try {
      const response = await api.get(`/devices/laptops/variants/${laptopVariantId}/specification`);
      setSpecification(response.data.full_specification);
    } catch (error) {
      console.error('Error fetching laptop specification:', error);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    const qty = Math.max(1, Math.min(50, newQuantity));
    setQuantity(qty);
    
    // Adjust identifiers array
    const newIdentifiers = Array(qty).fill('').map((_, i) => identifiers[i] || '');
    setIdentifiers(newIdentifiers);
  };

  // Handle identifier change
  const handleIdentifierChange = (index: number, value: string) => {
    const newIdentifiers = [...identifiers];
    newIdentifiers[index] = value;
    setIdentifiers(newIdentifiers);
  };

  // Submit selection
  useEffect(() => {
    if (deviceType === 'phone' && selectedColor && specification) {
      onDeviceSelect({
        deviceType: 'phone',
        phone_color_id: selectedColor.id,
        specification,
        units: identifiers.map((imei) => ({ imei })),
      });
    } else if (deviceType === 'laptop' && selectedVariant && specification) {
      onDeviceSelect({
        deviceType: 'laptop',
        laptop_variant_id: selectedVariant.id,
        specification,
        units: identifiers.map((serial_number) => ({ serial_number })),
      });
    }
  }, [selectedColor, selectedVariant, specification, identifiers, deviceType, onDeviceSelect]);

  // Reset selection
  const handleReset = () => {
    setSelectedModel(null);
    setSelectedVariant(null);
    setSelectedColor(null);
    setVariants([]);
    setColors([]);
    setSpecification('');
    setSearchQuery('');
    setQuantity(1);
    setIdentifiers(['']);
  };

  const isPhoneVariant = (v: PhoneVariant | LaptopVariant): v is PhoneVariant => {
    return 'phone_model_id' in v;
  };

  const isLaptopVariant = (v: PhoneVariant | LaptopVariant): v is LaptopVariant => {
    return 'laptop_model_id' in v;
  };

  return (
    <div className="space-y-4">
      {/* Device Type Icon */}
      <div className="flex items-center gap-2 text-gray-700">
        {deviceType === 'phone' ? (
          <>
            <Smartphone className="w-5 h-5" />
            <span className="font-medium">Select Phone Model</span>
          </>
        ) : (
          <>
            <Laptop className="w-5 h-5" />
            <span className="font-medium">Select Laptop Model</span>
          </>
        )}
      </div>

      {/* Model Search */}
      {!selectedModel && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${deviceType === 'phone' ? 'phone' : 'laptop'} models...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Search Results Dropdown */}
          {(phoneModels.length > 0 || laptopModels.length > 0) && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {deviceType === 'phone' && phoneModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                >
                  <span className="font-medium">{model.display_name}</span>
                  <span className="text-sm text-gray-500">{model.brand}</span>
                </button>
              ))}
              {deviceType === 'laptop' && laptopModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  <div className="font-medium">{model.display_name}</div>
                  <div className="text-sm text-gray-500">{model.processor_type}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Model Display */}
      {selectedModel && (
        <div className="p-3 bg-blue-50 rounded-lg flex justify-between items-center">
          <div>
            <div className="font-medium text-blue-900">
              {'display_name' in selectedModel && selectedModel.display_name}
            </div>
            {deviceType === 'laptop' && 'processor_type' in selectedModel && (
              <div className="text-sm text-blue-700">{selectedModel.processor_type}</div>
            )}
          </div>
          <button onClick={handleReset} className="text-blue-600 hover:text-blue-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Variant Selection (Storage for phones, RAM/Storage for laptops) */}
      {selectedModel && variants.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {deviceType === 'phone' ? 'Storage' : 'Configuration'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {isPhoneVariant(variant) && variant.storage}
                  {isLaptopVariant(variant) && `${variant.ram} / ${variant.storage}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selection (Phones only) */}
      {deviceType === 'phone' && selectedVariant && colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor?.id === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color.color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Specification Display */}
      {specification && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm font-medium text-green-800 mb-1">Selected Device:</div>
          <div className="text-lg font-bold text-green-900">{specification}</div>
        </div>
      )}

      {/* Quantity Input */}
      {specification && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity (1-50 units)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* IMEI/Serial Number Inputs */}
      {specification && quantity > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {deviceType === 'phone' ? 'IMEI Numbers' : 'Serial Numbers'} *
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {identifiers.map((identifier, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => handleIdentifierChange(index, e.target.value)}
                  placeholder={deviceType === 'phone' ? 'Enter IMEI' : 'Enter Serial Number'}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Each unit must have a unique {deviceType === 'phone' ? 'IMEI' : 'serial number'}
          </p>
        </div>
      )}
    </div>
  );
}
