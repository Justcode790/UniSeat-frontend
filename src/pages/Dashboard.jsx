import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  School, 
  Users, 
  BookOpen, 
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { blocksAPI, classroomsAPI, studentsAPI, examsAPI } from '../api/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    blocks: 0,
    classrooms: 0,
    students: 0,
    exams: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blocksRes, classroomsRes, studentsRes, examsRes] = await Promise.all([
        blocksAPI.getAll(),
        classroomsAPI.getAll(),
        studentsAPI.getAll(),
        examsAPI.getAll()
      ]);

      setStats({
        blocks: blocksRes.data.count,
        classrooms: classroomsRes.data.count,
        students: studentsRes.data.count,
        exams: examsRes.data.count
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Blocks',
      value: stats.blocks,
      icon: Building2,
      color: 'bg-blue-500',
      link: '/blocks'
    },
    {
      title: 'Total Classrooms',
      value: stats.classrooms,
      icon: School,
      color: 'bg-green-500',
      link: '/classrooms'
    },
    {
      title: 'Total Students',
      value: stats.students,
      icon: Users,
      color: 'bg-purple-500',
      link: '/students'
    },
    {
      title: 'Total Exams',
      value: stats.exams,
      icon: BookOpen,
      color: 'bg-orange-500',
      link: '/exams'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Block',
      description: 'Add a new building block',
      icon: Building2,
      link: '/blocks',
      color: 'text-blue-600'
    },
    {
      title: 'Add Classroom',
      description: 'Create a new classroom',
      icon: School,
      link: '/classrooms',
      color: 'text-green-600'
    },
    {
      title: 'Upload Students',
      description: 'Import students via CSV',
      icon: Users,
      link: '/students',
      color: 'text-purple-600'
    },
    {
      title: 'Create Exam',
      description: 'Schedule a new examination',
      icon: BookOpen,
      link: '/exams',
      color: 'text-orange-600'
    }
  ];

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to UniSeat - University Examination Seat Generator
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center mb-2">
                  <Icon className={`h-5 w-5 ${action.color}`} />
                  <h3 className="ml-2 text-sm font-medium text-gray-900">
                    {action.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Connection</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Seat Generator</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Exams</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-600">No upcoming exams scheduled</p>
            <Link 
              to="/exams" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Create an exam →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
