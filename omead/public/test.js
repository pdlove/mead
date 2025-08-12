$(document).ready(function () {
    function getApiUrl() {
        const stack = $("#stack-select").val();
        const model = $("#model-select").val();
        if (!stack || !model) {
            return null;
        }
        return `/api/${stack}/${model}`;
    }

    function fetchData() {
        const apiUrl = getApiUrl();
        if (!apiUrl) return alert("Please select a stack and model.");

        $.get(apiUrl, function (data) {
            const rows = data.items.map(item => `
                <tr data-id="${item.id}">
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.remoteSource || ""}</td>
                    <td>${item.localPath}</td>
                    <td>${item.enabled ? "Yes" : "No"}</td>
                </tr>`).join("");
            $("#stack-table-body").html(rows);
        });
    }

    function openModal(item = {}) {
        $("#stackID").val(item.id || "");
        $("#name").val(item.name || "");
        $("#description").val(item.description || "");
        $("#remoteSource").val(item.remoteSource || "");
        $("#localPath").val(item.localPath || "");
        $("#enabled").prop("checked", item.enabled || false);
        $("#stackModal").modal("show");
    }

    function saveItem() {
        const apiUrl = getApiUrl();
        if (!apiUrl) return alert("Please select a stack and model.");

        const itemId = $("#stackID").val();
        const itemData = {
            name: $("#name").val(),
            description: $("#description").val(),
            remoteSource: $("#remoteSource").val(),
            localPath: $("#localPath").val(),
            enabled: $("#enabled").prop("checked")
        };

        if (itemId) {
            $.ajax({
                url: `${apiUrl}/${itemId}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(itemData),
                success: function () {
                    fetchData();
                    $("#stackModal").modal("hide");
                }
            });
        } else {
            $.post(apiUrl, itemData, function () {
                fetchData();
                $("#stackModal").modal("hide");
            });
        }
    }

    function deleteItem() {
        const apiUrl = getApiUrl();
        if (!apiUrl) return alert("Please select a stack and model.");

        const selectedRow = $("tr.selected");
        if (selectedRow.length === 0) return alert("Select an item to delete.");

        const itemId = selectedRow.data("id");
        if (confirm("Are you sure you want to delete this item?")) {
            $.ajax({
                url: `${apiUrl}/${itemId}`,
                type: "DELETE",
                success: function () {
                    fetchData();
                }
            });
        }
    }

    $(document).on("click", "tr", function () {
        $("tr").removeClass("selected");
        $(this).addClass("selected");
    });

    $("#add-button").on("click", function () {
        openModal();
    });

    $("#edit-button").on("click", function () {
        const selectedRow = $("tr.selected");
        if (selectedRow.length === 0) return alert("Select an item to edit.");
        const itemId = selectedRow.data("id");
        const apiUrl = getApiUrl();
        if (!apiUrl) return alert("Please select a stack and model.");

        $.get(`${apiUrl}/${itemId}`, function (data) {
            openModal(data);
        });
    });

    $("#delete-button").on("click", deleteItem);
    $("#stack-form").on("submit", function (event) {
        event.preventDefault();
        saveItem();
    });

    $("#refresh-button").on("click", fetchData);
    $("#stack-select, #model-select").on("change", fetchData);
});
