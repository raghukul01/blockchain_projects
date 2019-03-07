pragma solidity 0.5.1;

contract Course {
    
    address admin;
    address managerContract;
    address instructor;
    int courseNo;
    
    struct Marks {
        int midsem;
        int endsem;
        int attendance;
    }
    
    mapping (int => Marks) student;
    mapping (int => bool) isEnrolled;
    
    constructor(int c, address inst, address adm) public {
        admin = adm;
        managerContract = msg.sender;
        instructor = inst;
        courseNo = c;
    }
    
    function kill() public {
        //The admin has the right to kill the contract at any time.
        //Take care that no one else is able to kill the contract
        require(msg.sender == admin);
        selfdestructs(admin);
    }
    
    function enroll(int rollNo) public {
        //This function can only be called by the managerContract
        //Enroll a student in the course if not already registered
        require(msg.sender == managerContract);
        require(!isEnrolled[rollNo]);
        isEnrolled[rollNo] = true;
    }
    
    function markAttendance(int rollNo) public{
        //Only the instructor can mark the attendance
        //Increment the attendance variable by one
        //Make sure the student is enrolled in the course
        require(msg.sender == instructor);
        require(isEnrolled[rollNo]);
        student[rollNo].attendance++;
    }
    
    function addMidSemMarks(int rollNo, int marks) public{
        //Only the instructor can add midsem marks
        //Make sure that the student is enrolled in the course
        require(msg.sender == instructor);
        require(isEnrolled[rollNo]);
        student[rollNo].midsem = marks;
    }
    
    function addEndSemMarks(int rollNo, int marks) public{
        //Only the instructor can add endsem marks
        //Make sure that the student is enrolled in the course
        require(msg.sender == instructor);
        require(isEnrolled[rollNo]);
        student[rollNo].endsem = marks;
    }  
    
    function getMidsemMarks(int rollNo) public view returns(int) {
        //Can only be called by the managerContract
        //return the midSem, endSem and attendance of the student
        //Make sure to check the student is enrolled
        require(msg.sender == managerContract);
        require(isEnrolled[rollNo]);
        return student[rollNo].midsem;
    }
    
    
    function getEndsemMarks(int rollNo) public view returns(int) {
        //Can only be called by the managerContract
        //return the midSem, endSem and attendance of the student
        //Make sure to check the student is enrolled
        require(msg.sender == managerContract);
        require(isEnrolled[rollNo]);
        return student[rollNo].endsem;
    }
    
    
    function getAttendance(int rollNo) public view returns(int) {
        //Can only be called by the managerContract
        //return the midSem, endSem and attendance of the student
        //Make sure to check the student is enrolled
        require(msg.sender == managerContract);
        require(isEnrolled[rollNo]);
        return student[rollNo].attendance;
    }
    
    function isEnroll(int rollNo) public view returns(bool){
        //Returns if a roll no. is enrolled in a particular course or not
        //Can be accessed by anyone
        return isEnrolled[rollNo];
    }
    
}
