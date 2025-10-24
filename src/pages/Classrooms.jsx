import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, School, Building2 } from 'lucide-react';
import { classroomsAPI, blocksAPI, floorsAPI } from '../api/api';
import { isAdmin } from '../utils/helpers';
import toast from 'react-hot-toast';
import ClassroomForm from '../components/ClassroomForm';

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classroomsRes, blocksRes] = await Promise.all([
        classroomsAPI.getAll(),
        blocksAPI.getAll(),
      ]);
      setClassrooms(classroomsRes.data.data);
      setBlocks(blocksRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (classroomData) => {
    try {
      await classroomsAPI.create(classroomData);
      toast.success('Classroom created successfully');
      fetchData();
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create classroom');
    }
  };

  const handleUpdate = async (id, classroomData) => {
    try {
      await classroomsAPI.update(id, classroomData);
      toast.success('Classroom updated successfully');
      fetchData();
      setEditingClassroom(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update classroom');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await classroomsAPI.delete(id);
        toast.success('Classroom deleted successfully');
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete classroom');
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
          <h1 className="text-2xl font-bold text-gray-900">Classrooms</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage classrooms and their configurations
          </p>
        </div>
        {isAdmin(user) && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Classroom
          </button>
        )}
      </div>

      {/* Classrooms Table */}
      {classrooms.length === 0 ? (
        <div className="card text-center py-12">
          <School className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classrooms found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first classroom.</p>
          {isAdmin(user) && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Classroom
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Classroom</th>
                  <th className="table-header">Block & Floor</th>
                  <th className="table-header">Capacity</th>
                  <th className="table-header">Layout</th>
                  <th className="table-header">Status</th>
                  {isAdmin(user) && <th className="table-header">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classrooms.map((classroom) => (
                  <tr key={classroom._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <School className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {classroom.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {classroom.floor?.block?.name} - Floor {classroom.floor?.number}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900">{classroom.capacity}</span>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {classroom.layoutType}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        classroom.status === 'available' 
                          ? 'bg-green-100 text-green-800'
                          : classroom.status === 'occupied'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {classroom.status}
                      </span>
                    </td>
                    {isAdmin(user) && (
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingClassroom(classroom)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit classroom"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(classroom._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete classroom"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Forms */}
      {showForm && (
        <ClassroomForm
          blocks={blocks}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingClassroom && (
        <ClassroomForm
          classroom={editingClassroom}
          blocks={blocks}
          onSubmit={(data) => handleUpdate(editingClassroom._id, data)}
          onCancel={() => setEditingClassroom(null)}
        />
      )}
    </div>
  );
};

export default Classrooms;
