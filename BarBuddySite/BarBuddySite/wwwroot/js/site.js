$(document).ready(function () {
	categories_url = document.getElementById('defaultOpen2').value;
	navigator.geolocation.getCurrentPosition(function (position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		$('#rss_feed1').html('');
		select_NearMe(latitude, longitude, categories_url, 'bar');
	}, function (error) { console.error(error) });
	$(document).ajaxStart(function () {
		// Show image container
		$(".loading").css("display", "block");
		$(".article_img").css("display", "none");
	});
	$(document).ajaxComplete(function () {
		// Hide image container
		$(".loading").css("display", "none");
		$(".article_img").css("display", "block");
		$("#rss_feed1").scrollTop(0);
	});
});


$(function () {
	var btnContainer = document.getElementById("filters");
	// Get all buttons with class="btn" inside the container
	var btns = btnContainer.getElementsByClassName("btn_filter");
	var categories_url = document.getElementById('defaultOpen2').value;
	// Loop through the buttons and add the active class to the current/clicked button
	for (var i = 0; i < btns.length; i++) {
		btns[i].addEventListener("click", function () {
			$(document).ajaxStart(function () {
				// Show image container
				$("#loading").css("display", "block");
				$(".article_img").css("display", "none");
			});
			$(document).ajaxComplete(function () {
				// Hide image container
				$("#loading").css("display", "none");
				$(".article_img").css("display", "block");
				$("#rss_feed1").scrollTop(0);
			});
			var current = document.getElementsByClassName("active2");
			console.log(current);
			current[0].className = current[0].className.replace(" active2", "");
			this.className += " active2";
			var categories_url = this.value;
			$('#rss_feed1').html('');
			select_NearMe(latitude, longitude, categories_url, 'bar');

		});
	}
});

var location_url = '';
var categories_url = 'bars,danceclubs';
var term_url = '';
var longitude = 0;
var latitude = 0;
var offset = 0;


function select_NearMe(latitude, longitude, categories_url, term_url) {
	let myurl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?categories=${categories_url}&latitude=${latitude}&longitude=${longitude}&term=${term_url}`;

	//const client = yelp.client(apiKey);
	var settings = {
		'method': 'GET',
		'dataType': 'json',
		'url': myurl,
		'async': true,
		'crossDomain': true,
		'headers': {
			'Authorization': 'Bearer PHks1bNWPOT3-oOCm9S6D0wjvRgefp1Rk9Jef6GGkTv8eXm6ql_pbZaVuK4ubsfUrSDVO7nh0G1hJFR_357o8FnaBVIePs7UwS7ENJDIIzqelKvCI08IglS9o-GQXnYx',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}
	$.getJSON(settings, function (data) {
		var data = data.businesses;
		if (data.length < 1) {
			$('#rss_feed1').append('<p id="defaultSearchFeed>No Results Found</p>');
		}
		else {
			console.log("Success");
			$.each(data, function (index, value) {
				var x = data[index];
				var location = x.location;
				var nameSplit = value.name.split(" - ").join(" ");
				var googleMaps = nameSplit.replace(/ /, "+") + "+" + location.city.replace(" ", "+") + "+" + location.state;
				var phone = value.phone;
				if (phone == '') { phone = 'No Number Listed'; }
				else {
					phone = value.phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1 ($2) $3-$4");
				}
				var imageUrl = value.image_url;
				if (imageUrl == "") { imageUrl = '../Images/BarBuddyLogo.png'; }
				else { imageUrl = "'" + imageUrl + "'"; }


				console.log(typeof x);
				$('#rss_feed1').append(output_html(value.url, location.address1, location.state, location.city, location.zip_code, value.rating, value.name, googleMaps, phone, imageUrl));
			});
		}
	});
}

function output_html(url, address, state, city, zip, rating, name, maps, phone, imgUrl) {
	var output = '';
	output += '<article class="article_img"><a href="' + url + '"><div id="thumbnail"style="background:url(' + imgUrl + ');background-repeat:no-repeat;background-position:center;background-size:cover;"alt=""></div><div id="rsstitle"><h1 id ="headline">' + name + '</h1><div id="address"><a href="https://www.google.com/maps/place/' + maps + '" title="' + address + ' ' + city + ', ' + state + ' ' + zip + '">';
	output += '<img id="pin"></img><span id="addressSpan">' + address + ' ' + city + ', ' + state + ', ' + zip + '</span></a></div>';
	output += '<div id="phone"><img id="phone_icon"></img><span style="width:70%;text-overflow:ellipsis;white-space:nowrap;margin:0;position:absolute;top:50%;-ms-transform:translateY(-50%);transform:translateY(-50%);padding-right:10px;left:25%;overflow:hidden;"title="' + phone + '">' + phone + '</span>';
	output += '</div><ul id="AreYouGoing"><li>Are You Going?</li><li>Yes</li><li>No</li></ul></div><ul id="barInfo"><li>Status: ' + rating + '</li><li>Average Wait: </li><li>Cover: </li></ul>';
	output += '</a></img></article>';
	return output;
}


function select_Search(location_url, categories_url, term_url, offset) {
	let myurl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term_url}&categories=${categories_url}&location=${location_url}&offset=${offset}`;

	//const client = yelp.client(apiKey);
	var settings = {
		'method': 'GET',
		'dataType': 'json',
		'url': myurl,
		'async': true,
		'crossDomain': true,
		'headers': {
			'Authorization': 'Bearer PHks1bNWPOT3-oOCm9S6D0wjvRgefp1Rk9Jef6GGkTv8eXm6ql_pbZaVuK4ubsfUrSDVO7nh0G1hJFR_357o8FnaBVIePs7UwS7ENJDIIzqelKvCI08IglS9o-GQXnYx',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}

	$.getJSON(settings, function (data) {
		var data = data.businesses;
		if (data.length < 1) {
			$('#rss_feed2').append('<p id="defaultSearchFeed>No Results Found</p>');
		}
		else {
			if (data.length < 20) {
				document.getElementById('more_results').style.visibility = 'hidden';
			}
			else { document.getElementById('more_results').style.visibility = 'visible'; }
			console.log("Success");

			$.each(data, function (index, value) {
				var x = data[index];
				var location = x.location;
				var nameSplit = value.name.split(" - ").join(" ");
				var googleMaps = nameSplit.replace(/ /, "+") + "+" + location.city.replace(" ", "+") + "+" + location.state;
				var phone = value.phone;
				if (phone == '') { phone = 'No Number Listed'; }
				else {
					phone = value.phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1 ($2) $3-$4");
				}
				var imageUrl = value.image_url;
				if (imageUrl == "") { imageUrl = '../Images/BarBuddyLogo.png'; }
				else { imageUrl = "'" + imageUrl + "'"; }

				console.log(typeof x);
				$('#rss_feed2').append(output_html(value.url, location.address1, location.state, location.city, location.zip_code, value.rating, value.name, googleMaps, phone, imageUrl));
			});
		}
	});
}

function moreResults() {
	offset += 20;
	$('#rss_feed2').html('');
	select_Search(location_url, categories_url, term_url, offset);
	document.getElementById('less_results').style.visibility = 'visible';

}


function lessResults() {
	offset -= 20
	document.getElementById('more_results').style.visibility = 'visible';
	$('#rss_feed2').html('');
	select_Search(location_url, categories_url, term_url, offset)
	if (offset == 0) {
		document.getElementById('less_results').style.visibility = 'hidden';
	}
}


$(function () {
	var btn = document.getElementById("search_city_term");
	btn.addEventListener("click", function () {
		$(document).ajaxStart(function () {
			// Show image container
			$(".loading").css("display", "block");
			$(".article_img").css("display", "none");
		});
		$(document).ajaxComplete(function () {
			// Hide image container
			$(".loading").css("display", "none");
			$(".article_img").css("display", "block");
			$("#rss_feed2").scrollTop(0);
		});
		var new_location_url = document.getElementById('citySearchBar').value;
		var new_term_url = document.getElementById('termSearchBar').value;
		if (new_location_url == "") {
			alert("You need to enter a location in order to search");
		}
		else {
			if (new_term_url == "") {
				term_url = "";
				categories_url = "bars,danceclubs";
			}
			else {
				term_url = new_term_url.trim().replace(/, | /, "+");
				categories_url = "bars,danceclubs";
			}
			location_url = new_location_url.replace(/, | /g, "-");
			offset = 0;
			console.log(location_url);
			categories_url = 'bars,danceclubs'
			$('#rss_feed2').html('');
			select_Search(location_url, categories_url, term_url, offset);
			document.getElementById('more_results').style.visibility = 'hidden';
			document.getElementById('less_results').style.visibility = 'hidden';
		}

	});
});

function openTab(evt, tabtitle) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
		$(".loading").css("display", "none");
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabtitle).style.display = "block";
	evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();