function charge()	{

	var st = d3.select("#storagetable");
	var th = st.select("thead");
	th.selectAll('*').remove();

	var maxslots = 0;

	console.log('bl', Object.keys(boxlist).length);

	if(Object.keys(boxlist).length > 1)
		maxslots = Object.keys(boxlist).reduce( (a,b) => { console.log('a b', a,b, boxlist[a].slots, boxlist[b].slots); return Math.max( boxlist[a].slots, boxlist[b].slots ); } );
	else if(Object.keys(boxlist).length === 1)
		maxslots = boxlist[Object.keys(boxlist)].slots;

	console.log('bl, msi, si', boxlist,maxslots, siteid);

	console.log('a', maxslots);
	th.append('th').text('Slot');
	console.log('b', maxslots);
	for(i = 1; i <= maxslots; i++)
		th.append('th').text(i);
	console.log('c', maxslots);

	st.select('tbody').selectAll('*').remove();
	Object.keys(boxlist).forEach( k => {

		var b = boxlist[k];
		var tr = st.select('tbody').append('tr');
		tr.append('th').text(b.name);

		for(i = 1; i <= b.slots; i++)
			tr.append('td').attr("id", `box-${k}-slot-${i}`).text('-');

	});

	storage.forEach(s => {

		d3.select(`#box-${s.boxid}-slot-${s.slot}`).text(`${s.acc}: ${s.cap}`);

	});



	var inputs = d3.select("#charge fieldset");
	var bs = d3.select("#boxsel");
	bs.selectAll('*').remove();
	Object.keys(boxlist).forEach(b => {
		bs.append('option').property('value', b).text(boxlist[b].name);
	});

	inputs.select("button").on('click', () => {

		var args = {};
		inputs.selectAll("input").each( function() { args[this.name] = this.value } );

		var url = "api/getcsv.php?f=add_tostorage&siteid=" + siteid;
		url += '&boxid=' + bs.select("option:checked").property('value');
		Object.keys(args).forEach(k => url += `&${k}=${args[k]}`);

		fetch(url)
		.then(res => res.text())
		.then(res => {

			load_data();

		});

	});


}

