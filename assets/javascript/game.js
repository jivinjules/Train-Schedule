$(document).ready(function () {

    //variable for current time
    var currentTime = moment();
    //displays current time on the jumbotron
    $('#current-time').html("The current time is: " + moment(currentTime).format("hh:mm"));

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCM0pBIJV0UIyJfD0g9Oz6MSFiXTvZNJA8",
        authDomain: "train-schedule-49930.firebaseapp.com",
        databaseURL: "https://train-schedule-49930.firebaseio.com",
        projectId: "train-schedule-49930",
        storageBucket: "train-schedule-49930.appspot.com",
        messagingSenderId: "169090128899"
    };
    firebase.initializeApp(config);


    //References firebase
    var database = firebase.database();

    //when the submit button is clicked, the data is grabbed and stored in firebase
    $("#submit-btn").on("click", function (event) {
        //don't refresh the page
        event.preventDefault();

        //code in logic for storing and retrieving the most recent information.

        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var timeInput = $("#time-input").val().trim();
        var frequency = $("#frequency-input").val().trim();

        //After the user submits the information, the fields go blank again

        $("#name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");

        //data is pushed to firebase database

        database.ref().push({
            name: name,
            destination: destination,
            time: timeInput,
            frequency: frequency
        });
    });

    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());


        //create new variables for clean build from childSnapshot of data from firebase

        var name = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var time = childSnapshot.val().time;
        var deleteTrain = "<button class='delete-button' id='deleteTrain' value='Delete' onclick='deleteRow(this)'>Delete?</button>"

        //Thank goodness we had this in our class activities!
        //Otherwise, I would be so lost. Anyway, I am converting the time of the train back a year so its before our current time
        var trainTimeConverted = moment(time, "hh:mm").subtract(1, "years");

        //finds out the time difference between when the train time and now
        var trainTimeDifference = moment().diff(moment(trainTimeConverted), "minutes");

        //checks to see how frequently the train comes and how much time is left

        var timeLeft = trainTimeDifference % frequency;

        //Now we figure out how many minutes until the next train comes
        var minutesToNextTrain = frequency - timeLeft;

        //Figure out when next Train comes
        var nextTrainMinutes = moment().add(minutesToNextTrain, "minutes");
        var nextTrainComes = moment(nextTrainMinutes).format("hh:mm");

        //Adding back to our table
        $('#train-table').prepend("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrainComes + "</td><td>" + minutesToNextTrain + "</td><td>" + deleteTrain + "</td></tr>");

        $("#deleteTrain").on("click", function () {

            $(this).closest("tr").remove();
            var survey = database.ref(path + '/' + path);
            survey.child(key).remove();

        });

    })



});