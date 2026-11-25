
function boxes()	{

	var tab = d3.select("#boxlist");
	tab.selectAll('*').remove();

	Object.keys(boxlist).forEach(k => {
		
		var row = tab.append('tr');
		var b = boxlist[k];
		var free = b.slots - storage.filter(s => s.boxid === k).length;

		row.append('th').text(b.name);
		row.append('td').text(b.slots);
		row.append('td').text(free);
		row.append('td').text(k);
		row.append('td').append('button').attr('data-id', k).property('disabled', b.slots !== free).text('Delete');
	
	});

	tab.selectAll('button').on('click', e => {
		var boxid = e.target.dataset.id;
		d3.select(e).property('disabled', true);
	
		fetch(`api/getcsv.php?f=del_box&siteid=${siteid}&boxid=${boxid}`)
		.then( () => load_data());
	
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

