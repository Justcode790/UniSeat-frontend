import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { floorsAPI } from '../api/api';

const ClassroomForm = ({ classroom, blocks, floors, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    block: classroom?.floor?.block?._id || '',
    floor: classroom?.floor?._id || '',
    name: classroom?.name || '',
    capacity: classroom?.capacity || 30,
    layoutType: classroom?.layoutType || 'standard',
    status: classroom?.status || 'available'
  });
  const [availableFloors, setAvailableFloors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.block) {
      fetchFloors();
    } else {
      setAvailableFloors([]);
      setFormData(prev => ({ ...prev, floor: '' }));
    }
  }, [formData.block]);

  const fetchFloors = async () => {
    try {
      const response = await floorsAPI.getByBlock(formData.block);
      setAvailableFloors(response.data.data);
    } catch (error) {
      console.error('Failed to fetch floors');
      setAvailableFloors([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'block') {
      // Reset floor when block changes
      setFormData({
        ...formData,
        block: value,
        floor: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'capacity' ? parseInt(value) : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {classroom ? 'Edit Classroom' : 'Create New Classroom'}
              </h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="block" className="block text-sm font-medium text-gray-700">
                  Block
                </label>
                <select
                  id="block"
                  name="block"
                  required
                  value={formData.block}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="">Select a block</option>
                  {blocks.map((block) => (
                    <option key={block._id} value={block._id}>
                      {block.name} - {block.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                  Floor
                </label>
                <select
                  id="floor"
                  name="floor"
                  required
                  value={formData.floor}
                  onChange={handleChange}
                  className="input-field mt-1"
                  disabled={!formData.block || availableFloors.length === 0}
                >
                  <option value="">Select a floor</option>
                  {availableFloors.map((floor) => (
                    <option key={floor._id} value={floor._id}>
                      Floor {floor.number}
                    </option>
                  ))}
                </select>
                {formData.block && availableFloors.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    No floors available for the selected block. Please create floors first.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Classroom Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="e.g., Room 101"
                />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  required
                  min="1"
                  max="200"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label htmlFor="layoutType" className="block text-sm font-medium text-gray-700">
                  Layout Type
                </label>
                <select
                  id="layoutType"
                  name="layoutType"
                  required
                  value={formData.layoutType}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="standard">Standard</option>
                  <option value="theater">Theater</option>
                  <option value="lab">Laboratory</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (classroom ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomForm;
