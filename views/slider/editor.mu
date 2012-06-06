<!DOCTYPE html>
<html>

	<head>
		<title>SliderIO Editor</title>

		<link href="/css/dark-hive/jquery-ui-1.8.20.custom.css" rel="stylesheet">
		<link href="/css/highlight/solarized_dark.min.css" rel="stylesheet">
		<link href="/css/style.css" rel="stylesheet">
		<link href="/css/font-awesome.css" rel="stylesheet">
		<link href="/css/editor.css" rel="stylesheet">
		
		<link href="sliderStyles.css" rel="stylesheet">
	</head>

	<body class="sliderCtn">

		<div id="mainConfigs">
		</div>
		<ul id="toolbox">
		</ul>
		<div id="slider-stage">
	  	<ul id="slider-list">
	  	</ul>
	  </div>
	  
	  <a href="#" class="icon-save vEditor" id="saveSlider">
	  </a>
	  <a href="#" class="icon-cog vEditor" id="configs">
	  </a>
	  <a href="#" class="icon-chevron-left" id="prevSlide">
	  </a>
	  <a href="#" class="icon-chevron-right" id="nextSlide">
		</a>
	  
	  <a href="#" class="actionSlide vEditor" id="insertLeft">
	  	<div class="icon-plus">
	  	</div>
	  	<div class="icon-arrow-up">
	  	</div>
	  </a>
	  <a href="#" class="actionSlide vEditor" id="deleteCurrent">
	  	<div class="icon-remove">
	  	</div>
	  	<div class="icon-arrow-down">
	  	</div>
	  </a>
	  <a href="#" class="actionSlide vEditor" id="insertRight">
	  	<div class="icon-arrow-up">
	  	</div>
	  	<div class="icon-plus">
	  	</div>
	  </a>

	<script type="text/javascript" src="/js/libs/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="/js/libs/jquery-ui-1.8.20.custom.min.js"></script>
	<script type="text/javascript" src="/js/libs/mustache.js"></script>
	<script type="text/javascript" src="/js/libs/highlight.min.js"></script>
	<script type="text/javascript" src="/js/libs/jquery.slider.js"></script>
	<script type="text/javascript" src="/js/editor/editor.js"></script>

	</body>
</html>
