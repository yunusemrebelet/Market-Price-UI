// Initialize the echarts instance based on the prepared dom
var myChart = echarts.init(document.getElementById('main'));

const chartHandler = (product_id, product_name) => {

    // console.log(product_id)
    let data = {
        product_id: product_id
    };

    $("#productChartName").text(product_name);

    let historyDates = [];
    let historyPrices = [];

    $.ajax({
        type: "POST",
        url: "https://marketapi-bfltu.ondigitalocean.app/listHP/",
        data: JSON.stringify(data),
        beforeSend: function () {
            $("#main").attr("hidden", true);
            $("#loader").removeAttr("hidden");

        },
        success: function (response) {
            $("#loader").attr("hidden", true);
            $("#main").removeAttr("hidden");
            $.each(response, function (k, v) {
                historyDates.push(v.created_date.split("T")[0]);
                historyPrices.push(v.product_price);

            });

            // Specify the configuration items and data for the chart
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: [{
                    type: 'category',
                    data: historyDates,
                    axisLine: {
                        lineStyle: {
                            color: "#999"
                        }
                    },
                    axisLabel: {
                        rotate: 60
                    }
                }],
                yAxis: [{
                    type: 'value',
                    splitNumber: 4,
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#DDD'
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: "#333"
                        },
                    },
                    nameTextStyle: {
                        color: "#999"
                    },
                    splitArea: {
                        show: false
                    }
                }],
                series: [{
                    name: 'Fiyat',
                    type: 'line',
                    data: historyPrices,
                    lineStyle: {
                        normal: {
                            width: 2,
                            color: {
                                type: 'linear',

                                colorStops: [{

                                    offset: 0,
                                    color: 'orange' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            shadowColor: 'rgba(72,216,191, 0.3)',

                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'black',
                            borderWidth: 12,
                            /*  shadowColor: 'rgba(72,216,191, 0.3)',
                             shadowBlur: 100, */
                            borderColor: "black"
                        }
                    },
                    smooth: true
                }]
            };

            // Display the chart using the configuration items and data just specified.
            myChart.setOption(option);

        },
        error: function () {
            console.log("error")
        },
    });
}

$(document).ready(function () {

    let page = 1;
    let productName = "";
    let productCategory = [];
    let productMarketId = "";
    let productBrand = "";
    var productMinPrice = 0;
    let ProductmaxPrice = Infinity;
    let productUnit = "";
    const getTableData = (page, productName, productCategory, productMarketId, productBrand, productMinPrice, ProductmaxPrice, productUnit) => {

        let data = {
            page: page,
            search_word: productName,
            category_list: productCategory,
            market_id: productMarketId,
            product_brand: productBrand,
            min_price: productMinPrice,
            max_price: ProductmaxPrice,
            unit: productUnit
        }

        $.ajax({
            type: "POST",
            url: "https://marketapi-bfltu.ondigitalocean.app/listproducts/",
            data: JSON.stringify(data),
            beforeSend: function () {
                $("#footer").attr("hidden", true)
                $("#prevNextBox").attr("hidden", true);
                $("#market-table").attr("hidden", true);
                $("#loaderTable").removeAttr("hidden");

            },
            success: function (response) {
                $("#footer").removeAttr("hidden")
                $("#prevNextBox").removeAttr("hidden");
                $("#market-table").removeAttr("hidden");
                $("#loaderTable").attr("hidden", true);

                $(".loading").attr("hidden", true);
                setTimeout(() => {
                    // console.log("getTableData");
                    $("#market-table tbody").empty();
                    $.each(response, function (k, v) {
                        let rows = `
                    <tr>
                        <td style="width:160px;"><img src="${v.product_image}" alt="${v.product_name}"></td> 
                        <td>${v.product_name}</td>
                        <td>${v.product_brand}</td>
                        <td>${v.market_name}</td>
                        <td>${v.product_unit}</td>
                        <td>${v.product_price.toFixed(2)} TL</td>
                        <td>${v.product_category}</td>
                        <td><a target="_blank" href="${v.product_link}"><i data-toggle="tooltip" data-placement="bottom" title="Ürünü İncele" style="font-size: 18px; color: #fb8332;" class='bx bx-link-external'></a></i>
                        <a onclick="chartHandler(this.id, this.class)" class="v.product_name" id=${v.id} data-toggle="modal" data-target="#chartModal"><i data-toggle="tooltip" data-placement="bottom" title="Fiyat Geçmişi" style="font-size: 18px; color: #fb8332; cursor:pointer;" class='bx bx-bar-chart-alt-2 chartHandler'></a></i></td>
                    </tr>
                    <tr class="spacer"></tr>
                    `
                        $("#market-table tbody").append(rows)
                    })

                    $('#market-table').DataTable({
                        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">',
                        language: {
                            url: '//cdn.datatables.net/plug-ins/1.11.3/i18n/tr.json'
                        },
                        "bLengthChange": false,
                        "bInfo": false,
                        "paging": false,
                        "destroy": true,
                        "responsive": true
                    });
                }, 100);

            },
            error: function () {
                console.log("error")
            },

        });
    }
    const nextPage = () => {
        $('#market-table').DataTable().clear().draw();;
        // console.log("++")
        productName = $("#txtProductName").val();
        productCategory = $("#categories").val();
        productMarketId = $("#markets").val();
        productBrand = $("#txtProductBrand").val();
        productMinPrice = $("#txtProductMinPrice").val();
        ProductmaxPrice = $("#txtProductMaxPrice").val();
        productUnit = $("#txtProductUnit").val();
        page++
        prevbuttonActivKontrol()
        getTableData(page, productName, productCategory, productMarketId, productBrand, productMinPrice, ProductmaxPrice, productUnit)

    };
    const prevPage = () => {
        $('#market-table').DataTable().clear().draw();
        page--
        productName = $("#txtProductName").val();
        productCategory = $("#categories").val();
        productMarketId = $("#markets").val();
        productBrand = $("#txtProductBrand").val();
        productMinPrice = $("#txtProductMinPrice").val();
        ProductmaxPrice = $("#txtProductMaxPrice").val();
        productUnit = $("#txtProductUnit").val();
        prevbuttonActivKontrol()
        getTableData(page, productName, productCategory, productMarketId, productBrand, productMinPrice, ProductmaxPrice, productUnit)

    };

    const getResults = () => {
        page = 1;
        prevbuttonActivKontrol()
        console.log("getResults")
        productName = $("#txtProductName").val();
        productCategory = [];
        console.log("pc" + $("#categories").val())
        if ($("#categories").val() != "") {
            productCategory0 = ($("#categories").val()).toString().split(",");
            productCategory = productCategory0.map(function (x) {
                return parseInt(x, 10);
            });
        }
        productMarketId = $("#markets").val();
        productBrand = $("#txtProductBrand").val();
        productMinPrice = $("#txtProductMinPrice").val();
        ProductmaxPrice = $("#txtProductMaxPrice").val();
        productUnit = $("#txtProductUnit").val();

        // console.log("productName"+productName);
        console.log("productCategory" + typeof (productCategory));
        // console.log("productMarketId"+productMarketId);
        // console.log("productBrand"+productBrand);
        // console.log("productMinPrice"+productMinPrice);
        // console.log("ProductmaxPrice"+ProductmaxPrice);
        console.log("productUnit" + productUnit)
        getTableData(page, productName, productCategory, productMarketId, productBrand, productMinPrice, ProductmaxPrice, productUnit)
    };

    $("#btnGetResults").click(function () {
        // console.log("getresultsbtn clicked")
        getResults();
    });

    getTableData(page);

    $(".btnNext").click(function () {
        nextPage();
    });
    $(".btnPrev").click(function () {
        prevPage();
    })

    let marketId = [];
    const getTableDataCategory = (marketId2) => {
        marketId[0] = marketId2
        let category_data = {
            market_id: marketId
        }
        $("#categories").empty();
        const getCategories = () => {
            $.ajax({
                type: "POST",
                url: "https://marketapi-bfltu.ondigitalocean.app/listproductcategory/",
                data: JSON.stringify(category_data),
                dataType: 'json', // added data type
                success: function (response) {
                    $.each(response, function (k, v) {
                        let options = `
                        <option value="${v.id}">${v.product_category + " (" + marketDon(v.market_id) + ")"}</option>`
                        $("#categories").append(options);
                    })
                }
            });
        }
        getCategories();
        $('#categories').select2({
            placeholder: "Kategori(ler) Seçiniz",
            language: {
                noResults: function (params) {
                    return "Kategori Bulunamadı!";
                },
            },

        });
    }
    getTableDataCategory()

    function marketDon(market_id) {
        const textMarkets = ['Carrefoursa', 'Migros', 'A101', 'Şok']
        return textMarkets[market_id - 1];
    }

    const getMarkets = () => {
        const textMarkets = ['Carrefoursa', 'Migros', 'A101', 'Şok']
        for (let i = 0; i < textMarkets.length; i++) {
            let options = `<option value="${(i + 1)}">${textMarkets[i]}</option>`
            $("#markets").append(options);
        }
    }
    getMarkets();
    $('#markets').select2({
        allowClear: true,
        language: {
            noResults: function (params) {
                return "Market Bulunamadı!";
            },
        },

        placeholder: "Market Seçiniz",

    });

    function prevbuttonActivKontrol() {
        const button = document.querySelector('.btnPrev');
        if (page > 1)
            button.disabled = false;
        else
            button.disabled = true;
    }
    //filtreleri temizleme
    //kategori market id ve page kısmı silme gibi bişey eklemek gerekiyor
    $("#btnDeleteFilters").click(function () {
        document.getElementById("filterForm").reset();
        page = 1;
        prevbuttonActivKontrol();
        $('#markets').val(null); // Select the option with a value of '1'
        $('#markets').trigger('change');
        $('#categories').val(null); // Select the option with a value of '1'
        $('#categories').trigger('change');
    })
    //market filtresini dinleyerek kategoriyi filtrelenmesini sağlama
    $('#markets').change(function () {
        getTableDataCategory($('#markets').val());
    });


    function html_table_to_excel(type) {
        var data = document.getElementById('market-table');

        var file = XLSX.utils.table_to_book(data, {
            sheet: "sheet1"
        });

        XLSX.write(file, {
            bookType: type,
            bookSST: true,
            type: 'base64'
        });

        XLSX.writeFile(file, 'marketFiyatlari.' + type);
    }

    const export_button = document.getElementById('btnExport');

    export_button.addEventListener('click', () => {
        html_table_to_excel('xlsx');
    });


    if ($(window).width() > 991) {
        $('.navbar-light .d-menu').hover(function () {
            $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
        }, function () {
            $(this).find('.sm-menu').first().stop(true, true).delay(120).slideUp(100);
        });
    }

});