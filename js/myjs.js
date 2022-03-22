
const searchField = $("#search-TextField");
const submitBtn = $("#submit-reset");
const checkInDate = $("#checkInDate");
const checkOutDate = $("#checkOutDate");
const roomsDrop = $("#rooms-DropDown");
const maxPriceText = $("#maxPrice");
const priceRange = $("#price-Range");
const propertyTypeDrop = $("#Property-Type-DropDown");
const guestRatingDrop = $("#Guest-Rating-DropDown");
const hotelLocationDrop = $("#Hotel-Location-DropDown");
const moreFiltersDrop = $("#More-Filters-DropDown");
const sortByDrop = $("#Sort-By-DropDown");
const hotelSection = $("#listing-hotels-section");
const hotelsAuto = $("#hotelsAuto");




var roomTypes = [];
var hotels = [];
var filteredHotels = [];
var autocompleteNames = [];
var maxPrice;
var propertyTypes = [];
var guestRatings = [];
var locations = [];
var filters = [];



var cityName;
var price;
var propertyType;
var guestRating;
var hotelLocation;
var filter;
var sortBy;


$(document).ready(function () {


    $.ajax({
        type: "GET",
        url: "json/data.json",
        datatype: "json"
    }).done((data) => StartApplication(data)).fail((errorObj) => ShowErrorPage(errorObj));


    function StartApplication(data) {



        roomTypes = data[0].roomtypes.map(x => x.name);
        roomTypes.sort();

        hotels = data[1].entries;
        var hotelNames = hotels.map(x => x.hotelName);

        autocompleteNames = [... new Set(hotelNames)];
        autocompleteNames.sort();


        maxPrice = hotels.reduce((max, hotel) => (max.price > hotel.price) ? max.price : hotel.price);

        var hotelTypes = hotels.map(x => x.rating);

        propertyTypes = [... new Set(hotelTypes)];
        propertyTypes.sort();


        var hotelsGuestRatings = hotels.map(x => x.ratings.text);
        guestRatings = [... new Set(hotelsGuestRatings)];


        var hotelLocations = hotels.map(x => x.city);

        locations = [...new Set(hotelLocations)];
        locations.sort();


        var hotelFilters = hotels.map(x => x.filters);
        var combinedFilters = [];

        for (var i = 0; i < hotelFilters.length; i++) {
            for (var j = 0; j < hotelFilters[i].length; j++) {

                combinedFilters.push(hotelFilters[i][j].name)
            }

        }

        combinedFilters.sort();

        filters = [... new Set(combinedFilters)];




        var autoCompleteElements = autocompleteNames.map(x => `<option value="${x}">`)
        hotelsAuto.append(autoCompleteElements);

        var roomTypeElements = roomTypes.map(x => ` <option value="${x}"> ${x}</option>`)
        roomsDrop.append(roomTypeElements);



        maxPriceText.html(`<span>max $${maxPrice}</span>`)

        priceRange.attr("max", maxPrice);
        priceRange.val(maxPrice);

        priceRange.on("input", function () {

            maxPriceText.html(`<span>max ${$(this).val()}</span>`);

        });


        propertyTypeDrop.prepend("<option value=''>All</option>");

        for (var i = 0; i < propertyTypes.length; i++) {

            switch (propertyTypes[i]) {
                case 5: propertyTypeDrop.append(` <option value="${propertyTypes[i]}">⭐⭐⭐⭐⭐</option>`); break;
                case 4: propertyTypeDrop.append(` <option value="${propertyTypes[i]}">⭐⭐⭐⭐</option>`); break;
                case 3: propertyTypeDrop.append(` <option value="${propertyTypes[i]}">⭐⭐⭐</option>`); break;
                case 2: propertyTypeDrop.append(` <option value="${propertyTypes[i]}">⭐⭐</option>`); break;
                case 1: propertyTypeDrop.append(` <option value="${propertyTypes[i]}">⭐</option>`); break;
                default: break;
            }

        }




        guestRatingDrop.prepend(` <option value="">All </option>`);

        for (var rating of guestRatings.sort()) {

            if (rating == "Okay") { guestRatingDrop.append(`<option value="${rating}">0 - 2 Okay</option>`) };
            if (rating == "Fair") { guestRatingDrop.append(`<option value="${rating}">2 – 6 Fair</option>`) };
            if (rating == "Good") { guestRatingDrop.append(`<option value="${rating}">6 – 7 Good</option>`) };
            if (rating == "Very Good") { guestRatingDrop.append(`<option value="${rating}">7 – 8.5 Very Good</option>`) };
            if (rating == "Excellent") { guestRatingDrop.append(`<option value="${rating}">8.5 – 10 Excellent</option>`) };
        }



        hotelLocationDrop.prepend(" <option value=''>All</option>");
        var locationElements = locations.map(x => `<option value="${x}">${x}</option>`);
        hotelLocationDrop.append(locationElements);



        moreFiltersDrop.prepend("<option value=''>All</option>");
        var filterElements = filters.map(x => `<option value="${x}">${x}</option>`);
        moreFiltersDrop.append(filterElements);





        //----------------------------------------------------------------------------------------//


        searchField.on("input", function () {

            cityName = $(this).val();
            Controller();
        });


        priceRange.on("input", function () {

            price = $(this).val();
            Controller();
        })


        propertyTypeDrop.on("input", function () {

            propertyType = $(this).val();
            Controller();
        });


        guestRatingDrop.on("input", function () {

            guestRating = $(this).val();
            Controller();
        });



        hotelLocationDrop.on("input", function () {

            hotelLocation = $(this).val();
            Controller();
        });

        moreFiltersDrop.on("input", function () {

            filter = $(this).val();
            Controller();
        });



        sortByDrop.on("input", function () {

            sortBy = $(this).val();
            Controller();
        });



        submitBtn.on("input", function () {


            Controller();
        });


        cityName = searchField.val();
        price = priceRange.val();
        propertyType = propertyTypeDrop.val();
        guestRating = guestRatingDrop.val();
        hotelLocation = hotelLocationDrop.val();
        filter = moreFiltersDrop.val();
        sortBy = sortByDrop.val();




        //============== Controller ==============//


        function Controller() {
            filteredHotels = hotels;

            if (cityName) {

                
                filteredHotels = filteredHotels.filter(x => x.hotelName.toUpperCase().includes(cityName.toUpperCase()));
            }


            if (price) {

               
                filteredHotels = filteredHotels.filter(x => x.price <= price);
            }


            if (propertyType) {
                filteredHotels = filteredHotels.filter(x => x.rating == propertyType);
            }

            if (guestRating) {

                filteredHotels = filteredHotels.filter(x => x.ratings.text == guestRating);
            }


            if (hotelLocation) {

                filteredHotels = filteredHotels.filter(x => x.city == hotelLocation);
            }


            if (filter) {
                filteredHotels = filteredHotels.filter(x => x.filters.some(y => y.name == filter));
            }



            // sort ////
            if (sortBy) {


                switch (sortBy) {
                    case "nameAsc": filteredHotels.sort((a, b) => a.hotelName > b.hotelName ? -1 : 1); break;
                    case "nameDesc": filteredHotels.sort((a, b) => a.hotelName > b.hotelName ? -1 : 1); break;
                    case "cityAsc": filteredHotels.sort((a, b) => a.city < b.city ? -1 : 1); break;
                    case "cityDesc": filteredHotels.sort((a, b) => a.city > b.city ? -1 : 1); break;
                    case "priceAsc": filteredHotels.sort((a, b) => a.price - b.price ); break;
                    case "priceDesc": filteredHotels.sort((a, b) => b.price - a.price); break;
                    default: filteredHotels.sort((a, b) => a.hotelName > b.hotelName ? -1 : 1); break;
                }
            }





            hotelSection.empty();

            if (filteredHotels.length > 0) {
                filteredHotels.forEach(ViewHotels);
            }
            else {
                ViewNoMoreHotels();
            }


           
        }


        // ============= View ==============//





        function ViewHotels(hotel) {

            var element = ` 
                            <div class="hotel-card">
                <div class="photo" style="background-image: url('${hotel.thumbnail}'); background-position: center">
                    <i class="fa fa-heart"></i>
                    <span>1/30</span>
                </div>

                <div class="details">
                    <h3>${hotel.hotelName}</h3>
                    <div class="rating" style="display:inline">
                        <div>
                         ${RatingStars(hotel.rating)}
                        </div>
                        Hotel
                    </div>
                    <div class="location">
                       ${hotel.city}
                    </div>

                    <div class="reviews">
                        <span class="total">${hotel.ratings.no.toFixed(1)}</span>
                        <b>${hotel.ratings.text}</b>
                        <small>(1736 reviews)</small>
                    </div>

                    <div class="location-reviews">
                        Excellent location <small>( 9.2 / 10 )</small>
                    </div>
                </div>


                <div class="third-party-prices">
                    <div class="sites-and-prices">
                        <div class="highlighted">
                            Hotel Website
                            <strong>$706</strong>
                        </div>
                        <div>
                            Agoda
                            <strong>$575</strong>
                        </div>
                        <div>
                            Travelocity
                            <strong>$708</strong>
                        </div>
                    </div>

                    <div class="more-deals">
                        <strong>More deals from</strong>
                        <strong>$575</strong>
                    </div>

                </div>

                <div class="call-to-action">
                    <div class="price">
                        <div class="before-discount">
                            HotelPower.Com
                            <strong><s>$${(hotel.price * 1.2).toFixed(0)}</s></strong>
                        </div>

                        <div class="after-discount">
                            Travelocity
                            <strong>$${hotel.price}</strong>
                            <div class="total">
                                3 nights for <strong>$${hotel.price * 3}</strong>
                            </div>

                            <div class="usp">
                                ${hotel.filters.map(x => ` <span>${x.name}</span>`)}
                               
                            </div>

                        </div>


                        <div class="button">
                            <a href="#">View Deal</a>
                        </div>
                    </div>
                </div>
            </div>

              `;

            hotelSection.append(element);

        };

        function RatingStars(rating) {

            var eles = ""

            for (let i = 0; i < rating; i++) {
                eles += `<span class="fa fa-star"></span>` + " ";
            }

            return eles;
        }

        function ViewNoMoreHotels() {
             var noMoreHotelsElement = `<br/><h1>No hotels were found</h1><br/>`;
            hotelSection.append(noMoreHotelsElement);
           
        }

    }

    function ShowErrorPage(errorObj) {
       
        
        console.log(errorObj.status);
        console.log(errorObj.statusText);

        if (errorObj.status == 200) {
            var isJson = true;

            try {
                var json = $.parseJSON(errorObj.responseText);
            }

            catch (err) {
                isJson = false;
                var noMoreHotelsElement = `<br/><h1>Not Valid JSON Format </h1><br/>`;
            }
        }
        else {
            var noMoreHotelsElement = `<br/><h1>${errorObj.status} ----- ${errorObj.statusText} </h1><br/>`;
        }

        hotelSection.append(noMoreHotelsElement);
    }


   

});


