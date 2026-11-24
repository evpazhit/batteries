
function devices()	{

	var tab = d3.select("#devlist");
	tab.selectAll('*').remove();

	Object.keys(devlist).forEach(k => {

		var row = tab.append('tr');
		var d = devlist[k];

		row.append('td').text(d.name);
		row.append('td').text(d.slots);
		row.append('td').text(k);

	});

	d3.select("#adddev button").on('click', () => {

		var name = to64(d3.select("#devname").property("value"));
		var slots = d3.select("#devslots").property("value");

		console.log(slots);

		fetch(`api/getcsv.php?f=add_todevices&siteid=${siteid}&slots=${slots}&name=${name}`)
		.then(res => res.text())
		.then(res => {

			load_data();

		});

	});

}

