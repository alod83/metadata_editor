<?php
header('Content-Type: application/json');
error_reporting(E_ERROR | E_WARNING | E_PARSE);
//connection
include ("config.php");
$conn=openDB();
$request = $_REQUEST['request'];

switch($request) {

	case "displayDB":
		$result1=select($conn, "SELECT * FROM persons ORDER BY name_surname ASC");
		$result2=select($conn, "SELECT * FROM places ORDER BY original_name ASC");
		$result3=select($conn, "SELECT * FROM cho ORDER BY original_title ASC");
		$result=array();
		array_push($result, $result1);
		array_push($result, $result2);
		array_push($result, $result3);
		echo json_encode($result);
	break;

	case "searchRecord":
		$id = $_REQUEST['key_id'];
		$result=select($conn, "SELECT * FROM persons WHERE key_id='$id'");
		if ($result==null) {
			$result=select($conn, "SELECT * FROM places WHERE key_id='$id'");
		}
		if ($result==null) {
			$result=select($conn, "SELECT * FROM cho WHERE key_id='$id'");
		}
		echo json_encode($result);
	break;

	case "searchType":
		$type = $_REQUEST['type'];
		if ($type=="person") {
			$result=select($conn, "SELECT * FROM persons ORDER BY surname ASC");
			echo json_encode($result);
		}
		else if ($type=="place") {
			$result=select($conn, "SELECT * FROM places ORDER BY original_name ASC");
			echo json_encode($result);
		}
		else if ($type=="cho") {
			$result=select($conn, "SELECT * FROM cho ORDER BY original_title ASC");
			echo json_encode($result);
		}
	break;

	case "searchDB":
		$keywords = mysqli_real_escape_string($conn, $_REQUEST['keywords']);
		//echo ($keywords);
		$type = $_REQUEST['type'];
		if ($type=="person") {
			$result=select($conn, "SELECT * FROM persons WHERE name_surname='$keywords'");
			echo json_encode($result);
		}
		else if ($type=="place") {
			$result=select($conn, "SELECT * FROM places WHERE original_name='$keywords' OR english_name='$keywords'");
			echo json_encode($result);
		}
		else if ($type=="cho") {
			$result=select($conn, "SELECT * FROM cho WHERE original_title='$keywords' OR english_title='$keywords'");
			echo json_encode($result);
		}
		else if ($type=="all") {
			$result=select($conn, "SELECT * FROM (persons UNION ALL places) WHERE name_surname='$keywords' OR original_name='$keywords' OR english_name='$keywords'");
			echo json_encode($result);
		}
	break;

	case "modify":
		//echo ($keywords);
		$type = $_REQUEST['type'];
		$id = $_REQUEST['key_id'];
		if ($type=="person") {
			$result=select($conn, "SELECT * FROM persons WHERE key_id='$id'");
			echo json_encode($result);
		}
		else if ($type=="place") {
			$result=select($conn, "SELECT * FROM places WHERE key_id='$id'");
			echo json_encode($result);
		}
		else if ($type=="cho") {
			$result=select($conn, "SELECT * FROM cho WHERE key_id='$id'");
			echo json_encode($result);
		}
	break;

	case "wiki_person":
		$keys=[];
		$nomepersona = $_REQUEST['nomepersona'];
		$cognomepersona = $_REQUEST['cognomepersona'];
		if($nomepersona!="" && $cognomepersona!="") {
			$nomecompleto = $nomepersona ."_". $cognomepersona;
			$nomecompleto = str_replace(' ', '_', $nomecompleto);
			$nomecompleto = str_replace("'", '%27', $nomecompleto);
		}
		elseif ($nomepersona!="" && $cognomepersona=="") {
			$nomecompleto = $nomepersona;
		}
		elseif ($nomepersona=="" && $cognomepersona!="") {
			$nomecompleto = $cognomepersona;
		}

		$keys['a1-'.$nomecompleto]=$nomecompleto;
		$keys['a2-'.$cognomepersona]=$cognomepersona;

		//get VIAF id
		$query="http://viaf.org/viaf/AutoSuggest?query=$nomecompleto";
		$result = file_get_contents("$query");
		$json_viaf1 = json_decode($result);
		$json_viaf2 = $json_viaf1 ->result;
		if ($json_viaf2 !=null){
			$viaf_id=$json_viaf2[0]->viafid;
		}
		//check variations
		if ($viaf_id!=null) {
			//get variations
			$query="http://viaf.org/viaf/$viaf_id/rdf.xml";
			$result = file_get_contents("$query");
			$xml = new SimpleXMLElement("$result");
			$elements = $xml->xpath('/rdf:RDF/rdf:Description/schema:name[@xml:lang]');
			$i=0;
			$langarray=array();
			$namearray=array();
			$multilang=array();
			foreach ($elements as $element) {
				$att=$element->attributes('xml', TRUE)->lang;
				$namearray[$i]=(string)$element;
				$langarray[$i]=(string)$att;
				$multilang[$i]= array("lingua" =>(string)$att,
				"valore" =>(string)$element);
				$i++;
			}
			$variations=[];
			foreach ($multilang as $key => $value) {
				if ($value['lingua']=='en-US') {
					$variations['b-'.$value['valore']]=$value['valore'];
					if (str_word_count($value['valore'])>1) {
						$word=explode(' ',$value['valore']);
						$variations['d-'.$key.'-name']=$word[0];
						$variations['c-'.$key.'-surname']=$word[1];
					}
				};
			}
			foreach ($variations as $key => $value) {
				$keys[$key]=$value;
			};
		}

		$keys=array_unique($keys);
		ksort($keys);

		$results=[];
		foreach ($keys as $key => $value) {
			$query="SELECT DISTINCT ?person ?nome ?name ?wiki ?bio ?thumbedit ?viafedit ?birthedit ?birthplaceedit ?deathedit ?deathplaceedit
			WHERE {
				?person dbp:name ?name;
				foaf:name ?nome;
				foaf:isPrimaryTopicOf ?wiki;
				dbo:abstract ?bio .
				OPTIONAL {?person dbo:thumbnail ?thumbnail} .
				OPTIONAL {?person dbo:viafId ?viaf } .
				OPTIONAL {?person dbo:birthDate ?birth} .
				OPTIONAL {?person dbo:deathDate ?death} .
				OPTIONAL {?person dbp:birthPlace ?birthplace} .
				OPTIONAL {?person dbp:deathPlace ?deathplace} .
				FILTER (lang(?bio) = 'en')
				VALUES (?name) {('$value'@en)}.
				BIND (COALESCE(?thumbnail, '') AS ?thumbedit).
				BIND (COALESCE(?viaf, '') AS ?viafedit).
				BIND (COALESCE(?birth, '') AS ?birthedit).
				BIND (COALESCE(?death, '') AS ?deathedit).
				BIND (COALESCE(?birthplace, '') AS ?birthplaceedit).
				BIND (COALESCE(?deathplace, '') AS ?deathplaceedit).
			}
			LIMIT 2";

			$query = urlencode($query);
			error_reporting(0);
			$json_wiki = file_get_contents('http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='.$query.'%0D%0A&format=json&timeout=10000&debug=on');
			$json_wiki = json_decode ($json_wiki);
			if ($json_wiki != ''){
				$result = $json_wiki->results->bindings;
				$bpe=$result[0]->birthplaceedit->value;
				if (strpos($bpe, "http")!==false) {
					$bpe=substr($bpe, strlen("http://dbpedia.org/resource/"));
					$result[0]->birthplaceedit->value=$bpe;
				}
				$dpe=$result[0]->deathplaceedit->value;
				if (strpos($dpe, "http")!==false) {
					$dpe=substr($dpe, strlen("http://dbpedia.org/resource/"));
					$result[0]->deathplaceedit->value=$dpe;
				}

				$result = str_replace('[', '', $result);
				$result = str_replace(']', '', $result);
				foreach ($result as $key => $value) {
					array_push($results,$value);
				}
			}
			else{
				$results["check"]="CONNERROR";
				array_push($results,$result);
			}
		}

		echo json_encode($results);
	break;

	case "viaf_person":
		$name=$_REQUEST['name'];
		$surname=$_REQUEST['surname'];
		$name_surname=$name.'_'.$surname;
		$name_surname=str_replace(' ', '_', $name_surname);
		$name_surname=str_replace("'", '%27', $name_surname);
		$query="http://viaf.org/viaf/AutoSuggest?query=$name_surname";
		$result = file_get_contents("$query");
		$json_viaf1 = json_decode($result);
		$json_viaf2 = $json_viaf1 -> result;
		$results=array();
		if ($json_viaf2!="") {
			foreach ($json_viaf2 as $key => $value) {
				if ($value -> nametype == 'personal') {
					array_push($results, $value);
				}
			}
			echo json_encode($results);
		}
		else {
			echo json_encode(null);
		}
	break;

	case "variations";
		$viaf = $_REQUEST['viaf'];
		$query="http://viaf.org/viaf/$viaf/rdf.xml";
		$result = file_get_contents("$query");
		$xml = new SimpleXMLElement("$result");
		$elements = $xml->xpath('/rdf:RDF/rdf:Description/schema:name[@xml:lang]');
		$i=0;
		//$assoclang=array("lang", "value")
		$langarray=array();
		$namearray=array();
		$multilang=array();
		foreach ($elements as $element) {
			$att=$element->attributes('xml', TRUE)->lang;
			$namearray[$i]=(string)$element;
			$langarray[$i]=(string)$att;
			$multilang[$i]= array("lingua" =>(string)$att,
			"valore" =>(string)$element);
			$i++;
		}
		echo json_encode ($multilang);
	break;

	case "wiki_place" :
		$place = $_REQUEST['luogo'];
		$placeescaped = mysqli_real_escape_string($conn, $place);
		$placeedit = str_replace(' ', '_', $place);
		$placeedit = str_replace("'", '%27', $placeedit);

		$querygeonames='http://api.geonames.org/searchJSON?q='.$placeedit.'&maxRows=10&username=andre56';
		$json_geo = file_get_contents("$querygeonames");
		if ($json_geo != ''){
		//echo ($json_geo);
			$json = json_decode($json_geo, true);
			$results=$json["totalResultsCount"];
			if ($results==0){
				$result["check"]="EMPTY";
				echo json_encode($result);
			}
			else {
				$geonames=$json["geonames"];
				$placeedit=$geonames[0]["name"];
			}
		}
		else {
			$result["check"]="CONNERROR";
			echo json_encode($result);
		}

		//query a dbpedia
		$querywiki="SELECT ?oname ?name ?wiki ?est ?country ?region ?population ?lat ?long ?thumbnail ?sameas ?sameas2 WHERE {
		?place rdfs:label ?name;
		foaf:name ?oname;
		foaf:isPrimaryTopicOf ?wiki;
		geo:lat ?lat;
		geo:long ?long;
		owl:sameAs ?sameas;
		owl:sameAs ?sameas2;
		dbo:thumbnail ?thumbnail;
		dbo:country ?country;
		dbo:region ?region;
		dbo:populationTotal ?population;
		dbo:abstract ?est .
		FILTER (lang(?est) = 'en')
		VALUES ?name {'$placeedit'@en '$placeedit'@it}
		FILTER (regex(str(?sameas),'http://sws.geonames.org/*'))
		FILTER (regex(str(?sameas2),'http://it.dbpedia.org/*'))
		}
		LIMIT 2";

		$querywiki = urlencode($querywiki);
		error_reporting(0);
		$json_wiki = file_get_contents('http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='.$querywiki.'%0D%0A&format=json&timeout=10000&debug=on');
		$json_wiki = json_decode ($json_wiki);
		if ($json_wiki != ''){
			$result = $json_wiki->results->bindings;
			$reg=$result[0]->region->value;
			if (strpos($reg, "http")!==false) {
				$reg=substr($reg, strlen("http://dbpedia.org/resource/"));
				$result[0]->region->value=$reg;
			}
			$cou=$result[0]->country->value;
			if (strpos($cou, "http")!==false) {
				$cou=substr($cou, strlen("http://dbpedia.org/resource/"));
				$result[0]->country->value=$cou;
			}
			foreach ($result as $ris){
				$abs = $ris->est->value;
			}
			if ($abs == NULL){
				$result["check"]="EMPTY";
				$result = str_replace('[', '', $result);
				$result = str_replace(']', '', $result);
				echo json_encode($result);
			}
			else {
				$result = str_replace('[', '', $result);
				$result = str_replace(']', '', $result);
				echo json_encode($result);
			}
		}
		else{
			$result["check"]="CONNERROR";
			echo json_encode($result);
		}
	break;

	case "geonames" :
		$luogo = $_REQUEST['luogo'];
		$luogo = str_replace(' ', '_', $luogo);
		//query a geonames.org
		error_reporting(0);
		$querygeonames='http://api.geonames.org/searchJSON?q='.$luogo.'&maxRows=3&username=andre56';
		$json_geo = file_get_contents("$querygeonames");
		if ($json_geo != ''){
		//echo ($json_geo);
			$json = json_decode($json_geo, true);
			$results=$json["totalResultsCount"];
			if ($results ==0){
				$result["check"]="EMPTY";
				echo json_encode($result);
			}
			else{
				$geonames=$json["geonames"];
				echo json_encode($geonames);
			}
		}
		else{
			$result["check"]="CONNERROR";
			echo json_encode($result);
		}
			/*
				//$json_geo = json_encode($json_geo);
				$json_geo = str_replace(']}', ']', $json_geo);
				$json_geo = str_replace('{"totalResultsCount":', '', $json_geo);
				$json_geo = preg_replace('/^[0-9]+/', '', $json_geo);
				$json_geo = str_replace(',"geonames":', '', $json_geo);
				echo ($json_geo);
			*/
	break;

	case "google_place":
		$place = $_REQUEST['luogo'];
		$placeescaped = mysqli_real_escape_string($conn, $place);
		$placeedit = str_replace(' ', '_', $place);
		$placeedit = str_replace("'", '%27', $placeedit);

		$query="https://maps.googleapis.com/maps/api/place/autocomplete/json?input=$placeedit&types=(cities)&key=AIzaSyBagy-sRo9-EEKzXxA9LiHRFwFpKxtxqZM";
		$json=file_get_contents($query);
		$result=json_decode($json);
		$placeid=$result->predictions[0]->place_id;
		$query2="https://maps.googleapis.com/maps/api/place/details/json?placeid=$placeid&key=AIzaSyBagy-sRo9-EEKzXxA9LiHRFwFpKxtxqZM";
		$json2=file_get_contents($query2);
		$result2=json_decode($json2);
		echo json_encode($result2->result);
	break;

	case "get_cho":
		$author=$_REQUEST['name'];

		$result=select($conn, "SELECT * FROM cho WHERE author='$author'");
		echo json_encode($result);
	break;
}
//close connection
closeDB($conn);
?>
