$(document).ready(function () {
    const getTableData2 = () => {

        let data = {
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

                    $('#getTableData22').DataTable({
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

    getTableData2();
    if ($(window).width() > 991) {
        $('.navbar-light .d-menu').hover(function () {
            $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
        }, function () {
            $(this).find('.sm-menu').first().stop(true, true).delay(120).slideUp(100);
        });
    }

});