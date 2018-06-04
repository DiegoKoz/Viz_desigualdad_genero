
//Defino funciones
var geom_bar = function(id, width_f, height_f, data_source, group, formato,letra, filtro, legend_f) {

    var svg = d3.select(id).append("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = width_f - margin.left - margin.right,
        height = height_f - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
        formatCount = d3.format(formato);


    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var x1 = d3.scaleBand()
        .padding(0.05);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#aa165a", "#16aa66"]);
    
    d3.csv(data_source, function (d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
    }, function (error, data) {
        if (error) throw error;

        var keys = data.columns.slice(1);

        if (filtro){
            var data = data.filter(data => data[group] == filtro);
        }

        
        x0.domain(data.map(function (d) {
            return d[group];
        }));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function (d) {
            return d3.max(keys, function (key) {
                return d[key];
            });
        })]).nice();

        g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function (d) {
                return "translate(" + x0(d[group]) + ",0)";
            })
            .selectAll("rect")
            .data(function (d) {
                return keys.map(function (key) {
                    return {key: key, value: d[key]};
                });
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return x1(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", x1.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .attr("fill", function (d) {
                return z(d.key);
            });

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        // g.append("g")
        //     .attr("class", "axis")
        //     .call(d3.axisLeft(y).ticks(null, formato))
        //     .append("text")
        //     .attr("x", 2)
        //     .attr("y", y(y.ticks().pop()) + 0.5)
        //     .attr("dy", "0.32em")
        //     .attr("fill", "#000")
        //     .attr("font-weight", "bold")
        //     .attr("text-anchor", "start");

        /*Agrego texto*/
        var gE = g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d) {
                return "translate(" + x0(d[group]) + ",0)";
            });

        gE
            .selectAll("rect")
            .data(function(d) {
                return keys.map(function(key) {
                    return {
                        key: key,
                        value: d[key]
                    };
                });
            })
            .enter().append("rect")
            .attr("class", "bar1")
            .attr("x", function(d) {
                return x1(d.key);
            })
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("width", x1.bandwidth())
            .attr("height", function(d) {
                return height - y(d.value);
            })
            .attr("fill", function(d) {
                return z(d.key);
            });


        gE.selectAll("text")
            .data(function(d) {
                return [d['Mujeres'], d['Varones']];
            })
            .enter()
            .append("text")
            .attr("font-size",letra)
            .attr("class", function(d) {
                return "bar-text";
            })
            .attr("fill", "#000")
            .text(function(d) {
                return formatCount(d)
            })
            .attr("transform", function(d, i) {
                //var x0 = x1.bandwidth() * i + x1.bandwidth()/6;
                //var x0 = x1.bandwidth() * i + (x1.bandwidth() - 10) / 2,
                //var df = (formatCount(d).length * 5.5) + (letra*0.8);
                var df = (formatCount(d).length * 7) + (letra*0.4);
                if(df<x1.bandwidth()){
                    var x0 = x1.bandwidth() * i + (x1.bandwidth() - df) / 2;
                }
                else{
                    var x0 = 5 + (x1.bandwidth() * i) + ((x1.bandwidth() - df) / 2);
                }
                var y0 = y(d) - height*0.01;
                return "translate(" + x0 + "," + y0 + ")";
            })

        /*fin texto*/

        if(legend_f){
            var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) {
                return d;
            });
        }        
    });
}

var geom_bar_multiple = function(id, width_f, height_f, data_source, group, formato,letra, legend_f, array){    
    var g1 = d3.select(id)
                .append("svg")
                .attr("id", id.replace("#", "") + "_1")
                .attr("width", width_f/2)
                .attr("height", height_f/2)
                .attr("x",0)
                .attr("y",0);

    var g2 = d3.select(id)
                .append("svg")
                .attr("id", id.replace("#", "") + "_2")
                .attr("width", width_f/2)
                .attr("height", height_f/2)
                .attr("x",width_f/2)
                .attr("y",0);

    var g3 = d3.select(id)
                .append("svg")
                .attr("id", id.replace("#", "") + "_3")
                .attr("width", width_f/2)
                .attr("height", height_f/2)
                .attr("x",0)
                .attr("y",height_f/2);
    
    var g4 = d3.select(id)
                .append("svg")
                .attr("id", id.replace("#", "") + "_4")
                .attr("width", width_f/2)
                .attr("height", height_f/2)
                .attr("x",width_f/2)
                .attr("y",height_f/2);

    for(var i = 0; i<5; i++){
        var temp = "_" + (i+1);
        geom_bar(id + temp, width_f/2, height_f/2, data_source, group, formato, letra, filtro = array[i], legend_f )
    }
    
}

var dot_matrix = function(id, data_source, x, y, dim, s){
    d3.csv(data_source, function (d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
    }, function (error, data){
        var mujeres = data.map(function(x){return x['Mujeres'] * 100;});
        var hombres = data.map(function(x){return x['Varones'] * 100;});

        var svg = d3.select(id);
        for(i=0;i<=9;i++){
            for(j=1;j<=10;j++){
                if(i*10+j <= mujeres){
                    svg.append("rect")
                        .attr("x",x + (j-1) * (dim+s))
                        .attr("y",y + i * (dim+s))
                        .attr("height",dim)
                        .attr("width",dim)
                        .style("fill",d3.rgb("#aa165a"));
                }
                else{
                    svg.append("rect")
                        .attr("x",x + (j-1) * (dim+s))
                        .attr("y",y + i * (dim+s))
                        .attr("height",dim)
                        .attr("width",dim)
                        .style("fill",d3.rgb("#16aa66"));

                }
            } 
        }  
    });

    
}

//Eventos
$(document).ready(function(){
    var toggleAffix = function(affixElement, scrollElement, wrapper) {
        var height = affixElement.outerHeight(),
            top = wrapper.offset().top;

        if (scrollElement.scrollTop() >= top){
            wrapper.height(height);
            affixElement.addClass("affix");
        }
        else {
            affixElement.removeClass("affix");
            wrapper.height('auto');
        }
    };

    $('[data-toggle="affix"]').each(function() {
        var ele = $(this),
            wrapper = $('<div></div>');
        ele.before(wrapper);
        $(window).on('scroll resize', function() {
            toggleAffix(ele, $(this), wrapper);
        });
        // init
        toggleAffix(ele, $(window), wrapper);
    });

    //Defino arrays de Indicadores para los graficos 1 y 2
    var array_grafico_1 = ["Tasa Actividad", "Tasa Desocupacion", "Tasa Empleo", "Tasa Subocupación"];
    var array_grafico_2 = ["Jefes", "Dirección", "Trabajadores Asalariados", "Cuentapropia"];

    //Cargo graficos    
    geom_bar_multiple("#grafico_1", 435, 435, "data/Grafico1.csv", "Indicadores", ".0%", 15, false, array_grafico_1);
    geom_bar_multiple("#grafico_2", 435, 435, "data/Grafico2.csv", "JERARQUIA", ".0%", 15, false, array_grafico_2);
    dot_matrix('#grafico_3', "data/Grafico3.csv", 5, 10, 37, 3);
    geom_bar("#grafico_4",435,435,"data/Grafico4_ms.csv", "CALIFICACION","$.0f", 10, false, true);
    geom_bar("#grafico_5",435,435,"data/Grafico5_ms.csv", "NIVEL_EDUCATIVO","$.0f", 10, false, true);
    geom_bar("#grafico_6",435,435,"data/Grafico6.csv", "DECINDR", ".0%", 10, false, false);
});

//Selección mensual para grafico 4
$('#grafico_4_mensual').click(function(){
    $('#grafico_4_mensual').addClass('active');
    $('#grafico_4_hora').removeClass();
    $('#grafico_4_hora').addClass('nav-link');
    $('#grafico_4').empty();
    geom_bar("#grafico_4",435,435,"data/Grafico4_ms.csv", "CALIFICACION","$.0f", 10, false, true);
});

//Selección por hora para grafico 4
$('#grafico_4_hora').click(function(){
    $('#grafico_4_mensual').removeClass();
    $('#grafico_4_mensual').addClass('nav-link');
    $('#grafico_4_hora').addClass('active');
    $('#grafico_4').empty();
    geom_bar("#grafico_4",435,435,"data/Grafico4_hr.csv", "CALIFICACION","$.0f", 10, false, true);
});

//Selección mensual para grafico 5
$('#grafico_5_mensual').click(function(){
    $('#grafico_5_mensual').addClass('active');
    $('#grafico_5_hora').removeClass();
    $('#grafico_5_hora').addClass('nav-link');
    $('#grafico_5').empty();
    geom_bar("#grafico_5",435,435,"data/Grafico5_ms.csv", "NIVEL_EDUCATIVO","$.0f", 10, false, true);
});

//Selección por hora para grafico 5
$('#grafico_5_hora').click(function(){
    $('#grafico_5_mensual').removeClass();
    $('#grafico_5_mensual').addClass('nav-link');
    $('#grafico_5_hora').addClass('active');
    $('#grafico_5').empty();
    geom_bar("#grafico_5",435,435,"data/Grafico5_hr.csv", "NIVEL_EDUCATIVO","$.0f", 10, false, true);
});