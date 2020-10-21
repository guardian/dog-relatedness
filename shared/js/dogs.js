import * as d3 from "d3"
import { group } from 'd3-array'
import { interpolateTurbo } from 'd3-scale-chromatic'

export function doggies(dogs, pics, dogbreed) {

	function splitCamel(s) {
		// console.log(s)
		return s.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
	}

	function cleanName(s) {
		return s.replace(/'/g, "_");
	}

	const dogClades = ["Other","Wild","Basenji","AsianSpitz","AsianToy","NordicSpitz","Schnauzer","SmallSpitz","ToySpitz","Hungarian","Poodle","AmericanTerrier","AmericanToy","Pinscher","Terrier","NewWorld","Mediterranean","ScentHound","Spaniel","Retriever","PointerSetter","ContinentalHerder","UKRural","Drover","Alpine","EuropeanMastiff"]

	const images = group(pics.sheets.Sheet1, d => d.breed)

	var groupOrBreed = 'breed';

	// var generic = ["Levriero Meridionale", "Mastino Abruzzese", "Miniature Xoloitzcuintli", "Cane Paratore","Xigou"]
	

	var width = document.querySelector(`.${dogbreed} #graphicContainer`).getBoundingClientRect().width;
	var container = document.querySelector(`.${dogbreed} #graphicContainer`).getBoundingClientRect().width;   
	var context = d3.select(`.${dogbreed} .interactive-container`)
	console.log(dogbreed, context)
	// context.text("yea")
	var winW = window.innerWidth
	var winH = window.innerHeight

	var cladeNames = {
		"Alpine": "Alpine",
		"Terrier": "Terrier",
		"Drover": "Drover",
		"Mediterranean": "Mediterranean",
		"UKRural": "UK Rural",
		"NewWorld": "New World",
		"Pinscher": "Pinscher",
		"Hungarian": "Hungarian",
		"EuropeanMastiff": "European Mastiff",
		"AsianToy": "Asian Toy",
		"ToySpitz": "Toy Spitz",
		"PointerSetter": "Pointer Setter",
		"SmallSpitz": "Small Spitz",
		"Spaniel": "Spaniel",
		"Retriever": "Retriever",
		"NewWorld": "New World",
		"Poodle": "Poodle",
		"NordicSpitz": "Nordic Spitz",
		"AmericanTerrier": "American Terrier",
		"AmericanToy": "American Toy",
		"Schnauzer": "Schnauzer",
		"ContinentalHerder": "Continental Herder",
		"ScentHound": "Scent Hound",
		"AsianSpitz": "Asian Spitz",
		"Basenji": "Basenji"
	}    
	
	var isMobile = false

	if (winW <= 620) {
		isMobile = true
	}
	var height
	var currentDog

	var scaleVal = 1

	scaleVal = 1260

	var radiusVal = 20

	if (isMobile) {
		radiusVal = 20
	}

	height = (2 * 170) + (2 * radiusVal) + 120

	// if (winW >= winH) {
	// 	height = width * 0.6;
	// }

	// else {

	// 	height = (2 * 170) + (2 * radiusVal) + 120

	// 	// if (winW >= 650) {
	// 	// 	height = width * 0.8
	// 	// }

	// 	// else {
	// 	// 	height = width * 1.6
	// 	// 	scaleVal = 0.8
	// 	// }
		
	// }
	
	var margin = {top: 0, right: 0, bottom: 0, left:0};
	
	var forceStrength,bubblesExist;

	context.select('#graphicContainer svg').remove()

	var svg = context.select("#graphicContainer").append("svg")
				.attr("width", width - margin.left - margin.right)
				.attr("height", height - margin.top - margin.bottom)
				.attr("id", "svg")
				.attr("overflow", "hidden");

	
	var defs = svg.append("defs");

	// var tooltip = d3.select("#graphicContainer .infoInner")
	
	var imgW = radiusVal * 2
	var imgH = radiusVal * 2

	var linkMax = Math.min(width/2 - (radiusVal *2), 170) 
	var linkMin = Math.min(width/4 - (radiusVal *2), 70) 

	var extent = d3.extent(dogs.links, d => d.outValue)

	var linkLength = d3.scaleLinear()
		.range([linkMax, linkMin])		
		.domain(extent)		

	// console.log(linkLength.domain())	

	var linkWidth = d3.scaleLinear()
		.range([2,(radiusVal*2) * 0.8])		
		.domain(extent)

	var relatedness = d3.scaleLinear()
		.range([1,100])		
		.domain(extent)

	var turboColours = []

	dogClades.forEach(function(d,i) {
		var pos = i/dogClades.length
		turboColours.push(interpolateTurbo(pos))
	})

	var colors1scale = d3.scaleOrdinal()
		.range(turboColours)
		.domain(dogClades)

	var dogNames = {}	

	dogs.nodes.forEach(function (dog) {

		defs.append('pattern')
			.attr("id", dog.id)
			.attr("width", 1)
			.attr("height", 1)
			.attr("x", 0)
			.attr("y", 0)
			.append("svg:image")
			.attr("xlink:href", function() {

				// if (generic.includes(dog.breed)) {
				// 	return `<%= path %>/imgs/generic.jpg`
				// }
				// else {
					return `<%= path %>/imgs/${cleanName(dog.breed)}.jpg`
				// }
				
			})
			// .attr("xlink:href", (Math.random() < 0.5 ? "<%= path %>/imgs/bsji.jpg" : "<%= path %>/imgs/bedt.jpg") )
			.attr("width", imgW)
			.attr("height", imgH)
			.attr("y", 0)
			.attr("x", 0)

		dogNames[dog.id] = {"name":dog.breed, "clade":dog.clade}	

	})

	dogs.links.forEach(function (dog) {
		dog.pct = Math.round(((dog.outValue / 2410976875) * 100) * 100) / 100 
		dog.time = ""
	})

	var features = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var breedSelector = context.select("#breedSelector");			
	var groupSelector = context.select("#groupSelector");			

	dogs.nodes.sort(function(a, b) {
		var nameA = a.breed.toUpperCase()
		var nameB = b.breed.toUpperCase()
		if (nameA < nameB) {
		return -1;
		}
		if (nameA > nameB) {
		return 1;
		}

		return 0;
	});

	breedSelector.append("option")
				.attr("value","nil")
				.text("---")	

	dogs.nodes.forEach(function (d) {

			breedSelector.append("option")
				.attr("value",d.id)
				.text(d.breed)	
		
	})

	var clades = Object.keys(d3.nest().key(d => d.clade).object(dogs.nodes))

	groupSelector.append("option")
				.attr("value","nil")
				.text("---")	

	var colorKeyDiv = context.select("#colorKey")			

	clades.forEach(function (d) {

			if (d === "") {
				groupSelector.append("option")
					.attr("value",d)
					.text("Other")
			}

			else {
				groupSelector.append("option")
				.attr("value",d)
				.text(splitCamel(d))
			}
				
			var div = colorKeyDiv.append("div")
				.attr("class", "colorKeyDiv " + d)
				
			div.append("div")
				.attr("class", "colorKeyCircle")
				.style("background-color", colors1scale(d))

			div.append("span")
				.text(function () {
					if (d != "") {
						return splitCamel(d)
					}

					else {
						return " Other"
					}
				})
	})


	var outline = d3.scaleOrdinal()
				.domain([''])
				.range(['#005689','#ad0303','#767676','#767676'])	

	var nodeColors = d3.scaleOrdinal()
					.domain([''])
					.range(['#b51800','#298422','#005689','#aad8f1','#767676','#fc8d62','#66c2a5'])				

	var linkColors = d3.scaleOrdinal()
					.domain([''])
					.range(['#005689','#b82266','#767676','#767676'])				
		
	var chartDataSave, atomSave, currentDogSave, currentGroupSave, chargeSave; 				

	function makeChart(selectedData, atom, currentDog, currentGroup, charge=-1000, chartWidth=width, type='center') {

		chartDataSave = selectedData
		atomSave = atom
		currentDogSave = currentDog
		currentGroupSave = currentGroup
		chargeSave = charge

		context.select("#statusMessage").remove()

		if (atom == 'default') {
			if (currentDog != undefined) {
				context.select("#currentDog").html("is the " + dogNames[currentDog].name)
			}
			
			else if (currentGroup != undefined) {
				context.select("#currentDog").html("are dogs in the " + cladeNames[currentGroup] + " group")
			}
		}

		console.log("making chart")

		// if (typeof simulation !== 'undefined') {
		// 	simulation.stop();	
		// }
		
		features.selectAll(".links")
			.transition('removelinks')
			.style("opacity",0)
			.remove();

		features.selectAll(".nodes circle")
			.transition('removenodecircles')
			.attr("r",0)
			.remove();

		features.selectAll(".nodes")
			.transition('removenodes')
			.remove();	

		features.selectAll(".nodes text")
			.transition()
			.style("opacity",0)
			.remove();
		
		var totalNodes = selectedData.nodes.length;

		var simulation = d3.forceSimulation(selectedData.nodes)
		      .force("link", d3.forceLink(selectedData.links).id(d => d.id).distance(d => linkLength(d.outValue)))
		      // .force("link", d3.forceLink(selectedData.links).id(d => d.id))
		      .force("charge", d3.forceManyBody().strength(charge))
		     .force("center", d3.forceCenter(chartWidth / 2, height / 2))
		     // .force("x", d3.forceX())
      	// 	.force("y", d3.forceY())
		     .force("collide", d3.forceCollide().radius(radiusVal + 2).iterations(2))

		// simulation.nodes(selectedData.nodes);
  // 		simulation.force("link").links(selectedData.links);      

		var drag = simulation => {
		  
		  function dragstarted(d) {
		    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		    d.fx = d.x;
		    d.fy = d.y;
		  }
		  
		  function dragged(d) {
		    d.fx = d3.event.x;
		    d.fy = d3.event.y;
		  }
		  
		  function dragended(d) {
		    if (!d3.event.active) simulation.alphaTarget(0);
		    d.fx = null;
		    d.fy = null;
		  }
		  
		  return d3.drag()
		      .on("start", dragstarted)
		      .on("drag", dragged)
		      .on("end", dragended);
		}      

		var links = features.append("g")
			.attr("stroke", "#bababa")
			.attr("stroke-opacity", 1)
			.selectAll("line")
			.data(selectedData.links)
			.join("line")
			.attr("stroke-width", d => linkWidth(d.outValue))
			.attr("class", "links")
			// .on("mouseover.tooltip", makeTooltip())
		  	.on('mouseover.fade', fade2(0.1, 'over'))
		  	.on('mouseout.fade', fade2(1, 'out'))
		  	// .on("mouseout.tooltip", resetTooltip())

		var linkCircles = features.selectAll(".linkCircle")
			.data(selectedData.links)
			.enter()
			.append("circle")
			.attr("class", "linkCircles")
			.style("opacity", 0)
			.attr("fill", "#FFF")
			.attr("r",12)
			.attr("stroke", "#bababa")

		var linkText = features.selectAll(".linkText")
			.data(selectedData.links)
			.enter()
			.append("text")
			.attr("class", "linkTexts label")
			.attr("text-anchor", "middle")
			.attr("dy",4)
			.style("font-size","10px")
			.style("opacity", 0)
			.text(function(d) { return Math.round(relatedness(d.outValue) * 10) / 10 })	


		var nodes = features.append("g")
			.attr("class", "nodes")
		.selectAll("g")
		    .data(selectedData.nodes)
		    .enter().append("g")
		    .attr("id", d => d.id)
		    .style("opacity", 1)
		
		var circles = nodes.append("circle")
			.attr("r", radiusVal)
			.attr("fill", d=> `url(#${d.id}`)
			.attr("stroke-width", 3)
			.attr("title", d => d.breed)
			.attr("stroke", d=> colors1scale(d.clade))
			.on('mouseover.fade', fade(0.1, 'over'))
		  	.on('mouseout.fade', fade(1, 'out'))
			.call(drag(simulation))

		var labels = nodes.append("text")	
			.text(d=> d.breed)
			.attr("class", "label")
			.style("opacity", 0)
			.attr('x', 0)
  			.attr('y', radiusVal + 16)
  			.attr("text-anchor", "middle")

  		if (currentDog) {
		      	context.select(`#${currentDog} .label`).style("opacity",1)
		}

		 simulation.on("tick", () => {
		    links
		        .attr("x1", function(d) {
		        	return d.source.x
		        })
		        .attr("y1", d => d.source.y)
		        .attr("x2", d => d.target.x)
		        .attr("y2", d => d.target.y);

		 	nodes.attr("transform", function(d) {
		 		var r = radiusVal + 0.5
		 		return "translate(" + (d.x = Math.max(r + 4, Math.min(chartWidth - (r + 4), d.x))) + "," + (d.y = Math.max(r + 4, Math.min(height - (r + 4), d.y))) + ")";
	  		})
  	
		 	linkText
		        .attr("x", function(d) {
		            return ((d.source.x + d.target.x)/2);
		        })
		        .attr("y", function(d) {
		            return ((d.source.y + d.target.y)/2);
		        });

		    linkCircles
		        .attr("cx", function(d) {
		            return ((d.source.x + d.target.x)/2);
		        })
		        .attr("cy", function(d) {
		            return ((d.source.y + d.target.y)/2);
		        });    

		  	// linkText.attr("transform", function(d) {
		 		// // var r = radiusVal + 0.5
		 		// return "translate(" + (d.x = Math.min(width, (d.source.x + d.target.x)/2) + "," + (d.y = Math.min(height, (d.source.y + d.target.y)/2)) + ")";
	  		// })


		  });	

		 // 	function makeTooltip() {

		 // 		return d => {	 		
		 // 		var text = `<h3>${d.source.breed} and ${d.target.breed}</h3><br>
			// 				<p>Share ${d.outValue} bps or ${d.pct}%</p>`

		 //  	// 	tooltip.transition()
			// 		// .duration(200)
			// 	 //   	.style("opacity", .9);

			// 	tooltip.html(text)   	


		 //    	}
		 // }

		 function resetTooltip() {
		 	return blah => {
		 		var text = `<h3>Information</h3><br>
							<p>Click a dog or link to see more</p>`

				tooltip.html(text)							
		 	}

		 }


		  const linkedByIndex = {};
		 	selectedData.links.forEach(d => {
		    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
		  });

		  function isConnected(a, b) {
		    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
		  }

		  function fade(opacity, action) {

		    return d => {
		      nodes.style('stroke-opacity', function (o) {
		        const thisOpacity = isConnected(d, o) ? 1 : opacity;
		        this.setAttribute('fill-opacity', thisOpacity);
		        return thisOpacity;
		      });

		      links.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

		      if (action === 'over') {
		      		labels.style('opacity', o => (o.source === d || o.target === d ? 0 : 1));
		      		linkText.style('opacity', o => (o.source === d || o.target === d ? 1 : 0));
		      		linkCircles.style('opacity', o => (o.source === d || o.target === d ? 1 : 0));
		      		context.selectAll(".colorKeyDiv").style("opacity",0.2).transition()	
					context.select(`#colorKey .${d.clade}`).style("opacity",1).transition()	
		      }
		      
		      else {
		      		labels.style('opacity', 0);
		      		linkText.style('opacity', 0);
		      		linkCircles.style('opacity', 0);
					context.selectAll(".colorKeyDiv").style("opacity",1	).transition()	

		      }

		     if (currentDog) {
		      	context.select(`#${currentDog} .label`).style("opacity",1)
				}


		    };
		 }

		 function fade2(opacity, action) {

		    return d => {
		    	nodes.style('stroke-opacity', function (o) {
			        const thisOpacity = (d.source.id === o.id || d.target.id === o.id ? 1 : opacity)
			        this.setAttribute('fill-opacity', thisOpacity);
			        return thisOpacity;
		      	});

		    	links.style('stroke-opacity', o => (o.source.id === d.source.id && o.target.id === d.target.id ? 1 : opacity));

		    	linkText.style('opacity', o => (o.source.id === d.source.id && o.target.id === d.target.id ? 1 : 0));
		      	linkCircles.style('opacity', o => (o.source.id === d.source.id && o.target.id === d.target.id ? 1 : 0));

		    	if (action === 'over') {
		      		labels.style('opacity', o => (o.source === d || o.target === d ? 0 : 1));
		      		
		      	}
		      
		      else {
		      		labels.style('opacity', 0);
		      		linkText.style('opacity', 0);
		      		linkCircles.style('opacity', 0);
		      }

		      if (currentDog) {
		      	context.select(`#${currentDog} .label`).style("opacity",1)
				}

		    };
		 }


	} // end make chart
	
	// var newData = filterGroup('UKRural');
	
	// makeChart(newData, -60)

	if (dogbreed != 'all') {
		var newData = filterData(dogbreed);
		makeChart(newData, 'embed', dogbreed, undefined)
		context.selectAll(".controls").style("display", "none")
	}
	
	else {
		context.selectAll(".controls").style("display", "block")
		var newData = filterData('BULD');
		makeChart(newData, 'default', 'BULD', undefined)
		breedSelector.property("value", "BULD")
	}

	// var dogClone = JSON.parse(JSON.stringify(dogs))

	// makeChart(dogClone)

	function filterData(filterBy) {
		// Clone dogs so we don't modify the orig data with d3 force stuff
		var dogClone = JSON.parse(JSON.stringify(dogs))

		var filteredData = {}
		filteredData.links = dogClone.links.filter(dog => (dog.source == filterBy) | (dog.target == filterBy))
		// console.log(filteredData.links)
		var setNodes = new Set()
		setNodes.add(filterBy)
		filteredData.links.forEach(dog => {
			setNodes.add(dog.target)
			setNodes.add(dog.source)  
		})
		filteredData.nodes = dogClone.nodes.filter(dog => setNodes.has(dog.id))

		return filteredData
	}


	function filterGroup(filterBy) {

		// Clone dogs so we don't modify the orig data with d3 force stuff
		var dogClone = JSON.parse(JSON.stringify(dogs))

		var filteredData = {}

		var cladeNodes = new Set() 

		// get all the nodes from this clade

		dogClone.nodes.filter(dog => dog.clade == filterBy).forEach(dog => cladeNodes.add(dog.id))

		// console.log(cladeNodes)

		filteredData.links = dogClone.links.filter(dog => (cladeNodes.has(dog.source)) | (cladeNodes.has(dog.target)))

		cladeNodes.add(filterBy)

		filteredData.links.forEach(dog => { 
			cladeNodes.add(dog.target)
			cladeNodes.add(dog.source)
		})
		filteredData.nodes = dogClone.nodes.filter(dog => cladeNodes.has(dog.id))

		return filteredData
	}

	breedSelector.on("change", function() {

		radiusVal = 20
		var newWidth = document.querySelector(`.${dogbreed} #graphicContainer`).getBoundingClientRect().width
		if (isMobile) {
			radiusVal = 20
		}
		var currentGroup = undefined
		currentDog = d3.select(this).property('value')
		console.log(currentDog)
		if (currentDog != "nil") {
			var newData = filterData(d3.select(this).property('value'));
				// console.log("newData",newData)
			makeChart(newData, 'default', currentDog, currentGroup, -1000, newWidth)
			groupSelector.property("value", "nil")
		}
		
		else {
			console.log("nah")
		}
	
	});

	groupSelector.on("change", function() {
		radiusVal = 20
		var newWidth = document.querySelector(`.${dogbreed} #graphicContainer`).getBoundingClientRect().width
		if (isMobile) {
			radiusVal = 10
		}
		var currentDog = undefined
		var currentGroup = d3.select(this).property('value')
		console.log(currentGroup)
		if (currentGroup != "nil") {
			var newData = filterGroup(currentGroup);
			makeChart(newData,'default', currentDog, currentGroup, -50, newWidth)
			breedSelector.property("value", "nil")
		}
		
		else {
			console.log("nah")
		}

	});

	context.select(".upDownButton").on("click", function() {
		
		if (context.select("#colorKey").classed("hide")) {
			context.select(".upDown").text("▲")
		}

		else {
			context.select(".upDown").text("▼")
		}

		context.select("#colorKey").classed("hide", context.select("#colorKey").classed("hide") ? false : true)
	})

	function makeKey() {
		context.select("#chartKey svg").remove()
		var keyWidth = document.querySelector("#chartKey").getBoundingClientRect().width;
		var keyHeight = 60;

		var offset = 10
		var mid1 = (keyHeight/2) - linkWidth(extent[0])/2 + offset
		var mid2 = (keyHeight/2) - linkWidth(extent[1])/2 + offset

		var key = context.select("#chartKey").append("svg")
				.attr("width", keyWidth)
				.attr("height", keyHeight)
				.attr("id", "keySvg")
				.attr("overflow", "hidden");

		key.append("rect")
			.attr("width", keyWidth * 0.2)
			.attr("height", linkWidth(extent[0]))
			.attr("x",2)
			.attr("y", mid1) 
			.attr("fill", "#bababa")

		key.append("rect")
			.attr("width", keyWidth * 0.2)
			.attr("height", linkWidth(extent[1]))
			.attr("x", keyWidth * 0.5)
			.attr("y",mid2)
			.attr("fill", "#bababa")

		key.append("circle")
			.attr("r", 12)
			.attr("cx", 2 + (keyWidth * 0.2)/2)
			.attr("cy",(keyHeight/2) + offset)
			.attr("stroke", "#bababa")
			.attr("fill", "#FFF")

		key.append("circle")
			.attr("r", 12)
			.attr("cx", (keyWidth * 0.5) + (keyWidth * 0.2)/2)
			.attr("cy", (keyHeight/2) + offset)
			.attr("stroke", "#bababa")
			.attr("fill", "#FFF")	

		key.append("text")
			.attr("x",2)
			.attr("y",12)
			.attr("class", "keyText")
			.text("Least related")

		key.append("text")
			.attr("x",keyWidth * 0.5)
			.attr("y",12)
			.attr("class", "keyText")
			.text("Most related")	

		key.append("text")
			.attr("x",2 + (keyWidth * 0.2)/2)
			.attr("y",(keyHeight/2) + offset)
			.attr("class", "keyText")
			.attr("dy", 4)
			.attr("text-anchor", "middle")
			.text("1")

		key.append("text")
			.attr("x",(keyWidth * 0.5) + (keyWidth * 0.2)/2)
			.attr("y",(keyHeight/2) + offset)
			.attr("class", "keyText")
			.attr("dy", 4)
			.attr("text-anchor", "middle")
			.text("100")							

	}

	makeKey()

	var to=null
	// var lastWidth = document.querySelector(`.${dogbreed} #graphicContainer`).getBoundingClientRect().width;
	window.addEventListener('resize', function() {
		var thisWidth = document.querySelector(`.${dogbreed} #graphicContainer`).getBoundingClientRect().width
		if (width != thisWidth) {
			window.clearTimeout(to);
			to = window.setTimeout(function() {
					resizeChart(thisWidth)
				}, 100)
		}
	
	})

	function resizeChart(newWidth) {

		if (newWidth <= 620) {
			isMobile = true
		}		

		if (isMobile) {
			radiusVal = 10
		}

		else {
			radiusVal = 20
		}

		console.log("resize")
		linkMax = Math.min(newWidth/2 - (radiusVal *2), 170) 
		linkMin = Math.min(newWidth/4 - (radiusVal *2), 70) 
		svg.attr("width", newWidth - margin.left - margin.right)

		linkLength.range([linkMax, linkMin])

		makeChart(chartDataSave, atomSave, currentDogSave, currentGroupSave, chargeSave, newWidth)
	}

}
	