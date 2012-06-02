<!DOCTYPE html>
<html>

	<head>
		<title>SliderIO Editor</title>

		<link href="/css/dark-hive/jquery-ui-1.8.20.custom.css" rel="stylesheet">
		<link href="/css/style.css" rel="stylesheet">
		<link href="/css/editor.css" rel="stylesheet">
		
	</head>

	<body class="ui-widget-content" style="border:none">
		<div id="wrapper">
<!--
			<ul id="slides-selector">
			</ul>

			<a href="#">Config</a>
-->
			<div id="preview">
				<ul id="toolbox"></ul>
				<div id="slider-stage">
			  	<ul id="slider-list"></ul>
			  </div>
			  <div id="screen-mode">
					<input type="radio" id="view-edit" name="mode" checked="checked"/><label for="view-edit">Edicion</label>
					<input type="radio" id="view-free" name="mode" /><label for="view-free">Libre</label>
				</div>
			  <a href="#" class="moveButtons vEditor" id="addField"><span>+</span></a>
			  <a href="#" class="moveButtons vEditor" id="configs">8</a>
			  <a href="#" class="moveButtons" id="prevSlide">&lt;</a>
			  <a href="#" class="moveButtons" id="nextSlide">&gt;</a>
			  
			  <a href="#" class="insertSlide vEditor" id="insertLeft">nuevo</a>
			  <a href="#" class="insertSlide vEditor" id="insertRight">nuevo</a>
			</div>
<!--
			<fieldset>

				<label for="titleImage">titleImage</label>
				<input id="titleImage" type="text">
				
				<label for="title">title</label>
				<input id="title" type="text">
				
				<label for="subTitle">subTitle</label>
				<input id="subTitle" type="text">

				<label for="topImage_url">topImage</label>
				<input id="topImage_url" type="text">
				<input id="topImage_size" type="text">

				<label for="bulletList">bulletList</label>
				<input id="bulletList" type="text">
				
				<label>code</label>
				<input id="cTitle" type="text">
				<input id="language" type="text">
				<input id="code" type="text">
				
				<label for="bottomImage_url">bottomImage</label>
				<input id="bottomImage_url" type="text">
				<input id="bottomImage_size" type="text">

			</fieldset>
-->
		</div>

	<script type="text/javascript" src="/js/libs/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="/js/libs/jquery-ui-1.8.20.custom.min.js"></script>
	<script type="text/javascript" src="/js/libs/mustache.js"></script>
	<script type="text/javascript" src="/js/libs/highlight.min.js"></script>
	<script type="text/javascript" src="/js/libs/jquery.slider.js"></script>
	<script type="text/javascript" src="/js/editor/editor.js"></script>

	</body>
</html>
