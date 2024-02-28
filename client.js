let currentPage = 1;
const rowsPerPage = 20;
let logsData = [];

function login() {
    const username = $('#username').val();
    const password = $('#password').val();

    $.post('http://localhost:3000/login', { username, password }, (data) => {
        if (data.success) {
            alert('Login successful');
            // Show the log query interface
            $('#loginForm').hide();
            $('#logQueryInterface').show();

            const token = data.token;
            $.ajaxSetup({
                headers: {
                    'Authorization': token
                }
            });
            fetchLogs();
        } else {
            alert('Login failed');
        }
    });
}

function fetchLogs() {
    $.ajax({
        url: 'http://localhost:3000/logs',
        method: 'GET',
        contentType: 'application/json',
        success: function(logs) {
            logsData = logs;
            displayLogs(logsData);

            // Populate the dropdown with headers
            populateHeaderDropdown(logs);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(`Error fetching logs: ${textStatus}`, errorThrown);
        }
    });
}


function isTimestampInRange(timestamp, fromDate, toDate) {
    const logDate = new Date(timestamp);
    const startDate = fromDate ? new Date(`${fromDate}T00:00:00Z`) : null;
    const endDate = toDate ? new Date(`${toDate}T23:59:59Z`) : null;

    if (startDate && logDate < startDate) {
        return false;
    }

    if (endDate && logDate > endDate) {
        return false;
    }

    return true;
}


function displayLogs(logs) {
    // Clear previous logs and pagination
    document.getElementById('logTable').innerHTML = '';
    document.getElementById('pagination').innerHTML = '';

    // Calculate total number of pages
    const totalPages = Math.ceil(logs.length / rowsPerPage);

    // Generate page numbers
    const paginationDiv = document.getElementById('pagination');
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => goToPage(i));
        paginationDiv.appendChild(pageButton);
    }

    // Calculate start and end indices for the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the logs array to get the logs for the current page
    const logsForPage = logs.slice(startIndex, endIndex);

    // Create a table element
    const table = document.getElementById('logTable');
    
    // Create table headers dynamically based on the keys of the log entries
    const headers = getUniqueHeaders(logs);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Populate the table with log data
    logsForPage.forEach(log => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            const value = getValueForHeader(log, header);

            // Convert objects to string representation
            td.textContent = typeof value === 'object' ? JSON.stringify(value) : value;
            
            row.appendChild(td);
        });
        table.appendChild(row);
    });
}


function populateHeaderDropdown(logs) {
    const selectHeaders = document.getElementById('selectHeaders');
    selectHeaders.innerHTML = ''; // Clear previous options

    const headers = getUniqueHeaders(logs);
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        selectHeaders.appendChild(option);
    });
}

function goToPage(page) {
    currentPage = page;
    displayLogs(logsData);
}


function applySearch() {
    const searchQuery = document.getElementById('search').value.trim().toLowerCase();
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    // Get selected headers from the dropdown
    const selectedHeaders = Array.from(document.getElementById('selectHeaders').selectedOptions).map(option => option.value);

    // Filter logs based on the regular expression, date range, and selected headers
    const filteredLogs = logsData.filter(log => {
        const isSearchMatch = isObjectMatchingSearch(log, searchQuery, selectedHeaders);
        const isTimestampInRange = (fromDate && toDate) ? isTimestampInRange(log.timestamp, fromDate, toDate) : true;

        return isSearchMatch && isTimestampInRange;
    });

    displayLogs(filteredLogs);
}

function isObjectMatchingSearch(obj, searchQuery, selectedHeaders) {
    // Helper function to recursively search through nested objects
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'object') {
                // Recursively search nested object
                if (isObjectMatchingSearch(value, searchQuery, selectedHeaders)) {
                    return true;
                }
            } else {
                // Check if the value matches the search query and is in the selected headers
                const strValue = String(value).toLowerCase();
                if ((selectedHeaders.length === 0 || selectedHeaders.includes(key)) && new RegExp(searchQuery, 'i').test(strValue)) {
                    return true;
                }
            }
        }
    }
    return false;
}


function clearFilter() {
    document.getElementById('search').value = ''; // Clear the search input
    document.getElementById('fromDate').value = ''; // Clear the from date input
    document.getElementById('toDate').value = ''; // Clear the to date input
    document.getElementById('selectHeaders').selectedIndex = -1; // Clear selected headers in dropdown
    displayLogs(logsData); // Display all logs without filtering
}


function getUniqueHeaders(logs) {
    const headers = new Set();
    logs.forEach(log => {
        Object.keys(log).forEach(header => {
            if (typeof log[header] === 'object') {
                Object.keys(log[header]).forEach(subHeader => {
                    headers.add(`${header} - ${subHeader}`);
                });
            } else {
                headers.add(header);
            }
        });
    });
    return Array.from(headers);
}

function getValueForHeader(log, header) {
    const nestedHeaders = header.split(' - ');
    let value = log;
    nestedHeaders.forEach(nestedHeader => {
        value = value && value[nestedHeader];
    });
    return value;
}

