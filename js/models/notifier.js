let notifier = (() => {
    function handleError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }


    function showInfo(message) {
        let infoBox = $('#infoBox');
        let infoBoxSpan = infoBox.find('span');
        infoBoxSpan.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        let errorBoxSpan = errorBox.find('span');
        errorBoxSpan.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    return {
        showInfo,
        showError,
        handleError
    }
})();