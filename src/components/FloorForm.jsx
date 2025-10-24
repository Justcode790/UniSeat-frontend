import React, { useState } from 'react';
import { X } from 'lucide-react';

const FloorForm = ({ floor, block, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    number: floor?.number || 1,
    totalClassrooms: floor?.totalClassrooms || 1
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value)
    });
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
                {floor ? 'Edit Floor' : 'Create New Floor'}
              </h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Block:</strong> {block?.name} - {block?.location}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total Floors:</strong> {block?.totalFloors}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                  Floor Number
                </label>
                <input
                  type="number"
                  id="number"
                  name="number"
                  required
                  min="1"
                  max={block?.totalFloors || 20}
                  value={formData.number}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be between 1 and {block?.totalFloors || 20}
                </p>
              </div>

              <div>
                <label htmlFor="totalClassrooms" className="block text-sm font-medium text-gray-700">
                  Total Classrooms
                </label>
                <input
                  type="number"
                  id="totalClassrooms"
                  name="totalClassrooms"
                  required
                  min="1"
                  max="50"
                  value={formData.totalClassrooms}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Number of classrooms on this floor
                </p>
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
                  {loading ? 'Saving...' : (floor ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorForm;
