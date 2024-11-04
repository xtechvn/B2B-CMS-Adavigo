// Requires jQuery

// Initialize slider:
$(document).ready(function () {
    $('.noUi-handle').on('click', function () {
        $(this).width(50);
    });
    var rangeSlider = document.getElementById('slider-range');
    var moneyFormat = wNumb({
        decimals: 0,
        thousand: ',',
    });
    noUiSlider.create(rangeSlider, {
        start: [0, 4000000],
        step: 1,
        range: {
            'min': [0],
            'max': [10000000]
        },
        format: moneyFormat,
        connect: true
    });

    // Set visual min and max values and also update value hidden form inputs
    rangeSlider.noUiSlider.on('update', function (values, handle) {
        document.getElementById('slider-range-value1').innerHTML = values[0];
        document.getElementById('slider-range-value2').innerHTML = values[1];
        document.getElementById('min-value').value = values[0];
        document.getElementById('max-value').value = values[1];
        document.getElementById
        document.getElementsByName('min-value').value = moneyFormat.from(
            values[0]);
        document.getElementsByName('max-value').value = moneyFormat.from(
            values[1]);
    });

    rangeSlider.noUiSlider.on('change.one', function (values) {
        filterFare.minValue = Number(values[0].split(',').join(''));
        filterFare.maxValue = Number(values[1].split(',').join(''));
        applyFilterFare(true);
    });
});