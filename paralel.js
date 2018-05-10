var width = 700,
    height = 700,
    padding = {
        left: 50,
        right: 20
    };
var x1 = new Set(),
    x2 = new Set(),
    x3 = new Set(),
    x4 = new Set();
var axiss ;
var head = [];
var tbody, thead,sData = [];
var lines, nodes;
var sdepartment, sport, dport, department;
function colorful(){
    return `#${Math.floor(Math.random()*16).toString('16')}${Math.floor(Math.random()*16).toString('16')}${Math.floor(Math.random()*16).toString('16')}`;
}

d3.json("test.json", function (json) {
    tbody = json.tbody;
    thead = json.thead;
    thead.forEach(function (data) {
        head.push(data);
    }) //生成图例
    tbody.forEach(function (data) {
        x1.add(data[0]);
        x2.add(data[1]);
        x3.add(data[2]);
        x4.add(data[3]);
    }) //生成各轴的节点
    axiss = [x1,x2,x3,x4];
    sdepartment = tbody.map(arr => arr[0]);
    sport = tbody.map(arr => arr[1]);
    dport = tbody.map(arr => arr[2]);
    department = tbody.map(arr => arr[3]);
    render(tbody);

});

function countStatics(arr) {
    var len = arr.length,
        ans = {};
    for (var i = 0; i < len; i++) {
        var temp = arr[i];
        if (!ans[temp]) ans[temp] = 1;
        else ans[temp]++;
    }
    return ans;
} //统计频次

function gendots(x, countObj, scale, start,direct=1) {
    var ans = [],last;
    ans.push({x:start,y:0})
    for (var item of x) {
        var temp = {};
        temp.x = start-countObj[item]*10*direct;
        last = temp.y = scale(item);
        ans.push(temp);
    }
    ans.push({x:start,y:last});
    return ans;
}//生成频次点坐标

function filterNodes(tbody,nodes,axis){
    let ans = [];
    if(Array.isArray(nodes)){
        var len = nodes.length;
        for(var i=0;i<len;i++){
            var temp = tbody.filter(function(d){
                return d[axis] === nodes[i];
             }); 
             ans.push(...temp);
        } 
    }else{
        ans = tbody.filter(function(d){
            //console.log(d[axis], nodes);
             return d[axis] === nodes;
        })
    }
    return ans;
}
function scaleRange(arr) {
    var b = [];
    for (var i = 0,len = arr.size; i < len; i++) {
        b.push((height*i /len));
    }
    return b;
}
function render(tbody) {
    document.body.innerHTML = '';
    var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

    svg.append("g")
        .append("text")
        .text(thead[0])
        .attr("class","head")
        .attr("x",17)
        .attr("transform", function (d, i) {
            return "translate(0,-8)"; })

    svg.append("g")
        .append("text")
        .text(thead[1])
        .attr("class","head")
        .attr("x",178)
        .attr("transform", function (d, i) {
            return "translate(0,-8)"; })
    svg.append("g")
        .append("text")
        .text(thead[2])
        .attr("class","head")
        .attr("x",345)
        .attr("transform", function (d, i) {
            return "translate(0,-8)"; })
    svg.append("g")
        .append("text")
        .text(thead[3])
        .attr("class","head")
        .attr("x",510)
        .attr("transform", function (d, i) {
            return "translate(0,-8)"; })

    //console.log(sdepartment,sport,dport,department); 
    var cSdepartment = countStatics(sdepartment);
    var cSport = countStatics(sport);
    var cDport = countStatics(dport);
    var cDepartment = countStatics(department);
   
    var scale1 = d3.scaleOrdinal()
        .domain(Array.from(x1))
        .range(scaleRange(x1))
    var scale2 = d3.scaleOrdinal()
        .domain(Array.from(x2))
        .range(scaleRange(x2))
    var scale3 = d3.scaleOrdinal()
        .domain(Array.from(x3))
        .range(scaleRange(x3))
    var scale4 = d3.scaleOrdinal()
        .domain(Array.from(x4))
        .range(scaleRange(x4))
    var axis1 = d3.axisLeft()
        .scale(scale1)
        .ticks(5)
    var axis2 = d3.axisLeft()
        .scale(scale2)
        .ticks(5)
    var axis3 = d3.axisRight()
        .scale(scale3)
        .ticks(5)
    var axis4 = d3.axisRight()
        .scale(scale4)
        .ticks(5);

    var dots1 = gendots(x1, cSdepartment, scale1,40);
    var dots2 = gendots(x2, cSport, scale2,200);
    var dots3 = gendots(x3, cDport, scale3,360,-1);
    var dots4 = gendots(x4, cDepartment, scale4,520,-1);
    var dots = [dots1,dots2,dots3,dots4];
    //console.log(dots1);

    
    var line = d3.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        }); //直线生成器
        
    var leftHalf = [dots[0],dots[1]];
    var rightHalf = [dots[2],dots[3]];
    leftHalf.forEach(function(data){
        svg .append('svg:path')
            .attr('d', line(data))
            .attr('stroke','pink')
            .attr('fill', 'pink');
    })
    rightHalf.forEach(function(data){
        svg .append('svg:path')
            .attr('d', line(data))
            .attr('stroke','blue')
            .attr('fill', '#6C9BD2');
    })
    
    svg.append("g").call(axis1).attr("transform", function (d, i) {
        return "translate(" + (40 + 160 * i) + ")";})
        .attr("class", "trait")
        //.data(['z'])
    svg.append("g").call(axis2).attr("transform", function (d, i) {
            return "translate(200)"; })
        .attr("class", "trait")
    svg.append("g").call(axis3).attr("transform", function (d, i) {
            return "translate(360)";})
        .attr("class", "trait")
    svg.append("g").call(axis4).attr("transform", function (d, i) {
            return "translate(520)"; })
        .attr("class", "trait");//生成坐标轴

    tbody.forEach(function (data) {
        var color = colorful();
        svg.append('svg:path')
            .attr('d', line([{
                    x: 40,
                    y: scale1(data[0])
                },
                {
                    x: 200,
                    y: scale2(data[1])
                },
                {
                    x: 360,
                    y: scale3(data[2])
                },
                {
                    x: 520,
                    y: scale4(data[3])
                }
            ]))
            .attr('stroke', color)
            .attr('fill', 'none')
    })//连线

var brush = svg.selectAll('g.trait')
            .attr("class", "brush")
            .call(d3.brush()
            .extent([[-30, -30], [30, height]])
            .on("end", brushed));
}
function brushed() { //过滤数据并重新渲染
    var event = d3.event;
    var selection = event.selection;
    var origin = {};
    origin.x1 = event.sourceEvent.clientX-60;
    origin.y1 = event.sourceEvent.clientY-80 ;
    origin.x2 = event.sourceEvent.clientX + selection[1][0]-selection[0][0]-60;
    origin.y2 = event.sourceEvent.clientY + selection[1][1]-selection[0][1]-40;//计算选择区域绝对位置
    console.log(origin);
    var nAxis = Math.round((origin.x1)/160);
    console.log(nAxis,axiss[nAxis]);
    var len = axiss[nAxis].size;
    var domainSet = axiss[nAxis]; 
    var domainY = scaleRange(domainSet);
    console.log(domainY);
    domainSet = Array.from(domainSet);
    xAxis = nAxis*160 +50;
    var nodes = [];
    for(var i=0;i<len;i++){
        //
        if(domainY[i] > origin.y1 && domainY[i] < origin.y2 && origin.x1 < xAxis && origin.x2 > xAxis-80 ){
            console.log(domainSet[i]);
            nodes.push(domainSet[i]);
        } 
    }
    sData.push(...filterNodes(tbody,nodes,nAxis)); 
    //console.log(sData);
    render(sData);
}
