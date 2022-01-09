$(document).ready(function () {
    let page = 1;
    const getTableData2 = (page) => {
        // filtreler etkinleştirilip  arayüzde düzenlenecek
        
        let data = {
            page: page,
        }

        $.ajax({
            type: "POST",
            url: "https://marketapi-bfltu.ondigitalocean.app/marketleregorefiyatlar/",
            data: JSON.stringify(data),
            beforeSend: function () {
                $("#footer").attr("hidden", true)
                $("#prevNextBox").attr("hidden", true);
                $("#market-table2").attr("hidden", true);
                $("#loaderTable").removeAttr("hidden");

            },
            success: function (response) {
                $("#footer").removeAttr("hidden")
                $("#prevNextBox").removeAttr("hidden");
                $("#market-table2").removeAttr("hidden");
                $("#loaderTable").attr("hidden", true);

                $(".loading").attr("hidden", true);
                setTimeout(() => {
                    console.log("getTableData2");
                    $("#market-table2 tbody").empty();
                    $.each(response, function (k, v) {
                        let rows = `
                    <tr>
                        <td>${v[0]}</td>
                        <td>${v[2]}</td>
                        <td>${v[3]}</td>
                        <td>${v[4].toFixed(2)} TL</td>
                        <td>${v[5].toFixed(2)} TL</td>
                        <td>${v[6].toFixed(2)} TL</td>
                        <td>${v[7]}</td>
                    </tr>
                    <tr class="spacer"></tr>
                    `
                        $("#market-table2 tbody").append(rows)
                    })

                    $('#market-table2').DataTable({
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
        $('#market-table2').DataTable().clear().draw();
        // console.log("++")
        // productName = $("#txtProductName").val();
        // productCategory = $("#categories").val();
        // productMarketId = $("#markets").val();
        // productBrand = $("#txtProductBrand").val();
        // productMinPrice = $("#txtProductMinPrice").val();
        // ProductmaxPrice = $("#txtProductMaxPrice").val();
        // productUnit = $("#txtProductUnit").val();
        page++
        document.getElementById("page").innerHTML = page.toString()
        prevbuttonActivKontrol()
        getTableData2(page)

    };
    const prevPage = () => {
        $('#market-table2').DataTable().clear().draw();
        page--
        // productName = $("#txtProductName").val();
        // productCategory = $("#categories").val();
        // productMarketId = $("#markets").val();
        // productBrand = $("#txtProductBrand").val();
        // productMinPrice = $("#txtProductMinPrice").val();
        // ProductmaxPrice = $("#txtProductMaxPrice").val();
        // productUnit = $("#txtProductUnit").val();
        document.getElementById("page").innerHTML = page.toString()
        prevbuttonActivKontrol()
        getTableData2(page)

    };

    const getResults = () => {
        page = 1;
        document.getElementById("page").innerHTML = page.toString()
        prevbuttonActivKontrol()
        //----------filtreler eklenecek---------------
        // console.log("getResults")
        // productName = $("#txtProductName").val();
        // productCategory = [];
        // console.log("pc" + $("#categories").val())
        // if ($("#categories").val() != "") {
        //     productCategory0 = ($("#categories").val()).toString().split(",");
        //     productCategory = productCategory0.map(function (x) {
        //         return parseInt(x, 10);
        //     });
        // }
        // productMarketId = $("#markets").val();
        // productBrand = $("#txtProductBrand").val();
        // productMinPrice = $("#txtProductMinPrice").val();
        // ProductmaxPrice = $("#txtProductMaxPrice").val();
        // productUnit = $("#txtProductUnit").val();

        // console.log("productName"+productName);
        // console.log("productCategory" + typeof (productCategory));
        // console.log("productMarketId"+productMarketId);
        // console.log("productBrand"+productBrand);
        // console.log("productMinPrice"+productMinPrice);
        // console.log("ProductmaxPrice"+ProductmaxPrice);
        // console.log("productUnit" + productUnit)
        getTableData2(page)
    };

    $("#btnGetResults").click(function () {
        getResults();
    });


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
        // page = 1;
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

    getTableData2(page);
    function html_table_to_excel(type) {
        var data = document.getElementById('market-table2');

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

    const export_button = document.getElementById('btnExport2');

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