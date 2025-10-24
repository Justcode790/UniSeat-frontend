// Seat rendering utilities for visualization

import jsPDF from 'jspdf';

// Render seat map as 2D grid
export const renderSeatMap = (assignments, classroomCapacity, classroomName) => {
  const columnsPerRow = Math.min(10, Math.ceil(Math.sqrt(classroomCapacity * 2)));
  const rows = Math.ceil(classroomCapacity / columnsPerRow);
  
  // Create seat grid
  const seatGrid = Array(rows).fill(null).map(() => Array(columnsPerRow).fill(null));
  
  // Fill occupied seats
  assignments.forEach(assignment => {
    const { row, col } = assignment;
    if (row <= rows && col <= columnsPerRow) {
      seatGrid[row - 1][col - 1] = assignment;
    }
  });
  
  return {
    seatGrid,
    rows,
    columns: columnsPerRow,
    classroomName
  };
};

// Export seat plan to PDF
export const exportSeatPlanToPDF = (seatPlan, examName) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(examName, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date(seatPlan.generatedAt).toLocaleDateString()}`, 20, 30);
  
  let yPosition = 50;
  
  // Group assignments by classroom
  const classroomGroups = {};
  seatPlan.assignments.forEach(assignment => {
    const classroomId = assignment.classroom._id;
    if (!classroomGroups[classroomId]) {
      classroomGroups[classroomId] = {
        classroom: assignment.classroom,
        block: assignment.block,
        floor: assignment.floor,
        assignments: []
      };
    }
    classroomGroups[classroomId].assignments.push(assignment);
  });
  
  // Add each classroom's seat plan
  Object.values(classroomGroups).forEach(group => {
    // Classroom header
    doc.setFontSize(14);
    doc.text(`${group.block.name} - Floor ${group.floor.number} - ${group.classroom.name}`, 20, yPosition);
    yPosition += 10;
    
    // Create seat grid for this classroom
    const { seatGrid, rows, columns } = renderSeatMap(
      group.assignments,
      group.classroom.capacity,
      group.classroom.name
    );
    
    // Draw seat grid
    const seatSize = 8;
    const startX = 20;
    const startY = yPosition;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = startX + (col * (seatSize + 2));
        const y = startY + (row * (seatSize + 2));
        
        const assignment = seatGrid[row][col];
        
        if (assignment) {
          // Occupied seat - green
          doc.setFillColor(34, 197, 94);
          doc.rect(x, y, seatSize, seatSize, 'F');
          
          // Seat number
          doc.setFontSize(6);
          doc.setTextColor(255, 255, 255);
          doc.text(assignment.seatNumber.toString(), x + 2, y + 5);
        } else {
          // Empty seat - gray
          doc.setFillColor(156, 163, 175);
          doc.rect(x, y, seatSize, seatSize, 'F');
        }
      }
    }
    
    yPosition += (rows * (seatSize + 2)) + 20;
    
    // Add new page if needed
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  // Save PDF
  doc.save(`seat-plan-${examName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

// Export seat plan to Excel
export const exportSeatPlanToExcel = (seatPlan, examName) => {
  const data = seatPlan.assignments.map(assignment => ({
    'Student Name': assignment.student.name,
    'Registration Number': assignment.student.regNumber,
    'Branch': assignment.student.branch,
    'Year': assignment.student.year,
    'Section': assignment.student.section,
    'Block': assignment.block.name,
    'Floor': assignment.floor.number,
    'Classroom': assignment.classroom.name,
    'Seat Number': assignment.seatNumber,
    'Row': assignment.row,
    'Column': assignment.col
  }));
  
  return data;
};

// Get seat status for visualization
export const getSeatStatus = (assignment, hoveredSeat) => {
  if (hoveredSeat && 
      hoveredSeat.classroomId === assignment.classroom._id && 
      hoveredSeat.seatNumber === assignment.seatNumber) {
    return 'hovered';
  }
  return assignment ? 'occupied' : 'empty';
};

// Calculate classroom statistics
export const calculateClassroomStats = (assignments) => {
  const stats = {};
  
  assignments.forEach(assignment => {
    const classroomId = assignment.classroom._id;
    if (!stats[classroomId]) {
      stats[classroomId] = {
        classroom: assignment.classroom,
        block: assignment.block,
        floor: assignment.floor,
        totalSeats: assignment.classroom.capacity,
        occupiedSeats: 0,
        students: []
      };
    }
    
    stats[classroomId].occupiedSeats++;
    stats[classroomId].students.push(assignment.student);
  });
  
  return Object.values(stats);
};
