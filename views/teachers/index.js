'use strict';

function customersController($scope,$http) {

    //test data session
    var AvailableTimeSlots = [10, 11, 13, 14, 15, 16, 17, 18];
    //end of test data session

    $http.get("http://localhost:3000/api/teachers")
        .success(function(data, status, headers, config) {
            $scope.teachers = data;
        })
        .error(function (data, status, headers, config) {
            alert("error "+ status);
        });


    //fill the first column(e.g. 10am or 1pm) in each row of class schedule table
    function calculateFirstColumnData(rowIndex)
    {
        if (AvailableTimeSlots[rowIndex] < 12) {
            return "" + AvailableTimeSlots[rowIndex] + "am";
        }
        else if (AvailableTimeSlots[rowIndex] > 12) {
            return "" + AvailableTimeSlots[rowIndex] - 12 + "pm";
        }
        else
            return "12pm";
    }

    function addRowDataIntoTable(availableTimeSlots, rowIndex)
    {
        var row = {};
        row.time = [];
        var firstColData = calculateFirstColumnData(rowIndex);

        row.time.push(firstColData);
        for (var i = 0; i < 7; i++) {
            var matchFound = false;
            //put 7 data into a row
            for (var j = 0; j < availableTimeSlots.length; j++)
                if (AvailableTimeSlots[rowIndex] == availableTimeSlots[j].startHour &&
                    availableTimeSlots[j].weekday == i + 1) {
                    row.time.push("available");
                    matchFound = true;
                    break;
                }

            if (!matchFound)
                row.time.push("");

        }

        return row;
    }

    function findTheMatchedTeacherIndex(schedule)
    {
        for(var i=0; i<$scope.teachers.length; i++)
        {
            if(schedule.TeacherID == $scope.teachers[i].TeacherID)
                return i;
        }

        return -1;
    }

    var testData = {
        "TeacherID": 1001,
        "ClassID": 1000,
        "Availability": [
            {
                "StartTime": "9/20/2014 10:00:00 AM",
                "EndTime": "9/20/2014 11:00:00 AM",
                "Capacity": 20,
                "Occupancy": 8
            },
            {
                "StartTime": "9/10/2014 1:00:00 PM",
                "EndTime": "9/10/2014 2:00:00 PM",
                "Capacity": 15,
                "Occupancy": 10
            }
        ]
    };

    $scope.showScheduleTable =function(teacher){
        $http.get("http://localhost:3000/api/teacherschedule")
            .success(function (data, status, headers, config) {
                var teacherIndex = 0;

                for (var i = 0; i < $scope.teachers.length; i++) {
                    if (teacher.Name == $scope.teachers[i].Name) {
                        teacherIndex = i;
                        break;
                    }
                }
                $scope.teachers[teacherIndex].schedule = [];

                var availTimeArray = [];
                for (var j = 0; j < testData.Availability.length; j++) {
                    var tmpStartTime = new Date(Date.parse(testData.Availability[j].StartTime));
                    var tmpEndTime = new Date(Date.parse(testData.Availability[j].EndTime));
                    var timeSlot = {
                        "weekday": tmpStartTime.getDay(),
                        "startHour": tmpStartTime.getHours(),
                        "endHour": tmpEndTime.getHours()
                    };

                    availTimeArray.push(timeSlot);
                }


                //add available time slots into the table
                for (var k = 0; k < AvailableTimeSlots.length; k++) {   //row
                    $scope.teachers[teacherIndex].schedule.push(addRowDataIntoTable(availTimeArray, k));
                }
                //}


            })
            .error(function (data, status, headers, config) {
                alert("error " + status);
            });
    }
}