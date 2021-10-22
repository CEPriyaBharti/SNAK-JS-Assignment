"use strict"
var api_url='https://www.googleapis.com/customsearch/v1/?key=AIzaSyD9LnX_oYjrY8lTD0qI_M5fWR1qlkbTpSE&cx=03da428ef5aa40128&q=';
var current_query="";
var current_request= {};
// function to get results from google custom search api
function get_results(search_item, start_index=1){
	// console.log(api_url+search_item+"&start="+start_index);
	fetch(api_url+search_item+"&start="+start_index, {
		method:'GET',
		headers:{
			'Content-Type':'application/json',
		},
	})
	.then(response => response.json())
	.then(data => {

		display_result_data(data["items"]);
		current_request=data['queries']['request'][0];
		current_query=data['searchTerms'];
		set_pagging_nav_links();
	})
	.catch((error) => {
		console.error('Error:', error);
	});

	// display_result_data(result["items"]);
	// current_request=result['queries']['request'][0];
	// current_query=current_request['searchTerms'];
	// set_pagging_nav_links();

}


// function to display result in html page
function display_result_data(items){

	// get web results and images container to add new items
	var web_result_list = document.getElementsByClassName('web_result_list')[0];
	var image_result_container = document.getElementsByClassName('image_result_container')[0];
	web_result_list.innerHTML="";
	image_result_container.innerHTML="";


	// appending items one by one in respected contianers
	items.forEach((item) =>{

		// create list item for single 
		var web_result_item = document.createElement("div");
		web_result_item.classList.add("web_result_item");

		// create link for web list item
		var web_link = document.createElement("a");
		web_link.href = item['link'];

		// create node for display link of search result item 
		var display_url = document.createElement("div");
		display_url.classList.add("display_url");
		display_url.appendChild(document.createTextNode(item['displayLink']));

		// create title node for search result item
		var title = document.createElement("div");
		title.classList.add("title");
		title.appendChild(document.createTextNode(item['title']));

		// wrap title and display link in anchor tag
		web_link.appendChild(display_url);
		web_link.appendChild(title);

		// create snippet node of search result item
		var description_snippet = document.createElement("div");
		description_snippet.classList.add("description_snippet");
		description_snippet.appendChild(document.createTextNode(item['snippet']));

		// wraping all items in single container
		web_result_item.appendChild(web_link);
		web_result_item.appendChild(description_snippet);

		// append single search result in list of search results
		web_result_list.appendChild(web_result_item);
		// console.log(item);

		// create and add image to images container
		try{
			var image_result_item = document.createElement("img");
			image_result_item.src = item['pagemap']['cse_thumbnail'][0]['src'];
			image_result_container.appendChild(image_result_item);
		}
		catch(err){
			//skip the block if item thumbnail is not present
		}

	});
}


function set_pagging_nav_links(){
	let pagging_items = document.getElementById('paging_navigator');
	let links = pagging_items.getElementsByTagName('a');
	// console.log(links);
	if (links.length){
		// console.log("this ",(parseInt(links[2].innerHTML)-1)*current_request['count']+1,current_request['startIndex']);
		if ((parseInt(links[2].innerHTML)-1)*current_request['count']+1===current_request['startIndex']){
			let first_link=links[0];
			pagging_items.removeChild(first_link);

			let next_link = document.createElement('a');
			next_link.href="";
			// console.log(current_value);
			next_link.innerHTML=parseInt(links[1].innerHTML)+1;
			pagging_items.appendChild(next_link);
	}
	if (((parseInt(links[0].innerHTML)-1)*current_request['count']+1===current_request['startIndex'])&&(links[0].innerHTML!=1)){
		let last_link=links[2];
		pagging_items.removeChild(last_link);

		let prev_link = document.createElement('a');
		prev_link.href="";
		// console.log(current_value);
		prev_link.innerHTML=parseInt(links[0].innerHTML)-1;
		pagging_items.insertBefore(prev_link, links[0])
	}
}
	else{
		pagging_items.innerHTML="";
		for(let i=1; i<4;i++){
			let link = document.createElement('a');
			link.href='';
			link.innerHTML=i;
			pagging_items.appendChild(link);		
		}
	}
	set_links_event();
}



// get search form 
const search_form = document.getElementById("search_form");

// Event listener to act when search button is clicked
search_form.addEventListener("submit", function(evt){
	evt.preventDefault();     // remove default behaviour of form submission

	var search_item = search_form.getElementsByTagName('input')[0].value; // getting user input

	// call get_results function if search_items is not empty
	if (search_item!==""){
		get_results(search_item);
	}
	
});


function set_links_event(){
	let pagging_items = document.getElementById('paging_navigator');
	let links = pagging_items.getElementsByTagName('a');
	if (links.length){
		// console.log(links);
		// links.forEach((link)=>
		for(let link of links){
			link.onclick=function(evt){
				evt.preventDefault();
				set_pagging_nav_links();
				let next_start_index=(parseInt(link.innerHTML)-1)*current_request['count']+1;
				// console.log(current_request);
				get_results(current_query,next_start_index);
			}
		}
		
	}
}