const TIME_UTILS = {
    differenceInDays: function (date1, date2) {
        var difference_In_Time = new Date(date2).getTime() - new Date(date1).getTime();
        var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
        return difference_In_Days;
    },

    formatDay: function (day = new Date()) {
        return day.getFullYear()
            + '-'
            + (String(day.getMonth() + 1).length == 1 ? `0${day.getMonth() + 1}` : day.getMonth() + 1)
            + '-'
            + (String(day.getDate()).length == 1 ? `0${day.getDate()}` : day.getDate())
    },

    timeConvert: function (n) {
        var num = Number(n);
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + "h" + rminutes + "m";
    },

    takeOffTime: function (day) {
        var hour = new Date(day).getHours();
        if (hour >= 0 && hour <= 5) {
            return 0; // Sáng sớm 00:00 - 6:00
        } else if (hour >= 6 && hour <= 11) {
            return 1; // Buổi sáng 06:00 - 12:00
        } else if (hour >= 12 && hour <= 17) {
            return 2; // Buổi chiều 12:00 - 18:00
        } else if (hour >= 18 && hour <= 24) {
            return 3; // Buổi tối 18:00 - 24:00
        }
    },

    getRange7DaysNextAndPrev: function (day = TIME_UTILS.formatDay(new Date())) {
        var dayRange = [];
        var range = [];
        differenceInDays = TIME_UTILS.differenceInDays(TIME_UTILS.formatDay(new Date()), TIME_UTILS.formatDay(new Date(day)));
        if (differenceInDays == 0) {
            range = [0, 1, 2, 3, 4, 5, 6];
        } else if (differenceInDays == 1) {
            range = [-1, 0, 1, 2, 3, 4, 5];
        } else if (differenceInDays == 2) {
            range = [-2, -1, 0, 1, 2, 3, 4];
        } else if (differenceInDays) {
            range = [-3, -2, -1, 0, 1, 2, 3];
        }
        range.forEach(function (item) {
            var _day = new Date(day);
            var nextDay = new Date(_day);
            nextDay.setDate(_day.getDate() + (item));
            dayRange.push(TIME_UTILS.formatDay(new Date(nextDay)));
        });
        // nextDay.setDate(day.getDate() + 1);
        return dayRange;
    },

    getRange7DaysNextAndPrevGo: function (day = this.formatDay(new Date())) {
        var dayRange = [];
        var range = [];
        differenceInDays = this.differenceInDays(this.formatDay(new Date()), this.formatDay(new Date(day)));
        if (differenceInDays == 0) {
            range = [0, 1, 2, 3, 4, 5, 6];
        } else if (differenceInDays == 1) {
            range = [-1, 0, 1, 2, 3, 4, 5];
        } else if (differenceInDays == 2) {
            range = [-2, -1, 0, 1, 2, 3, 4];
        } else if (differenceInDays) {
            range = [-3, -2, -1, 0, 1, 2, 3];
        }
        range.forEach(function (item) {
            var _day = new Date(day);
            var nextDay = new Date(_day);
            nextDay.setDate(_day.getDate() + (item));
            dayRange.push(TIME_UTILS.formatDay(new Date(nextDay)));
        });
        return dayRange;
    },

    getRange7DaysNextAndPrevBack: function (
        dateStart = this.formatDay(new Date()),
        dateSearchStart = this.formatDay(new Date()),
        dateSearchEnd = this.formatDay(new Date())
    ) {
        var dayRange = [];
        range = [0, 1, 2, 3, 4, 5, 6];
        differenceInDays = this.differenceInDays(this.formatDay(new Date(dateSearchStart)), this.formatDay(new Date(dateSearchEnd)));
        range.forEach(function (item) {
            var _day = new Date(dateStart);
            var nextDay = new Date(_day);
            nextDay.setDate(_day.getDate() + (item + differenceInDays));
            dayRange.push(TIME_UTILS.formatDay(new Date(nextDay)));
        });
        return dayRange;
    },

    nameDay: function (day = moment()) {
        var days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        var dayName = days[moment(day).day()];
        return dayName + ', ' + moment(day).date() + ' tháng ' + (moment(day).month() + 1);
    },

    nameDayMobile: function (day = moment()) {
        var days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        var dayName = days[moment(day).day()];
        return dayName + ', ' + moment(day).date() + '/' + (moment(day).month() + 1);
    },

    getViDateOfWeek: function (date) {
        var days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        var dateName = days[moment(date).day()];
        return dateName;
    },

    //nameDay: function (day = new Date()) {
    //    var days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    //    var dayName = days[day.getDay()];
    //    return dayName + ', ' + day.getDate() + ' tháng ' + (day.getMonth() + 1);
    //},

    //getViDate: function (day = new Date()) {
    //    return day.getDate() + ' tháng ' + (day.getMonth() + 1);
    //},

    getViDate: function (date) {
        return moment(date).date() + ' tháng ' + (moment(date).month() + 1);
    },

    makeTimer: function (endTime) {
        endTime = (Date.parse(endTime) / 1000);

        var now = new Date();
        now = (Date.parse(now) / 1000);

        var timeLeft = endTime - now;

        var days = Math.floor(timeLeft / 86400);
        var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
        var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
        var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

        if (hours < "10") { hours = "0" + hours; }
        if (minutes < "10") { minutes = "0" + minutes; }
        if (seconds < "10") { seconds = "0" + seconds; }

        var objTime = {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }
        return objTime
    },

    addMinuteForTime: function (date, minutes) {
        date.setMinutes(date.getMinutes() + minutes); // timestamp
        date = new Date(date); // Date object
        return date;
    },

    getShortDate: function (date) {
        return date.split('/')[0] + date.split('/')[1] + date.split('/')[2]
    },

    formatDateMomentJs: function (string, format) {
        return moment(string).format(format)
    },

    getFlightTime: function (date) {
        var hour = moment(date).hour();
        var minutes = moment(date).minutes();
        return ` ${hour >= 10 ? hour : '0' + hour}
                        :
                        ${minutes >= 10 ? minutes : '0' + minutes}`
    },

    getDateStringRequest: function (date) {
        return date.format('DD/MM/YYYY').split('/').join('')
    },

    getDateMomentStringFromString: function (dateSrting) {
        return dateSrting.split('/').reverse().join('-')
    },

    // DD/MM/YYYY
    getDateStringChangeYear: function (dateSrting, year, isSubtract) {
        var dateArray = dateSrting.split("/");
        var result = "";
        result = isSubtract ? dateArray[0] + "/" + dateArray[1] + "/" + (Number(dateArray[2]) - year) : dateArray[0] + "/" + dateArray[1] + "/" + (Number(dateArray[2]) + year);
        return result;
    },


    getTodayPicker: function () {
        var nowDate = new Date();
        return new Date(moment(nowDate).year(), moment(nowDate).month(), moment(nowDate).date(), 0, 0, 0, 0);
    },

    getDefaultOptionsDateRangePicker: function () {
        var nowDate = new Date();
        var maxLimitDate = new Date(moment(nowDate).year() + 1, moment(nowDate).month(), moment(nowDate).date(), 0, 0, 0, 0);

        return {
            "autoApply": true,
            "autoUpdateInput": false,
            "minDate": this.getTodayPicker(),
            "maxDate": maxLimitDate,
            "locale": {
                "format": 'DD MMM YYYY',
                "applyLabel": "Áp dụng",
                "cancelLabel": "Xóa",
                "daysOfWeek": [
                    "CN",
                    "T2",
                    "T3",
                    "T4",
                    "T5",
                    "T6",
                    "T7"
                ],
                "monthNames": [
                    "Tháng 1",
                    "Tháng 2",
                    "Tháng 3",
                    "Tháng 4",
                    "Tháng 5",
                    "Tháng 6",
                    "Tháng 7",
                    "Tháng 8",
                    "Tháng 9",
                    "Tháng 10",
                    "Tháng 11",
                    "Tháng 12"
                ],
                "firstDay": 1
            }
        };
    },

    // render one way date picker
    renderSingleDate: function (startDate) {
        $('input[name="date-picker-flight"]').daterangepicker({
            "singleDatePicker": true,
            "startDate": startDate,
            "opens": "right",
            ...this.getDefaultOptionsDateRangePicker()
        }, function (start) {
            var startValue = start.format('DD/MM/YYYY')
            UTILS.setStartDate(startValue);
        });
        $(function () {
            $('.calendar.right').show();
        });
    },

    // render 2 way date picker
    renderDateRangePicker: function (isTwoWayFare) {
        var startFormat = $("#date-start").val();
        startFormat = startFormat.split('/').reverse().join('-');
        var endFormat = $("#date-end").val();
        if (endFormat)
            endFormat = endFormat.split('/').reverse().join('-');
        else
            endFormat = startFormat;
        $('input[name="date-picker-flight"]').daterangepicker({
            "startDate": new Date(startFormat),
            "endDate": new Date(endFormat),
            ...this.getDefaultOptionsDateRangePicker()
        }, function (start, end) {
            if (start._isValid && end._isValid) {
                var startValue = start.format('DD/MM/YYYY');
                var endValue = end.format('DD/MM/YYYY');
                UTILS.setStartDate(startValue);
                if (isTwoWayFare) {
                    UTILS.setEndDate(endValue);
                }
            }
        });
    },

    setCountdowntime: function () {
        var endTime = this.addMinuteForTime(new Date(), CONSTANTS.TIMER)
        sessionStorage.setItem(CONSTANTS.STORAGE.COUNTER_KEY, endTime)
    },

    getSingleDatepickerOptions: function () {
        return {
            autoApply: true,
            autoUpdateInput: true,
            singleDatePicker: true,
            showDropdowns: true,
            locale: {
                "format": 'DD/MM/YYYY',
                "daysOfWeek": [
                    "CN",
                    "T2",
                    "T3",
                    "T4",
                    "T5",
                    "T6",
                    "T7"
                ],
                "monthNames": [
                    "Tháng 1",
                    "Tháng 2",
                    "Tháng 3",
                    "Tháng 4",
                    "Tháng 5",
                    "Tháng 6",
                    "Tháng 7",
                    "Tháng 8",
                    "Tháng 9",
                    "Tháng 10",
                    "Tháng 11",
                    "Tháng 12"
                ],
                "firstDay": 1
            }
        };
    },

    getMonthsFromCurrentMonth: function (number) {
        const start = moment().startOf('month');
        var result = [];

        for (let i = 0; i < number; i++) {
            var monthYear;
            if (i == 0) {
                monthYear = start.format('MM-YYYY');
            }
            else {
                monthYear = start.add(1, 'month').format('MM-YYYY');
            }

            var monthYearArray = monthYear.split('-');

            result.push({
                month: parseInt(monthYearArray[0]),
                year: parseInt(monthYearArray[1])
            })
        }

        return result;
    },

    getCalendarByMonthYear: function (year, month) {
        var monthDate = moment(year + '-' + month, 'YYYY-MM');
        var daysInMonth = monthDate.daysInMonth();
        var currentGroupIndex = 0;
        var groupDateByWeek = [];

        for (var i = 1; i <= daysInMonth; i++) {
            month = parseInt(month) < 10 ? "0" + parseInt(month) : month;
            var day = i < 10 ? "0" + i : i;
            var date = month + "-" + day + "-" + year;
            // 1 is Monday and 7 is Sunday
            // var weekDate = moment(date).isoWeekday();
            var weekDate = new Date(year, month - 1, day).getDay();

            weekDate = weekDate == 0 ? 7 : weekDate;

            var dateObj = {
                number: i,
                dateStr: date,
                weekDate
            }

            // current week
            if (weekDate <= 7 && weekDate > 1) {
                if (groupDateByWeek[currentGroupIndex])
                    groupDateByWeek[currentGroupIndex].push(dateObj);
                else
                    groupDateByWeek[currentGroupIndex] = [dateObj];

            } // new week
            else {
                if (groupDateByWeek.length > 0) {
                    currentGroupIndex++;
                }
                groupDateByWeek[currentGroupIndex] = [dateObj];
            }
        }

        return groupDateByWeek;
    }
}