define([
        "dojo/_base/declare",
		"framework/PluginBase",
		"dojo/dnd/move",

		"esri/request",
		"esri/toolbars/draw",
		"esri/layers/FeatureLayer",
		"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/layers/ArcGISTiledMapServiceLayer",
		"esri/layers/ArcGISImageServiceLayer",
		"esri/layers/ImageServiceParameters",
		"esri/layers/MosaicRule",
		"esri/layers/RasterFunction",
		"esri/tasks/ImageServiceIdentifyTask",
		"esri/tasks/ImageServiceIdentifyParameters",
		"esri/tasks/QueryTask",
		"esri/tasks/query",
		"esri/graphicsUtils",
		"esri/graphic",
		"esri/symbols/SimpleLineSymbol",
		"esri/symbols/SimpleFillSymbol",
		"esri/symbols/SimpleMarkerSymbol",
		"esri/geometry/Extent",
		"esri/geometry/Polygon",
		"esri/geometry/Point",
		"esri/request",

		"dijit/registry",
		"dijit/form/Button",
		"dijit/form/MultiSelect",
		"dijit/form/DropDownButton",
		"dijit/DropDownMenu",
		"dijit/MenuItem",
		"dijit/layout/ContentPane",
		"dijit/layout/TabContainer",
		"dijit/form/HorizontalSlider",
		"dijit/form/CheckBox",
		"dijit/form/RadioButton",
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/_base/window",
		"dojo/dom-construct",
		"dojo/dom-attr",
		"dojo/dom-geometry",
		"dijit/Dialog",
		'dojox/layout/ResizeHandle',

		"dojox/charting/Chart",
		"dojox/charting/plot2d/Pie",
		"dojox/charting/action2d/Highlight",
        "dojox/charting/action2d/MoveSlice" ,
		"dojox/charting/action2d/Tooltip",
        "dojox/charting/themes/MiamiNice",
		"dojox/charting/widget/Legend",
		"dojox/lang/functional",

		"dojo/_base/Color",
		"dojo/html",
		"dojo/_base/array",
		"dojo/aspect",
		"dojo/_base/lang",
		'dojo/_base/json',
		"dojo/_base/window",
		"dojo/on",
		"dojo/parser",
		"dojo/query",
		"dojo/NodeList-traverse",
		"require",
		"dojo/text!./config.json"

       ],
       function (declare,
					PluginBase,
					move,
					ESRIRequest,
					Drawer,
					FeatureLayer,
					ArcGISDynamicMapServiceLayer,
					ArcGISTiledMapServiceLayer,
					ArcGISImageServiceLayer,
					ImageServiceParameters,
					MosaicRule,
					RasterFunction,
					ImageServiceIdentifyTask,
					ImageServiceIdentifyParameters,
					QueryTask,
					esriQuery,
					graphicsUtils,
					Graphic,
					SimpleLineSymbol,
					SimpleFillSymbol,
					SimpleMarkerSymbol,
					Extent,
					Polygon,
					Point,
					esriRequest,
					registry,
					Button,
					MultiSelect,
					DropDownButton,
					DropDownMenu,
					MenuItem,
					ContentPane,
					TabContainer,
					HorizontalSlider,
					CheckBox,
					RadioButton,
					dom,
					domClass,
					domStyle,
					win,
					domConstruct,
					domAttr,
					domGeom,
					Dialog,
					ResizeHandle,
					Chart,
					Pie,
					Highlight,
					MoveSlice,
					Tooltip,
					MiamiNice,
					Legend,
					dn,
					Color,
					html,
					array,
					aspect,
					lang,
					dJson,
					win,
					on,
					parser,
					dojoquery,
					NodeListtraverse,
					localrequire,
					fsconfigObject
					) {
						

	_fs_config = dojo.eval("[" + fsconfigObject + "]")[0];

	_infographic_fs = _fs_config.infoGraphic;
	//console.log(_infographic);

	if (_infographic_fs != undefined) {

		_infographic_fs = localrequire.toUrl("./" + _infographic_fs);

	}
	
	
	if (_fs_config.pluginWidth == undefined) {

		_fs_config.pluginWidth = 420;

	}	
	
	if (_fs_config.pluginHeight == undefined) {

		_fs_config.pluginHeight = 500;

	}	
	

	return declare(PluginBase, {
		toolbarName:  _fs_config.pluginName,
        toolbarType: "sidebar",
		showServiceLayersInLegend: true,
        allowIdentifyWhenActive: false,
		rendered: false,
		infoGraphic: _infographic_fs,
		width: _fs_config.pluginWidth,
		height: _fs_config.pluginHeight,

               activate: function () {
				
				//this.addrow();
				
					if (this.featureLayer == undefined) {
					
						this.featureLayer = new FeatureLayer(_fs_config.mapServer +"/" + 0,{
						  mode: FeatureLayer.MODE_SELECTION,
						  outFields: ["*"]
						});
						
						on(this.featureLayer, "load", lang.hitch(this,this.loadedLayer))
						on(this.featureLayer, "click", lang.hitch(this,this.doInfo));  
						
						this.map.graphics.remove(this.selectedGraphic);
						
						this.map.addLayer(this.featureLayer);
						
						this.addrow();
						
					}
					
					if (this.rendered == false) {
						this.render();
					}
					
			   },
			   
			   

			   
			   
			   doInfo: function(evt){
				
				this.map.graphics.remove(this.selectedGraphic);
				pt = new Point(evt.graphic.geometry.x,evt.graphic.geometry.y,this.map.spatialReference)				
				this.selectedGraphic = new Graphic(pt,this.pntSym);
				this.map.graphics.add(this.selectedGraphic);
				
							console.log(evt.graphic.attributes);
							
							//alert(evt.graphic.attributes["Project_Name"]);

							array.forEach(_fs_config.infos, lang.hitch(this,function(entry, i){
								
								HTMLOUT = "<span>"
								array.forEach(entry.fields, lang.hitch(this,function(field, i){
									
									outf = evt.graphic.attributes[field.field]
							
									if (field.field.indexOf("!") > -1) {
										outFields = field.field.split("!");
										
										outf = "";
										
										array.forEach(outFields, lang.hitch(this,function(part, i){
											
											if ((i%2) == 0) {

												outf = outf + part;
											} else {
												
												outf = outf + evt.graphic.attributes[part]
												
											}
											
											
										}));

									}
									
									if (outf == null) {outf = ""}
									if (outf == undefined) {outf = ""}
									
									outfs = outf + ""
									//console.log((outfs + "").slice(0,6));
									
									if (outfs.slice(0,6).indexOf("http") > -1) {
										
										if (outf[0] == "#") {
											outf = outf.replace("#","");
										}
										outf = "<a href='" + outf + "' target='_blank'>" + outf + "</a>"
									
									}			
									
									outimage = ""
									if (field.field.slice(0,6) == "images") {
										fieldtoUse = field.field.split("|")
										Aimages = _fs_config.images[evt.graphic.attributes[fieldtoUse[1]]];
										
										if (Aimages != undefined) {
												array.forEach(Aimages, lang.hitch(this,function(im, i){
													
													imlink = localrequire.toUrl("./" + _fs_config.images["urlbase"] + "/" + im)
													outimage = outimage + " <img src='" + imlink + "'>"
												
												}));
										}
											outf =  outimage
									}
									
									HTMLOUT = HTMLOUT + "<p style='margin-bottom:2px;'><b>" + field.name + "</b>: " + outf + "</p>"
									
								}));
								
								a = dom.byId(this.map.id + "_filterSelect_area_" + entry.name.replace(" ", "_").replace(" ", "_"));
								a.innerHTML = HTMLOUT + "</span>"
								//console.log(a);
								//html.set(node, cont, params);						
								
							}));							
						
						domStyle.set(this.tabloc, "visibility", "visible");						
		
						},
						
			   
			   loadedLayer: function(lay) {
				   
						var query = new esriQuery();
						query.where = "1=1";

						this.featureLayer.selectFeatures(query,FeatureLayer.SELECTION_NEW, lang.hitch(this,function(result){this.updateFields(result)}))  
					
			   },
			   
			   updateFields: function(results) {

						//this.keyLookup = new Object();
						
						array.forEach(_fs_config.queryFields, lang.hitch(this,function(entry, i){
							
							entry.values = new Array();
							
						}));

							
						array.forEach(results, lang.hitch(this,function(feature, i){
							
							array.forEach(_fs_config.queryFields, lang.hitch(this,function(entry, i){
								
								fieldvalue = feature.attributes[entry.field];
								idx = array.indexOf(entry.values, fieldvalue);
								if (idx == -1) {entry.values.push(fieldvalue);}; 
								
							}));
						
						}));
						
						array.forEach(_fs_config.queryFields, lang.hitch(this,function(entry, i){
							
							entry.values = entry.values.sort();
							
						}));	
						
						
						console.log(_fs_config.queryFields);
				 
			   },
			   
			   
			   resetForm: function(clearLayer) {

					//alert("Reset");
					
					this.legendContainer.innerHTML = "";
					
					this.symbolButton.set("label", "Select Symbol Field");
					domConstruct.empty(this.controlgroup2);
					
					if (this.featureLayer != undefined) {
						this.map.removeLayer(this.featureLayer);
					}
					
					if (clearLayer) {
					
						this.featureLayer = new FeatureLayer(_fs_config.mapServer +"/" + 0,{
						  mode: FeatureLayer.MODE_SELECTION,
						  outFields: ["*"]
						});
						
						on(this.featureLayer, "load", lang.hitch(this,this.loadedLayer))
						on(this.featureLayer, "click", lang.hitch(this,this.doInfo)); 
						
						this.map.addLayer(this.featureLayer);
				 
					}
					
					this.addrow();
					
					this.map.graphics.remove(this.selectedGraphic);
			   },
			   
			   changeSymbolLevel: function(SymbolLevel) {
			   
					console.log(SymbolLevel);
					this.symbolButton.set("label", SymbolLevel.name);
					
					if (this.featureLayer != undefined) {
						this.map.removeLayer(this.featureLayer);
					}
					
					
					this.featureLayer = new FeatureLayer(_fs_config.mapServer +"/" + SymbolLevel.id,{
					  mode: FeatureLayer.MODE_SELECTION,
					  outFields: ["*"]
					});

					on(this.featureLayer, "click", lang.hitch(this,this.doInfo)); 
					
					this.map.addLayer(this.featureLayer);

					on(this.featureLayer, "load", lang.hitch(this,this.doSelection));	

					//_fs_config.mapServer +"/" + SymbolLevel.id
					this.map.graphics.remove(this.selectedGraphic);
					domStyle.set(this.tabloc, "visibility", "hidden");				   
			   },

               deactivate: function () {

			   },

               hibernate: function () {

                                      if (this.rendered == true) {

					this.resetForm();
					this.featureLayer = undefined;
					domStyle.set(this.tabloc, "visibility", "hidden");
					
					this.map.graphics.remove(this.selectedGraphic);

                                      }

			   },
			   
			   
			   addrow: function() {

						
						fsrows = dojoquery(".fsrow");
						rowscount = fsrows.length;
						var fsrc = rowscount

						var tag = domConstruct.create("div", {innerHTML: "", "style": "position: relative;width: 100%;height:80px;background-color: #EEE; padding: 5px; margin-bottom:2px", "class": "fsrow row" + fsrc});
						
						this.controlgroup2.appendChild(tag);
						
						var displayStatus = "";
						var boffset = "-150px";
						if (fsrc == 0) {displayStatus = "display: none"; boffset = "-100px;"};
					
						menu = new DropDownMenu({ style: "display: none;"});

						ddbut = new DropDownButton({
							label: "And",
							name: "symbol",
							style: displayStatus,
							dropDown: menu,
						})
						
						var fsdb = ddbut
						
						menuItem1 = new MenuItem({
								label: "And",
								onClick: lang.hitch(this,function(e){fsdb.set("label", "And");fsdb.set("value", "AND");this.doSelection();})
							});
						menu.addChild(menuItem1);
					
						menuItem2 = new MenuItem({
								label: "Or",
								onClick: lang.hitch(this,function(e){fsdb.set("label", "Or");fsdb.set("value", "OR");this.doSelection();})
							});
						menu.addChild(menuItem2);						

						menu.startup();
						
						tag.appendChild(ddbut.domNode);
						
						rowtext = domConstruct.create("span", {innerHTML: " Show Projects Where: ", "style": ""});
						
						tag.appendChild(rowtext);
						
						menu = new DropDownMenu({ style: "display: none;"});
						
						array.forEach(_fs_config.queryFields, lang.hitch(this,function(entry, i){
							menuItem1 = new MenuItem({
								label: entry.name,
								value: entry.value,
								onClick: lang.hitch(this,function(e){this.changeRowField(entry, fsrc)})
							});
							menu.addChild(menuItem1);
						}));
						

						menu.startup();

						ddField = new DropDownButton({
							label: "Choose Field",
							name: "Field",
							style: "position:absolute;top:34px;left:30px;",
							dropDown: menu,
						});
						
						tag.appendChild(ddField.domNode);					

						rowtextmore = domConstruct.create("span", {innerHTML: " = ", "style": "position:absolute;top:32px;right:215px;font-size:30px;font-weight:bold"});
						tag.appendChild(rowtextmore);

						
						seltag = domConstruct.create("select");
						tag.appendChild(seltag);
						
						parser.parse();
						
						//var c = win.doc.createElement('option');
						//c.innerHTML = "HI";
						//c.value = "YO";
						//seltag.appendChild(c);
						
						myMultiSelect = new MultiSelect({"style": "position: absolute;right: 2px;height:70px;width:200px", "_onChange" : lang.hitch(this,this.doSelection)}, seltag).startup(); 
						
						
						plusbut = domConstruct.create("i", {class: "fa fa-plus-square-o fa-2", "style": "position: absolute;left:2px;bottom:2px"});
						tag.appendChild(plusbut);
						
						on(plusbut, "click", lang.hitch(this,function() {this.addrow()}));
						
						minusbut = domConstruct.create("i", {class: "fa fa-minus-square-o fa-2", "style": "position: absolute;left:15px;bottom:2px;" + displayStatus});
						tag.appendChild(minusbut);
						
						on(minusbut, "click", lang.hitch(this,function() {domConstruct.destroy(tag);this.doSelection()}));
						
			   },
			   
			   changeRowField: function(entry, rc) {
				   
					fsselect = dojoquery(".fsrow.row" + rc).children("select")[0];
					
					domConstruct.empty(fsselect);
					
					ddBut = dojoquery(".fsrow.row" + rc).children(".dijitDropDownButton")[1];
					
					aWidget = dijit.getEnclosingWidget(ddBut);
					console.log(aWidget);
					
					aWidget.set("label", entry.name);
					aWidget.set("value", entry.field);
					
						array.forEach(entry.values, lang.hitch(this,function(val, i){
								var c = win.doc.createElement('option');
								c.innerHTML = val;
								c.value = val;
								fsselect.appendChild(c);
						}));
						
					this.doSelection();
				   
				 
			   },
			   
			   
			   doSelection: function() {
				   
				 rend = this.featureLayer.renderer;
				 
				 console.log("******************");
				 //console.log(rend._symbols);
				 
				 symbols = rend._symbols;
				 
				 if (symbols == undefined) {
				 
					sym = rend.getSymbol();
				 
					tname = _fs_config.defaultLegendItem;
				 
					symbols = { single : {label : _fs_config.defaultLegendItem, symbol: sym}};
				 
				 } else {
					 
					tname = this.symbolButton.get("label"); 
				 }
				 
				symHTML = tname + "<br><span style='line-height: 20px;font-weight: normal'>";
				 
				TArray = new Array();
				 
				dn.forIn(symbols, function(ob) {
						console.log(ob);
						TArray.push(ob.label);
						//symHTML = symHTML + "<img src='" + ob.symbol.url + "' /> " + ob.label + "<br>"
					});
					
				TArray = TArray.sort();
				console.log('####')
				console.log(TArray);
				
				array.forEach(TArray, lang.hitch(this,function(ob, i){
					symHTML = symHTML + "<img src='" + symbols[ob].symbol.url + "' /> " + symbols[ob].label + "<br>"
				}));
				 
				 symHTML = symHTML + "</span>"

				this.legendContainer.innerHTML = symHTML;
				
					console.log("Changed");
					fsrows = dojoquery(".fsrow");
					
					qplist = new Array();
					array.forEach(fsrows, lang.hitch(this,function(fsrow, i){
						
						ddBut = dojoquery(fsrow).children(".dijitDropDownButton")[1];
						aWidget = dijit.getEnclosingWidget(ddBut);
						fieldValue = aWidget.get('value');
						
						fsselect = dojoquery(fsrow).children("select")[0];
						fsselectWidget = dijit.getEnclosingWidget(fsselect);
						selectValues = fsselectWidget.get('value');
						
						arddBut = dojoquery(fsrow).children(".dijitDropDownButton")[0];
						arddButw = dijit.getEnclosingWidget(arddBut);
						aorvalue = arddButw.get('label');
						
						if (selectValues.length != 0) { 
							qp = " " + aorvalue + " (" + fieldValue + " = '" + selectValues.join("' OR " + fieldValue + " = '") + "')";
							qplist.push(qp);
						}
						
					}));
					
					qwhere = qplist.join(""); 
					
					qwhere = (qwhere.replace(" And ", ""));
					
					console.log(qwhere);
					query = new esriQuery();
					if (qwhere == "") {
						query.where = "1=1"
					} else {
						query.where = qwhere;
					}

					this.featureLayer.selectFeatures(query,FeatureLayer.SELECTION_NEW)
						// Trigger legend redraw.
						.then(this.map.resize);
			   },


				initialize: function (frameworkParameters) {

					declare.safeMixin(this, frameworkParameters);

				    domClass.add(this.container, "claro");
				   
					//parser.parse()	
						
					node2 = domConstruct.create("div", {innerHTML: "", "style": "width: 100%;margin-bottom:60px;overflow:hidden"});
					
					this.container.appendChild(node2);
					
					this.buttonpane = domConstruct.create("div", {"style": "width: 100%;height: 50px;position: absolute;bottom: 0;left: 0;text-align: center;background-color: #CCC; padding:10px;"});
					
					this.container.appendChild(this.buttonpane);
					
					this.ButtonsLocation = domConstruct.create("span", {style: "float:right"});

					this.buttonpane.appendChild(this.ButtonsLocation);
					
					this.mainArea = domConstruct.create("div", {innerHTML: _fs_config.mainText, "style": "width: 100%;padding:10px;"});
					
					node2.appendChild(this.mainArea);
					
					this.controlgroup1 = domConstruct.create("div", {innerHTML: "<br>Symbolize Projects By: ", "style": "width: 100%"});
					
					this.mainArea.appendChild(this.controlgroup1);

					parser.parse()
					
						menu = new DropDownMenu({ style: "display: none;"});
						
						array.forEach(_fs_config.symbolizeBy, lang.hitch(this,function(entry, i){
							menuItem1 = new MenuItem({
								label: entry.name,
								value: entry.value,
								onClick: lang.hitch(this,function(e){this.changeSymbolLevel(entry)})
							});
							menu.addChild(menuItem1);
						}));
						

						menu.startup();

						this.symbolButton = new DropDownButton({
							label: "Select Symbol Field",
							name: "symbol",
							dropDown: menu,
						})
						
						this.controlgroup1.appendChild(this.symbolButton.domNode);					

						
						newButt = new Button({
							label: "Show All",
							style: "float: right;",
							onClick: lang.hitch(this,function() {this.resetForm(true)})
							});

						this.controlgroup1.appendChild(newButt.domNode);

					this.controlgroup2 = domConstruct.create("div", {innerHTML: "", "style": "width: 100%;padding-top:5px"});
					
					
					this.mainArea.appendChild(this.controlgroup2);
					
					
					this.pntSym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 18,
								   new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
								   new Color([0,0,0]), 3),
								   new Color([0,255,0,0]));
								  
								   
					//nodeer = domConstruct.create("span", {innerHTML: "<br>Symbolize Projects By: ", "style": "width: 100%;margin-bottom:60px;overflow:hidden"});
					
					//this.mainArea.appendChild(nodeer);
					

/*					
					

										

					
					
					
					alert(a);
					
					

    var tc = new TabContainer({
        style: "height: 100%; width: 100%;"
    }, this.tabloc);

    var cp1 = new ContentPane({
         title: "Food",
         content: "We offer amazing food"
    });
    tc.addChild(cp1);

    var cp2 = new ContentPane({
         title: "Drinks",
         content: "We are known for our drinks."
    });
    tc.addChild(cp2);

    tc.startup();
					
			var p = new ConstrainedMoveable(
				tc, {
				handle: tc,	
				within: true
			});
parser.parse();

alert('');
*/
				},



			     resize: function(w, h) {


				 
				 },


			     resizeInfo: function(e) {
					
					resized = dom.byId(this.map.id + "_filterSelect_outer");
					console.log(resized);
					
					w = domStyle.get(resized, "width");
					h = domStyle.get(resized, "height");
					
					
					large = dom.byId(this.map.id + "_filterSelect_large");
					domStyle.set(large, "height", h + "px");
					domStyle.set(large, "width", w + "px");
					console.log(large);
					
					cnt = dom.byId(this.map.id + "_filterSelect_cont");
					domStyle.set(cnt, "height", (h - 10) + "px");
					domStyle.set(cnt, "width", (w - 10) + "px");
					console.log(cnt);

					cnt = dom.byId(this.map.id + "_filterSelect_cont");
					domStyle.set(cnt, "height", (h - 10) + "px");
					domStyle.set(cnt, "width", (w - 10) + "px");
					console.log(cnt);
					
					this.tabc.resize({"w" : w-10, "h" : h-40})
					
					//alert(e);
					this.tabc.layout()

					
					
				 },

				render: function() {
					
					
					array.forEach(_fs_config.buttons, lang.hitch(this,function(cbutton, i){

						newButt = new Button({
							label: cbutton.title,
							onClick: lang.hitch(this,function(){window.open(localrequire.toUrl("./" + cbutton.url ))})  //function(){window.open(this.configVizObject.methods)}
							});

						this.ButtonsLocation.appendChild(newButt.domNode);


					}));

				
					this.tabloc = domConstruct.create("div", {innerHTML: '<div class="plugin-container-outer resizable claro" id="' + this.map.id + "_filterSelect_outer" + '"><div class="plugin-container" style="width: 420px; height: 300px;" id="' + this.map.id + "_filterSelect_cont" + '"><div id="' + this.map.id + "_filterSelect_Info_handle" + '"class="plugin-container-header"><h6>Information</h6><a id="' + this.map.id + "_filterSelect_info_closer" + '" href="javascript:;">✖</a></div><div id="' + this.map.id + "_filterSelect_main" + '"></div></div></div>', "style":"width:420px;height:300px;position:absolute; right:100px; top:70px;visibility: hidden", id: this.map.id + "_filterSelect_large", class: "claro"});
					
					mymap = dom.byId(this.map.id);
					a = dojoquery(mymap).parent();
					dojoquery(a)[0].appendChild(this.tabloc);
					parser.parse();

					
					handle = new ResizeHandle({
						targetId: this.map.id + "_filterSelect_outer" ,
						activeResize: true,
						animateSizing: false
					});
					
					handle.placeAt(this.map.id + "_filterSelect_outer" );
					handle.on('resize', lang.hitch(this,this.resizeInfo));
				
					moveable = new move.parentConstrainedMoveable(this.tabloc, {
						handle: this.map.id + "_filterSelect_Info_handle",
						area: "content",
						within: true
					});

					parser.parse();
					
					this.tabc = new TabContainer({
						style: "height: 100%; width: 100%;"
					}, this.map.id + "_filterSelect_main");

					
					array.forEach(_fs_config.infos, lang.hitch(this,function(entry, i){
						
						cp1 = new ContentPane({
							 title: entry.name,
							 content: "<div id='" + this.map.id + "_filterSelect_area_" + entry.name.replace(" ", "_").replace(" ", "_") + "'></div>"
						});
						this.tabc.addChild(cp1);						
						
					}));



					this.tabc.startup();
									

				parser.parse();
				
				a = dom.byId(this.map.id + "_filterSelect_info_closer");
				
				
					on(a, "click", lang.hitch(this,function(evt){
						domStyle.set(this.tabloc, "visibility", "hidden");
						this.map.graphics.remove(this.selectedGraphic);
					}));
					


					this.rendered = true;

				},

			   showHelp: function () {



			   },

               getState: function () {




				},


               setState: function (state) {


				

				},

            subregionActivated: function(subregion) {

                console.debug('now using subregion ' + subregion.display);



            },

            subregionDeactivated: function(subregion) {

                console.debug('now leaving subregion ' + subregion.display);



            }

        });
    });



