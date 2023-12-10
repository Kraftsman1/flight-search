<?php
function flight_offers_form()
{

    echo '<p>Look up flight deals.</p>';

    echo '<form id="flight_offers_request_form">';

    echo '<input type="hidden" name="action" value="get_flight_offers_action">';

    echo '<div class="row">';
    echo '<div class="form-group col-md align-items-start flex-column">';
    echo    '<label for="originLocationCode" class="d-inline-flex">From(Origin)</label>';
    echo    '<input type="text" placeholder="Origin Code" class="form-control" id="originLocationCode" name="originLocationCode" pattern="[A-Z]{3}" required>';
    echo    '</div>';
    echo  '<div class="form-group col-md align-items-start flex-column">';
    echo   '<label for="destinationLocationCode" class="d-inline-flex">To(Destination)</label>';
    echo    '<input type="text" placeholder="Destination Code" class="form-control" id="destinationLocationCode" name="destinationLocationCode" pattern="[A-Z]{3}" required>';
    echo  '</div>';
    echo '</div>';

    echo '<div class="row">';
    echo '<div class="form-group col-md align-items-start flex-column"> ';
    echo '<label for="departureDate" class="d-inline-flex">Depart</label> ';
    echo '<input type="" class="form-control" id="departureDate" name="departureDate" id="departureDate" required> ';
    echo '</div>';
    echo '<div class="form-group col-md align-items-start flex-column"> ';
    echo '<label for="returnDate" class="d-inline-flex">Return</label>' ;
    echo '<input type="" class="form-control" id="returnDate" name="returnDate" id="returnDate"> ';
    echo '</div>';
    echo '</div>';

    echo '<div>';
    echo 'No of Travelling Adults (required): ';
    echo '<input type="text" class="form-control" id="adults" name="adults" pattern="[0-9]+" required>';
    echo '</div>';

    echo '<p><button type="submit" value="Search">Search</button></p>';

    echo '</form>';

    echo '<div id="response"></div>';

}
