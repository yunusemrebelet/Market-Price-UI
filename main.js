// Initialize the echarts instance based on the prepared dom
var myChart = echarts.init(document.getElementById('main'));


const chartHandler = (sku_id, product_name) => {
    console.log(sku_id)
    let data = {
        sku_id: sku_id
    };

    $("#productChartName").text(product_name);

    let historyDates = [];
    let historyPrices = [];

    $.ajax({
        type: "POST",
        url: "https://marketapi-bfltu.ondigitalocean.app/listHP/",
        data: JSON.stringify(data),
        success: function (response) {

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
    let productMadein = "";
    const getTableData = (page, productName, productCategory, productMarketId, productBrand, productMinPrice, ProductmaxPrice, productMadein) => {


        $(".loading").removeAttr("hidden");

        let data = {
            page: page,
            search_word: productName,
            category_list: [6],
            market_id: productMarketId,
            product_brand: productBrand,
            min_price: productMinPrice,
            max_price: ProductmaxPrice,
            product_madein: productMadein
        }

        $.ajax({
            type: "POST",
            url: "https://marketapi-bfltu.ondigitalocean.app/listproducts/",
            data: JSON.stringify(data),
            success: function (response) {
                $(".loading").attr("hidden", true);
                setTimeout(() => {
                    console.log("getTableData");
                    $("#market-table tbody").empty();
                    $.each(response, function (k, v) {
                        let rows = `
                    <tr>
                        <td style="width:160px;"><img src="${v.product_image}" alt="${v.product_name}"></td> 
                        <td>${v.product_name}</td>
                        <td>${v.product_brand}</td>
                        <td>${v.market_name}</td>
                        <td>${v.product_unit}</td>
                        <td>${v.product_price} TL</td>
                        <td>${v.product_category}</td>
                        <td><a target="_blank" href="${v.product_link}"><i data-toggle="tooltip" data-placement="bottom" title="Ürünü İncele" style="font-size: 18px; color: #fb8332;" class='bx bx-link-external'></a></i>
                        <a onclick="chartHandler(this.id, this.class)" class="v.product_name" id=${v.sku_id} data-toggle="modal" data-target="#chartModal"><i data-toggle="tooltip" data-placement="bottom" title="Fiyat Geçmişi" style="font-size: 18px; color: #fb8332; cursor:pointer;" class='bx bx-bar-chart-alt-2 chartHandler'></a></i></td>
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
        console.log("++")
        productName = $("#txtProductName").val();
        productCategory = $("#categories").val();
        productMarketId = $("#markets").val();
        productBrand = $("#txtProductBrand").val();
        productMinPrice = $("#txtProductMinPrice").val();
        ProductmaxPrice = $("#txtProductMaxPrice").val();
        productMadein = $("#txtProductMadein").val();
        page++
        prevbuttonActivKontrol()
        getTableData(page, productName, productCategory, productMarketId, productBrand, productMinPrice, ProductmaxPrice, productMadein)

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
        productMadein = $("#txtProductMadein").val();
        prevbuttonActivKontrol()
        getTableData(page, productName, productCategory, productMarketId, productBrand, productMinPrice, ProductmaxPrice, productMadein)

    };

    const getResults = () => {
        prevbuttonActivKontrol()

        console.log("getResults")
        productName = $("#txtProductName").val();
        productCategory = $("#categories").val();
        productMarketId = $("#markets").val();
        productBrand = $("#txtProductBrand").val();
        productMinPrice = $("#txtProductMinPrice").val();
        ProductmaxPrice = $("#txtProductMaxPrice").val();
        productMadein = $("#txtProductMadein").val();

        // console.log("productName"+productName);
        // console.log("productCategory"+productCategory);
        // console.log("productMarketId"+productMarketId);
        // console.log("productBrand"+productBrand);
        // console.log("productMinPrice"+productMinPrice);
        // console.log("ProductmaxPrice"+ProductmaxPrice);
        // console.log("productMadein"+productMadein)
        getTableData(page, productName, productCategory, productMarketId, productBrand, productMinPrice, ProductmaxPrice, productMadein)
    };

    $("#btnGetResults").click(function () {
        console.log("getresultsbtn clicked")
        getResults();
    });

    getTableData(page);

    $(".btnNext").click(function () {
        nextPage();
    });
    $(".btnPrev").click(function () {
        prevPage();
    })

    const getCategories = () => {
        $.ajax({
            url: "https://marketapi-bfltu.ondigitalocean.app/listproductcategory/",
            type: 'GET',
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
        language: {
            noResults: function (params) {
                return "Kategori Bulunamadı!";
            },
        },

        placeholder: "Seçiniz",

    });

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
        $("#market-table tbody").empty();
        page = 1;
        prevbuttonActivKontrol();
    })


    if ($(window).width() > 991) {
        $('.navbar-light .d-menu').hover(function () {
            $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
        }, function () {
            $(this).find('.sm-menu').first().stop(true, true).delay(120).slideUp(100);
        });
    }

});

