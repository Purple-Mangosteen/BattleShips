let notifier = (() => {
    function handleError(reason) {
        //console.log(reason.responseJSON.description);
        showError(reason.responseJSON.description);
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