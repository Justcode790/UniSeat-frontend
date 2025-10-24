import React from 'react';
import { calculateSeatPosition, getSeatColor } from '../utils/helpers';

const SeatMap2D = ({ 
  assignments, 
  classroomCapacity, 
  classroomName, 
  onSeatHover 
}) => {
  const columnsPerRow = Math.min(10, Math.ceil(Math.sqrt(classroomCapacity * 2)));
  const rows = Math.ceil(classroomCapacity / columnsPerRow);

  // Create a map of seat assignments for quick lookup
  const seatMap = {};
  assignments.forEach(assignment => {
    if (assignment) {
      seatMap[assignment.seatNumber] = assignment;
    }
  });

  const handleSeatHover = (seatNumber, assignment) => {
    if (onSeatHover) {
      onSeatHover(assignment);
    }
  };

  const handleSeatLeave = () => {
    if (onSeatHover) {
      onSeatHover(null);
    }
  };

  const renderSeat = (seatNumber) => {
    const assignment = seatMap[seatNumber];
    const { row, col } = calculateSeatPosition(seatNumber, classroomCapacity);
    const isOccupied = !!assignment;

    return (
      <div
        key={seatNumber}
        className={`
          w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200
          ${getSeatColor(isOccupied)}
          ${isOccupied ? 'text-white hover:scale-105' : 'text-gray-600 hover:bg-gray-300'}
        `}
        onMouseEnter={() => handleSeatHover(seatNumber, assignment)}
        onMouseLeave={handleSeatLeave}
        title={
          assignment 
            ? `${assignment.student.name} (${assignment.student.regNumber})`
            : `Seat ${seatNumber} - Empty`
        }
      >
        {seatNumber}
      </div>
    );
  };

  const renderRow = (rowIndex) => {
    const startSeat = rowIndex * columnsPerRow + 1;
    const endSeat = Math.min(startSeat + columnsPerRow - 1, classroomCapacity);
    
    return (
      <div key={rowIndex} className="flex items-center space-x-1 mb-1">
        <div className="w-6 text-xs text-gray-500 text-right mr-2">
          {rowIndex + 1}
        </div>
        {Array.from({ length: columnsPerRow }, (_, colIndex) => {
          const seatNumber = startSeat + colIndex;
          if (seatNumber > classroomCapacity) {
            return <div key={colIndex} className="w-8 h-8" />;
          }
          return renderSeat(seatNumber);
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Classroom Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{classroomName}</h3>
        <p className="text-sm text-gray-600">
          Capacity: {classroomCapacity} seats | Layout: {rows} rows × {columnsPerRow} columns
        </p>
      </div>

      {/* Seat Map */}
      <div className="flex justify-center">
        <div className="bg-gray-50 p-4 rounded-lg">
          {/* Column Headers */}
          <div className="flex items-center mb-2">
            <div className="w-6 mr-2"></div>
            {Array.from({ length: columnsPerRow }, (_, colIndex) => (
              <div key={colIndex} className="w-8 text-xs text-gray-500 text-center">
                {colIndex + 1}
              </div>
            ))}
          </div>

          {/* Seat Grid */}
          <div className="space-y-1">
            {Array.from({ length: rows }, (_, rowIndex) => renderRow(rowIndex))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded mr-2"></div>
          <span className="text-gray-600">Empty Seat</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 border border-gray-300 rounded mr-2"></div>
          <span className="text-gray-600">Occupied Seat</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 border border-gray-300 rounded mr-2"></div>
          <span className="text-gray-600">Selected Seat</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{classroomCapacity}</div>
          <div className="text-sm text-gray-600">Total Seats</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{assignments.length}</div>
          <div className="text-sm text-gray-600">Occupied</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{classroomCapacity - assignments.length}</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
      </div>
    </div>
  );
};

export default SeatMap2D;
