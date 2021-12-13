$(document).ready(function () {
    let page = 1;
    let productName = "";
    const getTableData = (page, productName) => {

        let data = {
            page: page,
            search_word: productName
        }

        $.ajax({
            type: "POST",
            url: "https://marketapi-bfltu.ondigitalocean.app/listproducts/",
            data: JSON.stringify(data),
            success: function (response) {
                console.log("getTableData");
                $("#market-table tbody").empty();
                $.each(response, function (k, v) {
                    let rows = `
                    <tr>
                        <td><img src="${v.product_image}" alt="${v.product_name}"></td> 
                        <td>${v.product_name}</td>
                        <td>${v.product_brand}</td>
                        <td>${v.market_name}</td>
                        <td>${v.product_unit}</td>
                        <td>${v.product_price} TL</td>
                        <td>${v.product_category}</td>
                        <td><a target="_blank" href="${v.product_link}"><i data-toggle="tooltip" data-placement="bottom" title="Ürünü İncele" style="font-size: 18px; color: #fb8332;" class='bx bx-link-external'></a></i>
                        <a data-toggle="modal" data-target="#chartModal"><i data-toggle="tooltip" data-placement="bottom" title="Fiyat Geçmişi" style="font-size: 18px; color: #fb8332;" class='bx bx-bar-chart-alt-2'></a></i></td>
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

            },
            error: function () {
                console.log("error")
            },

        });
    }
    const nextPage = () => {
        console.log("nextpage");
        $('#market-table').DataTable().clear().draw();;
        console.log("++")
        page++
        productName = $("#txtProductName").val();
        getTableData(page, productName)

    };
    const prevPage = () => {
        console.log("prevpage");
        $('#market-table').DataTable().clear().draw();;
        console.log("++")
        page--
        productName = $("#txtProductName").val();
        getTableData(page, productName)

    };

    const getResults = () => {

        console.log("getResults")

        productName = $("#txtProductName").val();
        console.log(productName);
        getTableData(page, productName);

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
                    <option value="${v.category_id}">${v.product_category}</option>
                    `
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


    if ($(window).width() > 991) {
        $('.navbar-light .d-menu').hover(function () {
            $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
        }, function () {
            $(this).find('.sm-menu').first().stop(true, true).delay(120).slideUp(100);
        });
    }
});