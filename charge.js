function charge()	{

	var st = d3.select("#storagetable");
	var th = st.select("thead");
	var inputs = d3.select("#charge fieldset");
	var bs = d3.select("#boxsel");

	th.selectAll('*').remove();

	var maxslots = Math.max(...Object.keys(boxlist).map(s => boxlist[s].slots), 0);

	th.append('th').text('Slot');
	for(i = 1; i <= maxslots; i++)
		th.append('th').text(i);

	st.select('tbody').selectAll('*').remove();
	Object.keys(boxlist).forEach( k => {

		var b = boxlist[k];
		var tr = st.select('tbody').append('tr');
		tr.append('th').text(b.name);

		for(i = 1; i <= b.slots; i++)
			tr.append('td').attr("id", `box-${k}-slot-${i}`).classed('free', true).text('-');

	});

	storage.forEach(s => {

		d3.select(`#box-${s.boxid}-slot-${s.slot}`).classed('free', false ).text(`${s.acc}: ${s.cap}`);

	});

	st.selectAll(".free").on('click', e => {
	
		var arr = e.target.attributes.id.nodeValue.split('-');
		var b = arr[1];
		var s = arr[3];
		console.log(b,s);
		console.log(inputs.select('option:checked'));
		inputs.select('option:checked').property('selected', false);
		inputs.select(`option[value="${b}"]`).property('selected', true);
		inputs.select('input[name="slot"]').property('value', s);
		
	});

	bs.selectAll('*').remove();
	Object.keys(boxlist).forEach(b => {
		bs.append('option').property('value', b).text(boxlist[b].name);
	});

	function error(text, s)	{

		d3.select("#chargeerror").text(text);
		d3.select(`#box-${s.boxid}-slot-${s.slot}`).classed('flash', true);
		
		d3.timeout( e => { 
			d3.select("#chargeerror").text("");
			d3.select(`#box-${s.boxid}-slot-${s.slot}`).classed('flash', false);
		}, 2000);

	}

	inputs.select("button").on('click', () => {

		var args = {};
		var boxid = bs.select("option:checked").property('value');
		inputs.selectAll("input").each( function() { args[this.name] = this.value } );

		var accind = storage.findIndex(s => s.acc == args['acc']);
		if(accind >= 0)	{

			var s = storage[accind];
			error("This acc is already in storage", s);
			return;

		}

		accind = storage.findIndex(s => s.boxid == boxid && s.slot == args['slot']);
		if(accind >= 0)	{
		
			var s = storage[accind];
			error("This istorage cell is busy", s);
			return;

		}

		var url = "api/getcsv.php?f=add_tostorage&siteid=" + siteid;
		url += '&boxid=' + boxid;
		Object.keys(args).forEach(k => url += `&${k}=${args[k]}`);

		fetch(url)
		.then(res => res.text())
		.then(res => {

			load_data();

		});

	});


}

