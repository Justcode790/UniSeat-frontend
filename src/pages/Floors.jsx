import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, Building2 } from 'lucide-react';
import { floorsAPI, blocksAPI } from '../api/api';
import { isAdmin } from '../utils/helpers';
import toast from 'react-hot-toast';
import FloorForm from '../components/FloorForm';

const Floors = () => {
  const [floors, setFloors] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBlocks();
  }, []);

  useEffect(() => {
    if (selectedBlock) {
      fetchFloors();
    }
  }, [selectedBlock]);

  const fetchBlocks = async () => {
    try {
      const response = await blocksAPI.getAll();
      setBlocks(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedBlock(response.data.data[0]._id);
      }
    } catch (error) {
      toast.error('Failed to fetch blocks');
    }
  };

  const fetchFloors = async () => {
    if (!selectedBlock) return;
    
    try {
      const response = await floorsAPI.getByBlock(selectedBlock);
      console.log(response);
      setFloors(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch floors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (floorData) => {
    try {
      await floorsAPI.create(selectedBlock, floorData);
      toast.success('Floor created successfully');
      fetchFloors();
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create floor');
    }
  };

  const handleUpdate = async (id, floorData) => {
    try {
      await floorsAPI.update(id, floorData);
      toast.success('Floor updated successfully');
      fetchFloors();
      setEditingFloor(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update floor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this floor?')) {
      try {
        await floorsAPI.delete(id);
        toast.success('Floor deleted successfully');
        fetchFloors();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete floor');
      }
    }
  };

  const selectedBlockData = blocks.find(block => block._id === selectedBlock);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Floors</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage floors within building blocks
          </p>
        </div>
        {isAdmin(user) && selectedBlock && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Floor
          </button>
        )}
      </div>

      {/* Block Selector */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Building2 className="h-5 w-5 text-gray-400" />
          <div>
            <label htmlFor="block-select" className="block text-sm font-medium text-gray-700">
              Select Block
            </label>
            <select
              id="block-select"
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
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
        </div>
      </div>

      {/* Floors Grid */}
      {!selectedBlock ? (
        <div className="card text-center py-12">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a block</h3>
          <p className="text-gray-600">Choose a block to view and manage its floors.</p>
        </div>
      ) : floors.length === 0 ? (
        <div className="card text-center py-12">
          <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No floors found</h3>
          <p className="text-gray-600 mb-4">
            No floors have been created for {selectedBlockData?.name} yet.
          </p>
          {isAdmin(user) && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Floor
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {floors.map((floor) => (
            <div key={floor._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Layers className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Floor {floor.number}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedBlockData?.name}</p>
                  </div>
                </div>
                {isAdmin(user) && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingFloor(floor)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit floor"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(floor._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete floor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Classrooms</span>
                  <span className="font-medium text-gray-900">{floor.totalClassrooms}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">
                    {new Date(floor.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Forms */}
      {showForm && selectedBlock && (
        <FloorForm
          block={selectedBlockData}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingFloor && (
        <FloorForm
          floor={editingFloor}
          block={selectedBlockData}
          onSubmit={(data) => handleUpdate(editingFloor._id, data)}
          onCancel={() => setEditingFloor(null)}
        />
      )}
    </div>
  );
};

export default Floors;
