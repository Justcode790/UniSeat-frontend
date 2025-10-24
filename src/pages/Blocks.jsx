import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { blocksAPI } from '../api/api';
import { isAdmin } from '../utils/helpers';
import toast from 'react-hot-toast';
import BlockForm from '../components/BlockForm';

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const response = await blocksAPI.getAll();
      setBlocks(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch blocks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (blockData) => {
    try {
      await blocksAPI.create(blockData);
      toast.success('Block created successfully');
      fetchBlocks();
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create block');
    }
  };

  const handleUpdate = async (id, blockData) => {
    try {
      await blocksAPI.update(id, blockData);
      toast.success('Block updated successfully');
      fetchBlocks();
      setEditingBlock(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update block');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      try {
        await blocksAPI.delete(id);
        toast.success('Block deleted successfully');
        fetchBlocks();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete block');
      }
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Blocks</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage building blocks and their configurations
          </p>
        </div>
        {isAdmin(user) && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Block
          </button>
        )}
      </div>

      {/* Blocks Grid */}
      {blocks.length === 0 ? (
        <div className="card text-center py-12">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first building block.</p>
          {isAdmin(user) && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Block
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((block) => (
            <div key={block._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {block.name}
                    </h3>
                    <p className="text-sm text-gray-600">{block.location}</p>
                  </div>
                </div>
                {isAdmin(user) && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingBlock(block)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit block"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(block._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete block"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Floors</span>
                  <span className="font-medium text-gray-900">{block.totalFloors}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">
                    {new Date(block.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Forms */}
      {showForm && (
        <BlockForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBlock && (
        <BlockForm
          block={editingBlock}
          onSubmit={(data) => handleUpdate(editingBlock._id, data)}
          onCancel={() => setEditingBlock(null)}
        />
      )}
    </div>
  );
};

export default Blocks;
