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
				var responseObj = $.parseJSON(response);
				var content = '';
				content += '<p>Flight offers from ' +
					$('#originLocationCode').val() +
					' to ' + $('#destinationLocationCode').val() +
					' departing on ' + $('#departureDate').val() +
					(($('#returnDate').val() !== '') ? (' and returning on ' + $('#returnDate').val()) : '') +
					' for ' + $('#adults').val() +
					' adult' + ($('#adults').val() > 1 ? 's.' : '.') +
					'</p>';

				// Display the total number of flights found
				if (responseObj.meta && responseObj.meta.count) {
					content += '<p>Total flights found: ' + responseObj.meta.count + '</p>';
				}
				content += '<table>';
				content += '<tr><th>ID</th><th>Departure Place</th><th>Departure Time</th><th>Arrival Place</th><th>Arrival Time</th><th>Flight No</th><th>Duration</th><th>Number of Stops</th><th>Total Price</th></tr>';
				$.each(responseObj.data, function (idx, data) {
					var id = data.id;
					var currencyCode= data.price.currency;
					var totalAmount = data.price.total;

					var segment_count = 0;
					$.each(data.itineraries, function (idx, itinerary) {
						$.each(itinerary.segments, function (idx, segment) {
							var departure_from = segment.departure.iataCode;
							var departure_time = segment.departure.at;
							var arrival_at = segment.arrival.iataCode;
							var arrival_time = segment.arrival.at;
							var carrierCode = segment.carrierCode;
							var number = segment.number;
							var stops = segment.numberOfStops;
							var duration = segment.duration;
							content += '<tr>';
							content += '<td>' + ((segment_count === 0) ? id : '') + '</td><td>';
							content += departure_from + '</td><td>' +
								departure_time + '</td><td>' +
								arrival_at + '</td><td>' +
								arrival_time + '</td><td>' +
								carrierCode + ' ' + number +
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

// // Function to fetch airline information using carrier codes
// function getAirlineInfo(carrierCode) {
//     return new Promise(function (resolve, reject) {
//         $.ajax({
//             url: ajax_object.ajax_url,
//             type: "post",
//             dataType: 'JSON',
//             data: {
//                 action: 'get_airline_info',
//                 carrierCode: carrierCode
//             }
//         })
//         .done(function (response) {
//             var responseObj = $.parseJSON(response);
//             resolve(responseObj.data.name); // Resolve the promise with airline name
//         })
//         .fail(function (jqXHR, textStatus) {
//             reject(jqXHR.responseText); // Reject the promise with error message
//         });
//     });
// }

// jQuery(function ($) {
//     $("#departureDate").datepicker({ dateFormat: "yy-mm-dd" });
//     $("#returnDate").datepicker({ dateFormat: "yy-mm-dd" });
//     $("#flight_offers_request_form").submit(function (event) {
//         event.preventDefault();
//         $("#response").html('');
//         $.ajax({
//             url: ajax_object.ajax_url,
//             type: "post",
//             dataType: 'JSON',
//             data: $(this).serialize(),
//         })
//         .done(async function (response) {
//             var responseObj = $.parseJSON(response);
//             var content = '';
//             content += '<p>Flight offers from ' +
//                 $('#originLocationCode').val() +
//                 ' to ' + $('#destinationLocationCode').val() +
//                 ' departing on ' + $('#departureDate').val() +
//                 (($('#returnDate').val() !== '') ? (' and returning on ' + $('#returnDate').val()) : '') +
//                 ' for ' + $('#adults').val() +
//                 ' adult' + ($('#adults').val() > 1 ? 's.' : '.') +
//                 '</p>';

//             // Display the total number of flights found
//             if (responseObj.meta && responseObj.meta.count) {
//                 content += '<p>Total flights found: ' + responseObj.meta.count + '</p>';
//             }
//             content += '<table>';
//             content += '<tr><th>ID</th><th>Departure Place</th><th>Departure Time</th><th>Arrival Place</th><th>Arrival Time</th><th>Flight No</th><th>Duration</th><th>Number of Stops</th><th>Total Price</th><th>Airline</th></tr>';
            
//             for (let data of responseObj.data) {
//                 var id = data.id;
//                 var currencyCode = data.price.currency;
//                 var totalAmount = data.price.total;

//                 var segment_count = 0;
//                 for (let itinerary of data.itineraries) {
//                     for (let segment of itinerary.segments) {
//                         var departure_from = segment.departure.iataCode;
//                         var departure_time = segment.departure.at;
//                         var arrival_at = segment.arrival.iataCode;
//                         var arrival_time = segment.arrival.at;
//                         var carrierCode = segment.carrierCode;
//                         var number = segment.number;
//                         var stops = segment.numberOfStops;
//                         var duration = segment.duration;

//                         // Fetch airline information for the carrier code asynchronously
//                         try {
//                             var airlineName = await getAirlineInfo(carrierCode);
//                         } catch (error) {
//                             console.error('Error fetching airline information:', error);
//                             var airlineName = 'Unknown'; // Default value for airline name in case of error
//                         }

//                         content += '<tr>';
//                         content += '<td>' + ((segment_count === 0) ? id : '') + '</td><td>';
//                         content += departure_from + '</td><td>' +
//                             departure_time + '</td><td>' +
//                             arrival_at + '</td><td>' +
//                             arrival_time + '</td><td>' +
//                             carrierCode + ' ' + number +
//                             '</td><td>' +
//                             duration + '</td>';
//                         // Number of stops
//                         content += '<td>' + ((segment_count === 0) ? stops : '') + '</td>';
//                         content += '<td>' + ((segment_count === 0) ? currencyCode + ' ' + totalAmount : '') + '</td>';
//                         content += '<td>' + ((segment_count === 0) ? airlineName : '') + '</td>'; // Airline name
//                         content += '</tr>';
//                         segment_count++;
//                     }
//                 }
//             }
//             content += '</table>';
//             $('#response').html(content);
//         })
//         .fail(function (jqXHR, textStatus) {
//             $("#response").html('<p>' + jqXHR.responseText + '</p>');
//         });
//     });
// });

