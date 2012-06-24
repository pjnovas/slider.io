<!DOCTYPE html>
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

	<link href="/css/bootstrap.min.css" rel="stylesheet">
	<link href="/css/bootstrap-responsive.min.css" rel="stylesheet">
	<link href="/css/website.css" rel="stylesheet">  
</head>
<body>
	
	<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
      <div class="container">
        <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </a>
        <a class="brand" href="#">SliderIO</a>
        <div class="nav-collapse">
          <ul class="nav">
            <li class="active"><a href="#">Home</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

	<div class="container-fluid">
	  <div class="row-fluid">
	    <div class="span4" style="border-right: solid 1px silver;">
       	<h2>New Slider</h2>
  
			 	<form action="/slider/new" method="post" class="new-slider">
			  	<fieldset>
						<label for="name">Name</label>
						<input id="name" name="name" class="span10" type="text" placeholder="this will be in the URL"/>
						
						<label for="passcode">Passcode</label>
						<input id="passcode" name="passcode" class="span6" type="text" placeholder="secret for editing & speaker"/>
						
						<label for="titles">Title</label>
						<input id="title" name="title" type="text" class="span10" placeholder="title for presentation viewers"/>
						
						<label for="description">Description</label>
						<textarea id="description" name="description" class="input-xlarge span10" rows="3">
						</textarea>
						
						<input type="submit" value="Create!" class="btn btn-large btn-success offset2"> 
			  	</fieldset>
			  </form>
	    </div>
	    <div class="span8">
	    	<h2>Public Sliders</h2>
	      <ul id="sliderList">
			  {{#sliders}}
			  <li>
			  	<h3>{{.}} - <a href="/slider/{{.}}">viewer</a> 
				  	| <a href="/slider/{{.}}/solo">solo</a> 
				  	| <a href="/slider/{{.}}/speaker">speaker</a>
				  	| <a href="/slider/{{.}}/editor">editor</a>
				  	| <a target="_blank" href="/slider/{{.}}/offline">offline</a>
				  </h3>
				</li>
				{{/sliders}}
			  </ul>
	    </div>
	  </div>
	</div>
  
</body>
</html>