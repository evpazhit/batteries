function use()	{

	var num = d3.select("#usenum");
	var sel = d3.select("#usedev");

	num.selectAll('*').remove();
	var l = num.append('label');
	l.append('input')
		.attr('type','radio')
		.attr('name','usenum')
		.property('value', 0)
		.property('checked', true);
	l.append('span').text('All');
	[...new Set(Object.keys(devlist).filter(d => ! usage[d]).map(d => devlist[d].slots))].sort().forEach(n => {

		var l = num.append('label');
		l.append('input')
		.attr('type','radio')
		.attr('name', 'usenum')
		.property('value', n);
		l.append('span').text(n);
	
	});		// unique number of slots


	function dropdown()	{

		sel.selectAll('*').remove();
		var filt = +num.select('input:checked').property('value');

		Object.keys(devlist).filter(d => (filt) ? devlist[d].slots === filt : ! usage[d]).forEach(k => {

			var d = devlist[k];
			sel.append('option').attr('value',k).text(`${d.name} (${d.slots})`);

		});

	}

	num.selectAll('input').on('change', (e) => {

		dropdown();
		drawtable();

	});
	dropdown();

	function drawtable()	{

		var tab = d3.select("#usetab");
		var accs = devlist[+sel.select("option:checked").property("value")].slots;		// number of slots in selected device
		var th = tab.select('thead');
		th.selectAll('*').remove();

		var tr = th.append('tr');
		for(i = 1; i <= accs; i++)
			tr.append('th').attr('colspan',3).text('Slot ' + i);
		tr.append('th').attr('rowspan',2).text('Delta');
		tr.append('th').attr('rowspan',2).text('Action');

		tr = th.append('tr');
		for(i = 1; i <= accs; i++)	{
			tr.append('th').text('AccId');
			tr.append('th').text('Box');
			tr.append('th').text('Capacity');
		}

		var actab = storage.map(k => ({ acc: k.acc, cap: k.cap }) ).sort( (a,b) => b.cap - a.cap );
		for(i = 0; i < actab.length - accs + 1; i++)	{

			actab[i].delta = actab[i].cap - actab[i+accs-1].cap;
			actab[i].pack = [];
			for(j = 1; j != accs; j++)
				actab[i].pack.push(actab[i+j]);

		}
		actab.sort( (a,b) => a.delta - b.delta );
		if(accs > 1)
			actab.splice( -(accs-1) );

		function boxtext(tr, b)	{

			tr.append('td').classed('accid', true).text(`${b.acc}`);
			tr.append('td').text(`${boxlist[accbox[b.acc].boxid].name} (${accbox[b.acc].slot})`);
			tr.append('td').text(`${b.cap}`);

		}
		
		var tb = tab.select('tbody');
		tb.selectAll('*').remove();
		actab.forEach( (a,i) => {

			var tr = tb.append('tr');
			boxtext(tr, a);
			a.pack.forEach(p => boxtext(tr,p));
			tr.append('td').classed('delta', true).text(a.delta);
			tr.append('td').append('button').attr('data-id', i).text('Put');

		});

		tb.selectAll('button').on('click', e => {
			var pack = actab[+e.target.dataset.id];
			var devid = sel.select("option:checked").property("value");
			var url = `api/getcsv.php?f=use_acc&siteid=${siteid}&devid=${devid}&accs=${pack.acc}`;
			pack.pack.forEach(p => url += `,${p.acc}`);
			fetch(url).then( () => {
				load_data();
			});

		});

	}
	drawtable();

	sel.on('change', () => drawtable());

}
