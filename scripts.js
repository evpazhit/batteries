
var siteid=0;

var storage = [];
var boxlist = {};
var devlist = {};
var accbox  = {};	// storage placement
var usage   = {};

function main() {

	var sitelist = d3.select("#sitelist");
	var tabs = d3.select('#tabs').selectAll('input');

	fetch("api/getcsv.php?f=get_sites")
	.then(res => res.text())
	.then(res => {

		res.split('\n').forEach(s => {

			if(s.length === 0)
				return;

			var arr = s.split('\t');

			sitelist.append('option').property('value', arr[0]).text(arr[1]);

		});
		load_data();

	});

	sitelist.on('change', () => {

		load_data();

	});

	function hidetabs()	{

		tabs.each( function() { d3.select("#" + this.value).classed('hidden', !this.checked) } );

	}

	tabs.on('click', () => hidetabs());
	hidetabs();

}

function load_data()	{

	siteid = + d3.select("#sitelist").select("option:checked").property("value");

	boxlist = {};
	devlist = {};
	usage   = {};
	storage.length = 0;

	var proms = [];
	proms.push(fetch("api/getcsv.php?f=get_storage&siteid=" + siteid)
		.then( res => res.text() )
		.then( res => {

			var tab = d3.select("#storagetable");

			res.split('\n').forEach(s => {

				if(s.length === 0)
					return;

				var arr = s.split('\t');
				storage.push( {
					acc: arr[0],
					boxid: arr[1],
					slot: arr[2],
					flg: arr[3],
					cap: arr[4],
					date: new Date(arr[5])
				});

			});

			storage.map(s => accbox[s.acc] = s);

		})
	);

	proms.push(fetch("api/getcsv.php?f=get_boxes&siteid=" + siteid)
		.then( res => res.text() )
		.then( res => {

			res.split('\n').forEach(s => {

				if(s.length === 0)
					return;

				var arr = s.split('\t');
				boxlist[arr[0]] = {
					name: from64(arr[2]),
					slots: +arr[1]
				};

			});

		})
	);

	proms.push(fetch("api/getcsv.php?f=get_devices&siteid=" + siteid)
		.then(res => res.text())
		.then(res => {

			res.split('\n').forEach(s => {

				if(s.length === 0)
					return;

				var arr = s.split('\t');
				devlist[arr[0]] = {
					name: from64(arr[1]),
					slots: +arr[2]
				};

			});

		})
	);

	proms.push(fetch("api/getcsv.php?f=get_usage&siteid=" + siteid)
		.then(res => res.text())
		.then(res => {

			res.split('\n').forEach(s => {

				if(s.length === 0)
					return;

				var arr = s.split('\t');
				usage[arr[1]] ??= {
					date: arr[0],
					accs: []
				};
				usage[arr[1]].accs.push(arr[2]);

			});
			console.log(usage);

		})
	);


	Promise.all( proms )
	.then( () => {

		charge();
		boxes();
		devices();
		use();

	});

}


////// Utils

function to64(str)  {
	return btoa( String.fromCodePoint(...new TextEncoder().encode(str)));
}

function from64(str) {
	return new TextDecoder().decode(Uint8Array.from(atob(str), (m) => m.codePointAt(0)));
}


