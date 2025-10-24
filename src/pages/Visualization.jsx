import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Printer } from 'lucide-react';
import { seatPlansAPI } from '../api/api';
import { exportSeatPlanToPDF, exportSeatPlanToExcel, calculateClassroomStats } from '../utils/seatRenderer';
import { downloadCSV } from '../utils/helpers';
import toast from 'react-hot-toast';
import SeatMap2D from '../components/SeatMap2D';

const Visualization = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [seatPlan, setSeatPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  useEffect(() => {
    fetchSeatPlan();
  }, [examId]);

  const fetchSeatPlan = async () => {
    try {
      const response = await seatPlansAPI.getByExam(examId);
      setSeatPlan(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch seat plan');
      navigate('/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (seatPlan) {
      exportSeatPlanToPDF(seatPlan, seatPlan.exam.name);
      toast.success('PDF exported successfully');
    }
  };

  const handleExportExcel = () => {
    if (seatPlan) {
      const data = exportSeatPlanToExcel(seatPlan, seatPlan.exam.name);
      const csvContent = [
        'Student Name,Registration Number,Branch,Year,Section,Block,Floor,Classroom,Seat Number,Row,Column',
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      downloadCSV(csvContent, `seat-plan-${seatPlan.exam.name.replace(/\s+/g, '-').toLowerCase()}.csv`);
      toast.success('CSV exported successfully');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!seatPlan) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Seat plan not found</h3>
        <p className="text-gray-600 mb-4">The seat plan for this exam does not exist.</p>
        <button
          onClick={() => navigate('/exams')}
          className="btn-primary"
        >
          Back to Exams
        </button>
      </div>
    );
  }

  const classroomStats = calculateClassroomStats(seatPlan.assignments);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/exams')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {seatPlan.exam.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Seat Plan Visualization - Generated on {new Date(seatPlan.generatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportPDF}
            className="btn-secondary flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="btn-secondary flex items-center"
          >
            <FileText className="h-5 w-5 mr-2" />
            CSV
          </button>
          <button
            onClick={handlePrint}
            className="btn-primary flex items-center"
          >
            <Printer className="h-5 w-5 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Exam Info */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600">Subject</h3>
            <p className="text-lg font-semibold text-gray-900">{seatPlan.exam.subject}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Branch</h3>
            <p className="text-lg font-semibold text-gray-900">{seatPlan.exam.branch}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Year</h3>
            <p className="text-lg font-semibold text-gray-900">{seatPlan.exam.year}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
            <p className="text-lg font-semibold text-gray-900">{seatPlan.assignments.length}</p>
          </div>
        </div>
      </div>

      {/* Classroom Statistics */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Classroom Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classroomStats.map((stat, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">
                {stat.block.name} - Floor {stat.floor.number} - {stat.classroom.name}
              </h3>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{stat.totalSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupied:</span>
                  <span className="font-medium">{stat.occupiedSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium">{stat.totalSeats - stat.occupiedSeats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Maps */}
      <div className="space-y-6">
        {classroomStats.map((stat, index) => (
          <div key={index} className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {stat.block.name} - Floor {stat.floor.number} - {stat.classroom.name}
            </h2>
            <SeatMap2D
              assignments={stat.students.map(student => 
                seatPlan.assignments.find(a => a.student._id === student._id)
              )}
              classroomCapacity={stat.classroom.capacity}
              classroomName={stat.classroom.name}
              onSeatHover={setHoveredSeat}
            />
          </div>
        ))}
      </div>

      {/* Seat Info Panel */}
      {hoveredSeat && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-medium text-gray-900 mb-2">Seat Information</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Student:</span>
              <span className="font-medium">{hoveredSeat.student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reg Number:</span>
              <span className="font-medium">{hoveredSeat.student.regNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Branch:</span>
              <span className="font-medium">{hoveredSeat.student.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seat:</span>
              <span className="font-medium">{hoveredSeat.seatNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Position:</span>
              <span className="font-medium">Row {hoveredSeat.row}, Col {hoveredSeat.col}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualization;
