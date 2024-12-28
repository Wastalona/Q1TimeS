function delete_request(event) {
    event.preventDefault();
    if (confirm("Вы уверены в своих действиях?")) {
        const form = document.getElementById('delete-form');
        const SelectedIPs = Array.from(form.querySelectorAll('input[name="SelectedIPs"]:checked')).map(input => input.value);

        if (SelectedIPs.length === 0) {
            alert('Выберите хотя бы один IP-адрес для удаления.');
            return;
        }
        const token = getTokenFromCookie();
        const queryString = SelectedIPs.map(ip => encodeURIComponent(ip)).join('&SelectedIPs=');
        fetch(`/Admin/DeleteAddresses?SelectedIPs=${queryString}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
        })
        .then(response => {
            if (response.ok)
                window.location.reload();
            else
                throw new Error("Произошла ошибка при отправке опроса.");
        })
        .catch(() => {
            alert('Произошла ошибка при отправке опроса.');
        });
    }
}

function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('#ip-list .item-checkbox');
    const allSelected = Array.from(checkboxes).every(checkbox => checkbox.checked);

    checkboxes.forEach(checkbox => {
        checkbox.checked = !allSelected;
        checkbox.dispatchEvent(new Event('change'));
    });
}