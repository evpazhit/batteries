
function boxes()	{

	var tab = d3.select("#boxlist");
	tab.selectAll('*').remove();

	Object.keys(boxlist).forEach(k => {
		
		var row = tab.append('tr');
		var b = boxlist[k];

		row.append('th').text(b.name);
		row.append('td').text(b.slots);
		row.append('td').text(k);
	
	});

	d3.select("#addbox button").on('click', () => {

		var name = to64(d3.select("#boxname").property("value"));
		var slots = d3.select("#slots").property("value");

		fetch(`api/getcsv.php?f=add_toboxes&siteid=${siteid}&name=${name}&slots=${slots}`)
		.then(res => res.text())
		.then(res => {

			load_data();

		});

	});

}

