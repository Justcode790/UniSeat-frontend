import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Upload, Download } from 'lucide-react';
import { studentsAPI } from '../api/api';
import { isAdmin } from '../utils/helpers';
import toast from 'react-hot-toast';
import StudentUpload from '../components/StudentUpload';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    section: ''
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      const params = {};
      if (filters.branch) params.branch = filters.branch;
      if (filters.year) params.year = filters.year;
      if (filters.section) params.section = filters.section;

      const response = await studentsAPI.getAll(params);
      setStudents(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      const response = await studentsAPI.uploadCSV(file);
      toast.success(`Successfully uploaded ${response.data.count} students`);
      fetchStudents();
      setShowUpload(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload students');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentsAPI.delete(id);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const downloadTemplate = () => {
    const template = [
      'name,regNumber,branch,year,section,email',
      'John Doe,CSE1A001,CSE,1,A,john.doe@university.edu',
      'Jane Smith,CSE1A002,CSE,1,A,jane.smith@university.edu'
    ].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage student records and information
          </p>
        </div>
        {isAdmin(user) && (
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadTemplate}
              className="btn-secondary flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Template
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary flex items-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload CSV
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
              Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="input-field mt-1"
            >
              <option value="">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <select
              id="year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="input-field mt-1"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700">
              Section
            </label>
            <select
              id="section"
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              className="input-field mt-1"
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ branch: '', year: '', section: '' })}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {students.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600 mb-4">
            {Object.values(filters).some(f => f) 
              ? 'No students match your current filters.' 
              : 'Get started by uploading student data via CSV.'
            }
          </p>
          {isAdmin(user) && (
            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary"
            >
              Upload Students
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Student</th>
                  <th className="table-header">Registration Number</th>
                  <th className="table-header">Branch</th>
                  <th className="table-header">Year</th>
                  <th className="table-header">Section</th>
                  <th className="table-header">Email</th>
                  {isAdmin(user) && <th className="table-header">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-mono text-gray-900">
                        {student.regNumber}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.branch}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900">{student.year}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900">{student.section}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-600">{student.email || '-'}</span>
                    </td>
                    {isAdmin(user) && (
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete student"
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

      {/* Upload Modal */}
      {showUpload && (
        <StudentUpload
          onSubmit={handleUpload}
          onCancel={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};

export default Students;
