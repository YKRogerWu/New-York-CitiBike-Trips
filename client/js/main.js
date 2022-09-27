// array for the "trips-table" to display, we will populate it later with a "fetch" call to our back end API
let tripData = {};

// object, we will populate it later once the user clicks on a specific trip within our UI
let currentTrip = {};

// This will keep track of the current page that the user is viewing.
let page = 1;

// trip items wished to view on each page of our application.
let perPage = 10;

// This will be a reference to our current "map", once it has been initialized.
let map = null;

//Lodash template
let tableRows = _.template(
    `<% _.forEach(tripData, function(tripData)` +
    `{ 
    %><tr data-id= <%- tripData._id %> class="<%- tripData.usertype %>"><%
    %><td><%- tripData.bikeid %></td><% 
    %><td><%- tripData['start station name'] %></td><% 
    %><td><%- tripData['end station name'] %></td><% 
    %><td><%- (tripData.tripduration/60).toFixed(2) %></td></tr><% 
}); %>`
);

function loadTripData() {

    fetch(`https://powerful-sands-97194.herokuapp.com/api/trips?page=${page}&perPage=${perPage}`)
        .then(response => {
            return response.json()
        }).then(data => {

            tripData = data
            let rows = tableRows({ tripData: data })

            //insert HTML to view page
            $("#trips-table tbody").html(rows)
            //display current page on pagination
            $("#current-page").html(page)
        })
}

$(function () {
    loadTripData();

    $("#trips-table tbody").on("click", 'tr', function (event) {
        let clickedId = $(this).attr("data-id");

        currentTrip = tripData.find(trip => {
            return trip._id === clickedId
        })

        $(".modal-title").html(`Trip Details (Bike: ${currentTrip.bikeid})`);
        
        $("#map-details").html(`
        <b>Start Location:</b> ${currentTrip['start station name']} </br>
        <b>End Location:</b> ${currentTrip["end station name"]}</br>
        <b>Duration:</b> ${(currentTrip.tripduration / 60).toFixed(2)}
            `);

        $("#trip-modal").modal({
            backdrop: "static", // stop user from clicking background to close the modal
            keyboard: false // stop user from hitting esc to close the modal
        });
    })


    // Page navigation
    $("#previous-page").on("click", function () {
        if (page > 1) {
            page--;
        }
        loadTripData();
    })

    $("#next-page").on("click", function () {
        page++;
        loadTripData();
    })

    //4. Construct map data when the modal window shows up
    $('#trip-modal').on('shown.bs.modal', function () {
        map = new L.Map('leaflet', {
            layers: [
                new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
        });

        let start = L.marker([currentTrip['start station location']['coordinates'][1], currentTrip['start station location']['coordinates'][0]])
            .bindTooltip(currentTrip['start station name'],
                {
                    permanent: true,
                    direction: 'right'
                }).addTo(map);

        let end = L.marker([currentTrip['end station location']['coordinates'][1], currentTrip['end station location']['coordinates'][0]])
            .bindTooltip(currentTrip['end station name'],
                {
                    permanent: true,
                    direction: 'right'
                }).addTo(map);

        var group = new L.featureGroup([start, end]);
        map.fitBounds(group.getBounds(), { padding: [60, 60] });
    });

    //5.Remove map data when closing modal window
    $('#trip-modal').on('hidden.bs.modal', function () { map.remove(); });

})

