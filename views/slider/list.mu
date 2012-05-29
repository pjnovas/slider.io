<!doctype html>
<html class="no-js" lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  
  {{#title}}
  <title>{{title}}</title>
	{{/title}}
	{{^title}}
	<title>Untitled</title>
	{{/title}}
  
	<meta name="HandheldFriendly" content="True">
  <meta name="MobileOptimized" content="320">
  <meta name="viewport" content="width=device-width">

	<link href="/css/style.css" rel="stylesheet">  
</head>
<body>
  <header>
		<h1>Presentaciones</h1>
  </header>
  
  <ul>
  {{#sliders}}
  <li><a href="/slider/{{.}}">{{.}}</a></li>
	{{/sliders}}
  </ul>
  
  <footer></footer>
</body>
</html>