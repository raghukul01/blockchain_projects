pragma solidity 0.5.1;
import "<location>/Course.sol";

contract Manager {
    //Address of the school administrator
    address admin;
    
    mapping (address => int) student;
    mapping (address => bool) isStudent;
    mapping (int => bool) isCourse;
    mapping (int => Course) course;
    
    int rollCount = 19111000;
    
    //Constructor
    constructor() public {
        admin = msg.sender;
    }
    
    
    function kill() public {
        //The admin has the right to kill the contract at any time.
        //Take care that no one else is able to kill the contract
        require(msg.sender == admin);
        selfdestructs(admin); // return the remaining ethers to admin
    }
    
    function addStudent() public {
        //Anyone on the network can become a student if not one already
        //Remember to assign the new student a unique roll number
        require(!isStudent[msg.sender]);
        student[msg.sender] = rollCount;
        isStudent[msg.sender] = true;

        rollCount++;
    }
    
    function addCourse(int courseNo, address instructor) public {
	    //Add a new course with course number as courseNo, and instructor at address instructor
        //Note that only the admin can add a new course. Also, don't create a new course if course already exists
        require(msg.sender == admin);
        require(!isCourse[courseNo]);
        course[courseNo] = Course(courseNo, instructor, admin);
        isCourse[courseNo] = true;
    }
    
    function regCourse(int courseNo) public {
        //Register the student in the course if he is a student on roll and the courseNo is valid
        require(isStudent[msg.sender]);
        require(isCourse[courseNo]);
        course[courseNo].enroll(student[msg.sender])
    }
    
    function getMyMarks(int courseNo) public view returns(int, int, int) {
        //Check the courseNo for validity
        //Should only work for valid students of that course
	    //Returns a tuple (midsem, endsem, attendance)
        require(isStudent[msg.sender]);
        require(isCourse[courseNo]);

        int rollNo = student[msg.sender];
        Course currCourse = course[courseNo];
        
        require(currCourse.isEnrolled(rollNo));
        
        int midsem, endsem, attendance;
        midsem = currCourse.getMidsemMarks(rollNo);
        endsem = currCourse.getEndsemMarks(rollNo);
        attendance = currCourse.getAttendance(rollNo);

        return (midsem, endsem, attendance);
    }
    
    function getMyRollNo() public view returns(int) {
        //Utility function to help a student if he/she forgets the roll number
        //Should only work for valid students
	    //Returns roll number as int
        require(isStudent[msg.sender]);
        return student[msg.sender];
    }
    
}
