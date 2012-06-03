<!DOCTYPE html>
<html>

	<head>
		<title>SliderIO Editor</title>

		<link href="/css/dark-hive/jquery-ui-1.8.20.custom.css" rel="stylesheet">
		<link href="/css/highlight/solarized_dark.min.css" rel="stylesheet">
		<link href="/css/style.css" rel="stylesheet">
		<link href="/css/editor.css" rel="stylesheet">
		
		<link href="sliderStyles.css" rel="stylesheet">
	</head>

	<body class="ui-widget-content" style="border:none">
		<div id="wrapper">

			<div id="preview" class="sliderCtn">
				<ul id="toolbox">
				</ul>
				<div id="slider-stage">
			  	<ul id="slider-list">
			  	</ul>
			  </div>
			  <div id="screen-mode">
					<input type="radio" id="view-edit" name="mode" checked="checked"/><label for="view-edit">Edicion</label>
					<input type="radio" id="view-free" name="mode" /><label for="view-free">Preview</label>
				</div>
			  <a href="#" class="moveButtons vEditor" id="addField"></a>
			  <a href="#" class="moveButtons vEditor" id="configs"></a>
			  <a href="#" class="moveButtons" id="prevSlide">&lt;</a>
			  <a href="#" class="moveButtons" id="nextSlide">&gt;</a>
			  
			  <a href="#" class="insertSlide vEditor" id="insertLeft"></a>
			  <a href="#" class="deleteSlide vEditor" id="deleteCurrent"></a>
			  <a href="#" class="insertSlide vEditor" id="insertRight"></a>
			</div>

		</div>

	<script type="text/javascript" src="/js/libs/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="/js/libs/jquery-ui-1.8.20.custom.min.js"></script>
	<script type="text/javascript" src="/js/libs/mustache.js"></script>
	<script type="text/javascript" src="/js/libs/highlight.min.js"></script>
	<script type="text/javascript" src="/js/libs/jquery.slider.js"></script>
	<script type="text/javascript" src="/js/editor/editor.js"></script>

	</body>
</html>
