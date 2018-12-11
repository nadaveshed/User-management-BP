const baseUrl = 'http://localhost:8080/MySite/webresources/query/';
let users

window.onload = function () {
    updateAccordionFromServer();
}

function updateAccordionFromServer() {
    const accordionDiv = $("#accordion");
    accordionDiv.accordion({collapsible: true});
    loadUsersFromServer().then(array => {
        if (array == null || array.length <= 0)
            return;
        users = array;
        array.forEach(row => {
            addSingleAccordion(row);
        });
        accordionDiv.accordion("refresh");
    });
}

function addSingleAccordion(user) {
    const header = $('<h3>');
    const body = $('<div>');
    $('#accordion').append(header).append(body);
    header.html(`${user.firstName} ${user.lastName}` + '<br>' + `${user.email}` + "\
    <br><label>From</label> <input id='" + user.userId + "_from_field'/><label> to</label><input id='" + user.userId + "_to_field'>\n\
    <button class='ui-button ui-widget ui-corner-all' id='" + user.userId + "_export_button' onclick=exportData(event)>Export data</button>");
    body.html(`<ul>${generateMeasurementsList(user)}</ul>`);
    toDatePickers();
}

function exportData(event) {
    event.stopPropagation();
    const btnId = $(event.srcElement).attr("id").split(' ')[0];
    const userId = parseInt(btnId);
    const foundUser = users.find(user => user.userId === userId);
    if (foundUser == null) {
        return;
    }
    const fromDate = moment($(`#${userId}_from_field`).datepicker("getDate"))
    const toDate = moment($(`#${userId}_to_field`).datepicker("getDate"))
    download(`export_user_${userId}.csv`, getCsvContent(foundUser, fromDate, toDate))
}

function getCsvContent(user, from, to) {
    const measurementsToPrint = user.measurements.
            sort((a, b) => {
                if (a.dateMs > b.dateMs) {
                    return -1;
                } else if (a.dateMs < b.dateMs) {
                    return 1;
                } else {
                    return 0;
                }
            }).
            filter(measure => moment(measure.dateMs).isSameOrAfter(from) && moment(measure.dateMs).isSameOrBefore(to));
    let toReturn = 'First Name, Last Name, Email, Systolic, Diastolic, Date\n';
    for (let i = 0; i < measurementsToPrint.length; i++) {
        toReturn += `${user.firstName}, ${user.lastName}, ${user.email}, ${measurementsToPrint[i].systolic}, ${measurementsToPrint[i].diastolic}, ${moment(measurementsToPrint[i].dateMs).format("YYYY-MM-DD HH:mm:ss")}\n`;
    }
    return toReturn;
}

function toDatePickers() {
    for (let i = 1; i < users.length; i++) {
        $(`#${i}_from_field`).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 3
        });

        $(`#${i}_to_field`).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 3
        });
    }
}

function generateMeasurementsList(user) {
    let toReturn = '';
    user.measurements.forEach(measurement => toReturn += `<p><li>Date: ${moment(measurement.dateMs).format("YYYY-MM-DD HH:mm:ss")}</li>
    <li>Systolic: ${JSON.stringify(measurement.systolic)}</li><li>Diastolic: ${JSON.stringify(measurement.diastolic)}</li></p>`);
    return toReturn;
}

$(function () {
    var dialog, form,
            // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
            emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            firstName = $("#firstname"),
            lastName = $("#lastname"),
            email = $("#email"),
            allFields = $([]).add(firstName).add(lastName).add(email),
            tips = $(".validateTips");

    function updateTips(t) {
        tips
                .text(t)
                .addClass("ui-state-highlight");
        setTimeout(function () {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max) {
        console.log(firstName);
        if (o.val().length > max || o.val().length < min) {
            o.addClass("ui-state-error");
            updateTips("Length of " + n + " must be between " +
                    min + " and " + max + ".");
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp(o, regexp, n) {
        if (!(regexp.test(o.val()))) {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }

    function addUser() {
        var valid = true;
        allFields.removeClass("ui-state-error");

        valid = valid && checkLength(firstName, "firstName", 2, 10);
        valid = valid && checkLength(lastName, "lastName", 2, 10);
        valid = valid && checkLength(email, "email", 6, 80);

        valid = valid && checkRegexp(firstName, /^[a-z]+$/i, "First name may consist of a-z, spaces and must begin with a letter.");
        valid = valid && checkRegexp(lastName, /^[a-z]+$/i, "Last name may consist of a-z, spaces and must begin with a letter.");
        valid = valid && checkRegexp(email, emailRegex, "eg. ui@jquery.com");

        if (valid) {
            $("#users tbody").append("<tr>" +
                    "<td>" + firstName.val() + "</td>" +
                    "<td>" + lastName.val() + "</td>" +
                    "<td>" + email.val() + "</td>" +
                    "</tr>");
//            console.log("lastName:", lastName.val());
            const url = `addUser?firstName=${firstName.val()}&lastName=${lastName.val()}&email=${email.val()}`;
//            console.log("url:", url);
            fetch(baseUrl + url, {method: 'POST'}).then(res => {
//                console.log(res);
                updateAccordionFromServer();
            });
            dialog.dialog("close");
        }
        console.log("User created!");
        return valid;
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Create an account": addUser,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[ 0 ].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addUser();
    });

    $("#create-user").button().on("click", function () {
        dialog.dialog("open");
    });
});

$(function () {
    $("#dialog-confirm").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Delete all items": function () {
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
});

$(function () {
    var dateFormat = "mm/dd/yy",
            from = $("#from").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3
    })
            .on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            }),
            to = $("#to").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3
    })
            .on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }
});

function download(filename, content) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', filename);
    element.style.display = 'none'
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function loadUsersFromServer() {
    const url = 'getUsers';
    return fetch(baseUrl + url).then(res => res.json());
}