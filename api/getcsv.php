<?php

header('Content-type: text/csv');
header("Cache-control: private");

foreach ($_GET as $k => $v)     {

	if(preg_match('/[^0-9a-z_-]/', $k) ||
		preg_match('/[^0-9A-Za-z =\/\-\+],/', $v))

	die("Oops: $k, $v");

}


$db = pg_pconnect("port=5432 host=localhost dbname=accs user=eugene password=Krevetka74")
	or die("could not connect to DB\n");

$rows = array();

if( preg_match('/^(get|add|del|use)/', $_GET['f']) )
	$_GET['f']();

echo implode($rows);



function get_sites()	{

	global $db, $rows;
	$rows = pg_copy_to($db, "(" . "select * from sites" . ")", chr(9));

}



function add_site()		{

	global $db, $rows;

	return (
		pg_fetch_row(
			pg_query_params($db, 'insert into sites(name) values($1) on conflict do nothing', array($_GET['name']))
		)[0]
	);

}

function del_box()	{

	global $db;
	$siteid = $_GET['siteid'];
	$boxid = $_GET['boxid'];

	pg_query_params($db, 'delete from boxes where siteid=$1 and boxid=$2', array($siteid, $boxid));

}

function get_storage()	{

	global $db, $rows;
	$siteid = $_GET['siteid'];

	$rows = pg_copy_to($db, "(" . "select accid,boxid,slot,flg,cap,date from storage where siteid=$siteid" . ")", chr(9));

}

function get_boxes()	{

	global $db, $rows;
	$siteid = $_GET['siteid'];

	$rows = pg_copy_to($db, "(" . "select boxid,slots,name from boxes where siteid=$siteid" . ")", chr(9));

}

function get_devices()	{

	global $db, $rows;
	$siteid = $_GET['siteid'];

	$rows = pg_copy_to($db, "(" . "select devid,name,slots from devices where siteid=$siteid" . ")", chr(9));

}

function add_tostorage()	{

	global $db, $rows;
	$siteid = $_GET['siteid'];
	$acc  = $_GET['acc'];
	$boxid = $_GET['boxid'];
	$slot = $_GET['slot'];
	$cap  = $_GET['cap'];
	$date = $_GET['date'];

	return (
		pg_fetch_row(
			pg_query_params($db, 'insert into storage(siteid,date,accid,slot,flg,cap,boxid)
				values($1,$2,$3,$4,1,$5,$6)', array($siteid,$date,$acc,$slot,$cap,$boxid))
		)[0]
	);

}

function add_toboxes()	{

	global $db, $rows;
	$siteid = $_GET['siteid'];
	$name = $_GET['name'];
	$slots = $_GET['slots'];

	return (
		pg_fetch_row(
			pg_query_params($db, 'insert into boxes(siteid,name,slots) values($1,$2,$3)', 
				array($siteid, $name, $slots))
		)[0]
	);

}

function add_todevices()	{

	global $db, $rows;
	$siteid = $_GET['siteid'];
	$name = $_GET['name'];
	$slots = $_GET['slots'];

	return (
		pg_fetch_row(
			pg_query_params($db, 'insert into devices(siteid,name,slots) values($1,$2,$3)', 
				array($siteid, $name, $slots))
		)[0]
	);

}

function use_acc()	{

	global $db;

	$siteid = $_GET['siteid'];
	$devid = $_GET['devid'];
	$accs = $_GET['accs'];

	pg_query($db, "begin");
	foreach(preg_split('/,/', $accs) as $acc)	{
		
		pg_query_params($db, 'insert into usage(siteid,date,devid,accid) values($1,CURRENT_DATE,$2,$3)',
			array($siteid, $devid, $acc));
		pg_query_params($db, 'insert into log(siteid,date,devid,accid,flg,cap) values($1,CURRENT_DATE,$2,$3::smallint,1,
			(select cap from storage where siteid=$1 and accid=$3)
			)',
			array($siteid, $devid, $acc));
		pg_query_params($db, 'delete from storage where siteid=$1 and accid=$2',
			array($siteid, $acc));

	}
	pg_query($db, "commit");

}

?>

