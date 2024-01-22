jQuery(function ($) {
	$("#departureDate").datepicker({ dateFormat: "yy-mm-dd" });
	$("#returnDate").datepicker({ dateFormat: "yy-mm-dd" });
	$("#flight_offers_request_form").submit(function (event) {
		event.preventDefault();
		$("#response").html('');
		$.ajax({
			url: ajax_object.ajax_url,
			type: "post",
			dataType: 'JSON',
			data: $(this).serialize(),
		})
			.done(function (response) {
				var response = response.flight_offers;
				var content = '';
                
				content += '<p>' + response.meta.count + ' Flight offers from ' +
					$('#originLocationCode').val() +
					' to ' + $('#destinationLocationCode').val() +
					' departing on ' + $('#departureDate').val() +
					(($('#returnDate').val() !== '') ? (' and returning on ' + $('#returnDate').val()) : '') +
					' for ' + $('#adults').val() +
					' adult' + ($('#adults').val() > 1 ? 's.' : '.') +
					'</p>';

				content += '<table>';
				content += '<tr><th>ID</th><th>Departure Place</th><th>Departure Time</th><th>Arrival Place</th><th>Arrival Time</th><th>Flight No</th><th>Airline</th><th>Duration</th><th>Number of Stops</th><th>Total Price</th></tr>';
				$.each(response.data, function (idx, data) {
					var id = data.id;
					var currencyCode= data.price.currency;
					var totalAmount = data.price.total;
					var flightNumber = data.itineraries[0].segments[0].carrierCode + ' ' + data.itineraries[0].segments[0].number;

					var segment_count = 0;
					$.each(data.itineraries, function (idx, itinerary) {
						$.each(itinerary.segments, function (idx, segment) {
							var carrierCode = segment.carrierCode;
							var airline = response.dictionaries.carriers[carrierCode];

							var departure_from = segment.departure.iataCode;
							var departure_time = segment.departure.at;
							var arrival_at = segment.arrival.iataCode;
							var arrival_time = segment.arrival.at;
							var stops = segment.numberOfStops;
							var duration = segment.duration;

							// format the date and time
							departure_time = departure_time.replace('T', ' ');
							arrival_time = arrival_time.replace('T', ' ');

							// format the duration to hours and minutes
							var duration = duration.replace('PT', '');
							var duration = duration.replace('H', ' hours ');
							var duration = duration.replace('M', ' minutes');
							
							content += '<tr>';
							content += '<td>' + ((segment_count === 0) ? id : '') + '</td><td>';
							content += departure_from + '</td><td>' +
								departure_time + '</td><td>' +
								arrival_at + '</td><td>' +
								arrival_time + '</td><td>' +
								flightNumber + '</td><td>' +
								airline +
								'</td><td>' +
								duration + '</td>';
							//number of stops
							content += '<td>' + ((segment_count === 0) ? stops : '') + '</td>';
							content += '<td>' + ((segment_count === 0) ? currencyCode + ' ' + totalAmount : '') + '</td><td>';
							content += '</tr>';
							segment_count++;
						})
					})
				})
				content += '</table>';
				$('#response').html(content);
			})
			.fail(function (jqXHR, textStatus) {
				$("#response").html('<p>' + jqXHR.responseText + '</p>');
			})
	})
});