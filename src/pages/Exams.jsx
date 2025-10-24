import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen, Play, Eye } from 'lucide-react';
import { examsAPI, seatPlansAPI } from '../api/api';
import { isAdmin, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingSeatPlan, setGeneratingSeatPlan] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examsAPI.getAll();
      setExams(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSeatPlan = async (examId) => {
    setGeneratingSeatPlan(examId);
    try {
      await seatPlansAPI.generate(examId);
      toast.success('Seat plan generated successfully');
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate seat plan');
    } finally {
      setGeneratingSeatPlan(null);
    }
  };

  const handleViewSeatPlan = (examId) => {
    navigate(`/visualization/${examId}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await examsAPI.delete(id);
        toast.success('Exam deleted successfully');
        fetchExams();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete exam');
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
          <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage examinations and seat plans
          </p>
        </div>
        {isAdmin(user) && (
          <button
            onClick={() => navigate('/exams/create')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Exam
          </button>
        )}
      </div>

      {/* Exams Grid */}
      {exams.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first examination.</p>
          {isAdmin(user) && (
            <button
              onClick={() => navigate('/exams/create')}
              className="btn-primary"
            >
              Create Exam
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exam.name}
                    </h3>
                    <p className="text-sm text-gray-600">{exam.subject}</p>
                  </div>
                </div>
                {isAdmin(user) && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(exam._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete exam"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(exam.date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Branch</span>
                    <span className="font-medium text-gray-900">{exam.branch}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium text-gray-900">{exam.year}</span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  {isAdmin(user) && (
                    <button
                      onClick={() => handleGenerateSeatPlan(exam._id)}
                      disabled={generatingSeatPlan === exam._id}
                      className="flex-1 btn-primary flex items-center justify-center text-sm disabled:opacity-50"
                    >
                      {generatingSeatPlan === exam._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Generate Seats
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleViewSeatPlan(exam._id)}
                    className="flex-1 btn-secondary flex items-center justify-center text-sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exams;
