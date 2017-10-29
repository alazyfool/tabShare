<?php 
	// For Cross-Origin Resource Sharing
	header('Access-Control-Allow-Origin: *'); 

	// Getting Request Headers
	@$data = $_POST['links'];
	@$link = sanitize($_GET['link']);
	if($link == 'download')
	{
		$file = 'tabShare.zip';
		
		if (file_exists($file)) {
			// Setting Response Headers
			header('Content-Description: File Transfer');
			header('Content-Type: application/octet-stream');
			header('Content-Disposition: attachment; filename="'.basename($file).'"');
			header('Expires: 0');
			header('Cache-Control: must-revalidate');
			header('Pragma: public');
			header('Content-Length: ' . filesize($file));
			readfile($file);
			exit;
		}
	}
	else if($link == 'code')
	{
		header('Location: https://github.com/iampiyushgupta/tabShare');
	}
	$connection = mysqli_connect('hostname','username','password','dbname');
	if(isset($data) && !empty($data))
	{
		if($short = exists($data))
		{
			echo 'tabshare.tk/'.$short;
		}
		else
		{
			$randomString = '';
			//generate new string if the generated string is already present in database
			do
			{
				$randomString = generateRandomString();
			}
			while(exists($randomString) or $randomString == 'code' or $randomString == 'download');
			$query = mysqli_query($connection, "insert into map_data values('$randomString', '$data')");

			echo 'tabshare.tk/'.$randomString;
		}
		
	}
	else if(isset($link) && !empty($link))
	{
		$row = mysqli_fetch_array(mysqli_query($connection, "select data from map_data where link='$link'"));
		echo $row[0];
	}
	else
	{
		echo '<a href="./download" target="_blank">Download extension</a>';
	}

	function sanitize($data)
	{
	   $data = trim($data);
	   $data = stripslashes($data);
	   $data = htmlspecialchars($data);
	   return $data;
	}

	function exists($string)
	{
		global $connection;
		$result = mysqli_query($connection, "select link from map_data where link = '$string' or data = '$string'");
		echo mysqli_error($connection);
		$row = mysqli_fetch_array($result);
		if(isset($row[0]) && !empty($row[0]))
		{
			return $row[0];
		}
		else
		{
			return false;
		}
	}

	function generateRandomString()
	{
		$string = 'Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo5Pp6Qq7Rr8Ss9Tt0Uu1Vv2Ww3Xx4Yy5Zz6';
		return substr(str_shuffle($string), 1, 4);
	}
?>
