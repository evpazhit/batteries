function charge()	{

	var st = d3.select("#storagetable");

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
		console.log(url);

		fetch(url)
		.then(res => res.text())
		.then(res => {

			console.log(res);

		});

	});


}

