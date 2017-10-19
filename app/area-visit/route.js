import Route from '@ember/routing/route';
import d3request from 'd3-request';
import d3csv from 'd3-dsv';
export default Route.extend({
	model(){
		let data = {};
		let   colors = {
			"浙江省": "#5687d1",
			"丽水市": "#7b615c",
			"台州市": "#de783b",
			"嘉兴市": "#6ab975",
			"杭州市": "#a173d1", 			 
			"丽水市" : "#FFD700", 
			"温州市" : "#FF83FA",
			"湖州市" : "#FF7F24",
			"衢州市" : "#FF6A6A",
			"宁波市" : "#FF4040",
			"舟山市" : "#FF1493",
			"金华市" : "#BA55D3",
			"绍兴市" : "#B7B7B7",
			"云和县" : "#B452CD",
			"庆元县" : "#B23AEE",
			"景宁县" : "#B0C4DE",
			"景宁畲" : "#ADFF2F",
			"松阳县" : "#AB82FF",
			"缙云县" : "#FFD700",
			"莲都区" : "#FFC125",
			"遂昌县" : "#FFB6C1",
			"青田县" : "#FFA500",
			"龙泉市" : "#FF83FA",
			"三门县" : "#FF7F24",
			"临海市" : "#FF6A6A",
			"仙居县" : "#FF4040",
			"台州经" : "#FF1493",
			"天台县" : "#BA55D3",
			"椒江区" : "#B7B7B7",
			"温岭市" : "#B452CD",
			"玉环市" : "#B23AEE",
			"经济开" : "#B0C4DE",
			"路桥区" : "#ADFF2F",
			"黄岩区" : "#AB82FF",
			"南湖区" : "#FFD700",
			"嘉善县" : "#FFC125",
			"平湖市" : "#FFB6C1",
			"桐乡市" : "#FFA500",
			"海宁市" : "#FF83FA",
			"海盐县" : "#FF7F24",
			"秀洲区" : "#FF6A6A",
			"郊  区" : "#FF4040",
			"余姚市" : "#FF1493",
			"北仑区" : "#BA55D3",
			"奉化市" : "#B7B7B7",
			"宁海县" : "#B452CD",
			"慈溪市" : "#B23AEE",
			"江东区" : "#B0C4DE",
			"江北区" : "#ADFF2F",
			"海曙区" : "#AB82FF",
			"象山县" : "#FFD700",
			"鄞州区" : "#FFC125",
			"镇海区" : "#FFB6C1",
			"上城区" : "#FFA500",
			"下城区" : "#FF83FA",
			"临安市" : "#FF7F24",
			"余杭区" : "#FF6A6A",
			"富阳市" : "#FF4040",
			"建德市" : "#FF1493",
			"拱墅区" : "#BA55D3",
			"桐庐县" : "#B7B7B7",
			"江干区" : "#B452CD",
			"淳安县" : "#B23AEE",
			"滨江区" : "#B0C4DE",
			"经济技" : "#ADFF2F",
			"萧山区" : "#AB82FF",
			"西湖区" : "#FFD700",
			"乐清市" : "#FFC125",
			"平阳县" : "#FFB6C1",
			"文成县" : "#FFA500",
			"永嘉县" : "#FF83FA",
			"泰顺县" : "#FF7F24",
			"洞头县" : "#FF6A6A",
			"瑞安市" : "#FF4040",
			"瓯海区" : "#FF1493",
			"苍南县" : "#BA55D3",
			"鹿城区" : "#B7B7B7",
			"龙湾区" : "#B452CD",
			"南浔区" : "#B23AEE",
			"吴兴区" : "#B0C4DE",
			"安吉县" : "#ADFF2F",
			"德清县" : "#AB82FF",
			"长兴县" : "#FFD700",
			"上虞区" : "#FFC125",
			"嵊州市" : "#FFB6C1",
			"新昌县" : "#FFA500",
			"柯桥区" : "#FF83FA",
			"滨海新" : "#FF7F24",
			"诸暨市" : "#FF6A6A",
			"越城区" : "#FF4040",
			"定海区" : "#FF1493",
			"岱山县" : "#BA55D3",
			"嵊泗县" : "#B7B7B7",
			"普陀区" : "#B452CD",
			"常山县" : "#B23AEE",
			"开化县" : "#B0C4DE",
			"柯城区" : "#ADFF2F",
			"江山市" : "#AB82FF",
			"衢江区" : "#FFD700",
			"龙游县" : "#FFC125",
			"东阳市" : "#FFB6C1",
			"义乌市" : "#FFA500",
			"兰溪市" : "#FF83FA",
			"婺城区" : "#FF7F24",
			"永康市" : "#FF6A6A",
			"浦江县" : "#FF4040",
			"金东区" : "#FF1493",
			"其他地区": "#a184e6",
		  "end": "#bbbbbb"
		};
		let version = { 
		};		 
		let url =  'assets/data/area-visit.csv' ;
		let csv = d3request.request(url)
    		.mimeType("text/csv")
    		.response(function(xhr) { 

    			return d3csv.csvParse(xhr.responseText, function(d) {
    				  // debugger 
					  return d;
				}); 
    		});
    	data.data = csv;
		// debugger;
		data.version= version;
		data.colors = colors;
		return data;
	} 
});
